#!/usr/bin/env python3
import subprocess
import sys
import os

VPS_IP = "159.89.113.242"
VPS_USER = "root"
VPS_PASS = "AVallon1231402@rooot"

# Read the setup script
script_path = os.path.join(os.path.dirname(__file__), "setup-on-server.sh")
with open(script_path, 'r') as f:
    setup_script = f.read()

# Use expect to handle password
expect_script = f'''#!/usr/bin/expect -f
set timeout 300
spawn ssh -o StrictHostKeyChecking=no {VPS_USER}@{VPS_IP}
expect "password:"
send "{VPS_PASS}\\r"
expect "# "
send "bash << 'REMOTE_SCRIPT'\\r"
send "{setup_script}"
send "REMOTE_SCRIPT\\r"
expect "# "
send "exit\\r"
expect eof
'''

# Try using expect
try:
    result = subprocess.run(
        ['expect', '-c', expect_script],
        capture_output=True,
        text=True,
        timeout=600
    )
    print(result.stdout)
    if result.stderr:
        print("STDERR:", result.stderr, file=sys.stderr)
    sys.exit(result.returncode)
except FileNotFoundError:
    print("expect not found. Trying alternative method...")
    # Fallback: print instructions
    print("\n" + "="*60)
    print("Please run this command manually:")
    print("="*60)
    print(f"\nscp infra/setup-on-server.sh root@{VPS_IP}:/tmp/")
    print(f"\nssh root@{VPS_IP}")
    print("chmod +x /tmp/setup-on-server.sh")
    print("/tmp/setup-on-server.sh")
    print("\n" + "="*60)
    sys.exit(1)
















