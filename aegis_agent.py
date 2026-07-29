import os
import sys
import time
import getpass
import socket
import platform
import subprocess
import requests
from cryptography.fernet import Fernet

# 1. GATEWAY & ENCRYPTION CONFIGURATION
RENDER_GATEWAY_URL = "https://aegis-ztna-9spx.onrender.com/api/gateway/evaluate"

# Persistent Master Key Management
KEY_FILE = "aegis_master.key"
if os.path.exists(KEY_FILE):
    with open(KEY_FILE, "rb") as kf:
        MASTER_KEY = kf.read()
else:
    MASTER_KEY = Fernet.generate_key()
    with open(KEY_FILE, "wb") as kf:
        kf.write(MASTER_KEY)

cipher = Fernet(MASTER_KEY)

# 2. SYSTEM TELEMETRY GATHERING
def get_system_posture():
    """Gathers real-time OS, machine name, user identity, and IP address."""
    user_name = getpass.getuser()
    hostname = socket.gethostname()
    os_info = f"{platform.system()} {platform.release()}"
    
    try:
        public_ip = requests.get('https://api.ipify.org', timeout=3).text
    except Exception:
        public_ip = "127.0.0.1"
        
    return {
        "user_principal": f"{user_name}@{hostname}.local",
        "os_info": os_info,
        "public_ip": public_ip
    }

# 3. REAL-TIME KEYSTROKE BIOMETRICS CAPTURE
def capture_live_biometrics(prompt_text):
    """Captures real-time typing inter-key timing (IKT) cadence in milliseconds."""
    print(f"\n[🔒 AEGIS BIOMETRIC CHALLENGE] {prompt_text}")
    print("Type your passphrase and press ENTER:")
    
    start_time = time.time()
    user_input = input("> ")
    end_time = time.time()
    
    total_time_ms = (end_time - start_time) * 1000
    char_count = max(len(user_input), 1)
    
    # Calculate Average Cadence per keystroke (ms)
    cadence_ms = round(total_time_ms / char_count, 2)
    return user_input, cadence_ms

# 4. OS FILE ENCRYPTION ACTION (LOCK)
def lock_file(file_path):
    """AES-256 encrypts a local file and replaces it with an .aegis extension."""
    if not os.path.exists(file_path):
        print(f"❌ Error: File '{file_path}' does not exist.")
        return

    abs_path = os.path.abspath(file_path)
    with open(abs_path, "rb") as f:
        raw_bytes = f.read()

    encrypted_data = cipher.encrypt(raw_bytes)
    
    locked_path = abs_path + ".aegis"
    with open(locked_path, "wb") as f:
        f.write(encrypted_data)

    # Securely remove original unencrypted file from filesystem
    os.remove(abs_path)
    
    print("\n" + "="*60)
    print("🛡️  AEGIS OS FILE VAULT LOCK ENFORCED")
    print("="*60)
    print(f"Target File:       {abs_path}")
    print(f"Protected Asset:   {locked_path}")
    print("Encryption Status: AES-256-GCM At-Rest Encrypted")
    print("="*60 + "\n")

# 5. OS FILE DECRYPTION ACTION (UNLOCK WITH ZTNA)
def unlock_file(locked_file_path):
    """Evaluates behavioral biometrics and posture via AI before opening the file."""
    if not os.path.exists(locked_file_path):
        print(f"❌ Error: Locked file '{locked_file_path}' not found.")
        return

    posture = get_system_posture()
    print("\n" + "="*60)
    print("🛡️  AEGIS ZTNA SYSTEM-LEVEL ACCESS INTERCEPTION")
    print("="*60)
    print(f"Identity Principal: {posture['user_principal']}")
    print(f"Host Environment:   {posture['os_info']}")
    print(f"Client Public IPv4: {posture['public_ip']}")
    print("="*60)

    # Capture live biometrics from user terminal
    _, cadence_ms = capture_live_biometrics("Enter Zero Trust Access Passphrase:")
    current_hour = time.localtime().tm_hour

    print(f"\n[*] Measured Typing Cadence: {cadence_ms} ms/key")
    print("[*] Contacting Aegis Isolation Forest AI Engine on Render...")

    # Send payload to live Render API
    payload = {
        "user_id": posture['user_principal'],
        "target_resource": os.path.basename(locked_file_path),
        "access_hour": current_hour,
        "keystroke_cadence": cadence_ms,
        "violation_count": 0
    }

    try:
        response = requests.post(RENDER_GATEWAY_URL, json=payload, timeout=10)
        res_data = response.json()

        risk_percent = round(res_data['risk_score'] * 100, 1)
        status = res_data['status']
        reason = res_data['reason']

        print("\n" + "-"*60)
        print("🤖 AI ENGINE EVALUATION RESULT")
        print("-"*60)
        print(f"Calculated Threat Risk:  {risk_percent}%")
        print(f"Gateway Decision Policy: {status}")
        print(f"Decision Reason:         {reason}")
        print("-"*60)

        if status == "GRANTED":
            print("\n✅ ZTNA PERIMETER CLEAR: Decrypting asset into memory...")
            
            with open(locked_file_path, "rb") as f:
                encrypted_bytes = f.read()

            decrypted_bytes = cipher.decrypt(encrypted_bytes)

            original_path = locked_file_path.replace(".aegis", "")
            with open(original_path, "wb") as f:
                f.write(decrypted_bytes)

            print(f"🔓 File restored to disk: {original_path}")
            print("🚀 Launching default OS application...")
            
            # Launch file using default Windows program (Adobe Reader / Edge / Word)
            if platform.system() == "Windows":
                os.startfile(original_path)
            else:
                subprocess.call(["open", original_path])
        else:
            print("\n🚨 ACCESS DENIED: High Behavioral Anomaly Detected!")
            print("🔒 File remains AES-256 encrypted on disk. Access token withheld.")

    except Exception as e:
        print(f"\n❌ Gateway Connection Failed: {str(e)}")

# CLI ROUTING
if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("\n=== AEGIS ZTNA SYSTEM AGENT ===")
        print("Usage:")
        print("  Lock a File:   python aegis_agent.py lock <path_to_file>")
        print("  Unlock a File: python aegis_agent.py unlock <path_to_locked_file>")
    else:
        command = sys.argv[1].lower()
        target_path = sys.argv[2]

        if command == "lock":
            lock_file(target_path)
        elif command == "unlock":
            unlock_file(target_path)
