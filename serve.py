#!/usr/bin/env python3
"""Small local preview server with HTTP Range support.

Python's built-in `http.server` does not support byte ranges, which stops
browsers from seeking inside MP4 files. This server adds the small piece
needed for the custom video players to scrub correctly.

Usage:
    python serve.py            # http://127.0.0.1:4173
    python serve.py 8080       # custom port
"""

from __future__ import annotations

import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

try:
    PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4173
except ValueError:
    PORT = 4173

RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)$")


class RangeReader:
    """A file-like wrapper that yields exactly the requested byte range."""

    def __init__(self, file_obj, length: int):
        self.file_obj = file_obj
        self.remaining = length

    def read(self, amount: int = -1) -> bytes:
        if self.remaining <= 0:
            return b""
        if amount is None or amount < 0 or amount > self.remaining:
            amount = self.remaining
        data = self.file_obj.read(amount)
        self.remaining -= len(data)
        return data

    def close(self) -> None:
        self.file_obj.close()


class PreviewHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self) -> None:
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def send_head(self):
        header = self.headers.get("Range")
        if not header:
            return super().send_head()

        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()

        try:
            file_obj = open(path, "rb")
        except OSError:
            self.send_error(404, "File not found")
            return None

        size = 0
        try:
            size = os.fstat(file_obj.fileno()).st_size
            match = RANGE_RE.match(header.strip())
            if not match:
                raise ValueError
            start_text, end_text = match.groups()
            if not start_text and not end_text:
                raise ValueError

            if not start_text:
                suffix = int(end_text)
                start = max(0, size - suffix)
                end = size - 1
            else:
                start = int(start_text)
                end = int(end_text) if end_text else size - 1

            if start >= size or end < start:
                raise ValueError

            end = min(end, size - 1)
            length = end - start + 1
            content_type = self.guess_type(path) or "application/octet-stream"

            self.send_response(206)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
            self.send_header("Content-Length", str(length))
            self.send_header("Last-Modified", self.date_time_string(os.fstat(file_obj.fileno()).st_mtime))
            self.end_headers()
            file_obj.seek(start)
            return RangeReader(file_obj, length)
        except (ValueError, OSError):
            file_obj.close()
            self.send_response(416)
            self.send_header("Content-Range", f"bytes */{size}")
            self.send_header("Content-Length", "0")
            self.end_headers()
            return None


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", PORT), PreviewHandler)
    print(f"He Siyu portfolio → http://127.0.0.1:{PORT}/")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
