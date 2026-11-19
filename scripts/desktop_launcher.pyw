import os
import sys
import ctypes
import time
import socket
import shutil
import atexit
import subprocess
import webview

try:
    app_id = 'Sle8p.SmartSleepApp.1.0'
    ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID(app_id)
except Exception:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

CREATE_NO_WINDOW = 0x08000000
DETACHED_PROCESS = 0x00000008
HIDDEN_FLAGS = CREATE_NO_WINDOW | DETACHED_PROCESS

server_proc = None

def is_port_open(port: int) -> bool:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.35)
            return s.connect_ex(('127.0.0.1', port)) == 0
    except Exception:
        return False

def find_available_port(start_port: int = 3000, max_port: int = 3050) -> int:
    for p in range(start_port, max_port + 1):
        if not is_port_open(p):
            return p
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]

def cleanup():
    global server_proc
    if server_proc:
        try:
            subprocess.run(["taskkill", "/F", "/T", "/PID", str(server_proc.pid)], capture_output=True, creationflags=CREATE_NO_WINDOW)
        except Exception:
            pass

atexit.register(cleanup)

def main():
    global server_proc

    target_port = None
    if is_port_open(3000):
        target_port = 3000
    else:
        target_port = find_available_port(3000, 3050)
        node_bin = shutil.which('npm') or 'npm.cmd'
        server_proc = subprocess.Popen(
            [node_bin, 'run', 'dev', '--', '-p', str(target_port)],
            cwd=ROOT,
            creationflags=HIDDEN_FLAGS,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            shell=True
        )

        for _ in range(60):
            if is_port_open(target_port):
                break
            time.sleep(0.4)

    app_url = f"http://localhost:{target_port}"

    window = webview.create_window(
        title='Sle8p | Smart 8-Hour Sleep Tracker',
        url=app_url,
        width=460,
        height=920,
        min_size=(380, 700),
        background_color='#05050A'
    )

    webview.start()
    cleanup()

if __name__ == '__main__':
    main()
