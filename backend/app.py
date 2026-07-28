import os
import time
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI(title="Aegis ZTNA Gateway Engine")

# CORS Setup - Enables communication between Vercel Frontend and Render Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. REAL PROTECTED FILE VAULT SETUP
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VAULT_DIR = os.path.join(BASE_DIR, "vault")
os.makedirs(VAULT_DIR, exist_ok=True)

# Default sample file inside vault
DEFAULT_FILE = os.path.join(VAULT_DIR, "Confidential_Enterprise_Report.txt")
if not os.path.exists(DEFAULT_FILE):
    with open(DEFAULT_FILE, "w", encoding="utf-8") as f:
        f.write("=== CONFIDENTIAL ENTERPRISE DATA ASSET ===\n")
        f.write("Status: Zero Trust Verified Access Granted\n")
        f.write("Security Status: Immutable Ledger Audited Session\n")

# 2. AI MODEL INITIALIZATION
MODEL_PATH = os.path.join(BASE_DIR, "ztna_model.joblib")
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    from sklearn.ensemble import IsolationForest
    # Baseline Profile: [AccessHour, KeystrokeCadenceMs, ViolationCounter]
    X_train = [[10, 180, 0], [11, 200, 0], [14, 190, 0], [15, 210, 1], [9, 175, 0]]
    model = IsolationForest(contamination=0.15, random_state=42)
    model.fit(X_train)
    joblib.dump(model, MODEL_PATH)

class ThreatEvaluationRequest(BaseModel):
    user_id: str
    target_resource: str
    access_hour: int
    keystroke_cadence: float
    violation_count: int

# HEALTH CHECK ENDPOINT (To wake up Render)
@app.get("/")
async def root_health_check():
    return {"status": "ONLINE", "gateway": "Aegis ZTNA Engine active"}

# 3. AI EVALUATION ENDPOINT
@app.post("/api/gateway/evaluate")
async def evaluate_threat(req: ThreatEvaluationRequest, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    features = np.array([[req.access_hour, req.keystroke_cadence, req.violation_count]])
    
    # Calculate anomaly score using Isolation Forest
    raw_score = model.decision_function(features)[0]
    # Normalize risk score between 0.0 (Safe) and 1.0 (Critical Threat)
    risk_score = round(float(np.clip(1.0 - (raw_score + 0.5), 0.0, 1.0)), 2)
    
    status = "GRANTED" if risk_score < 0.60 else "DENIED"
    reason = "Normal Behavioral Baseline Matched" if status == "GRANTED" else "Behavioral Anomaly / Errant Keystroke Cadence"

    return {
        "user_id": req.user_id,
        "target_resource": req.target_resource,
        "risk_score": risk_score,
        "status": status,
        "reason": reason,
        "client_ip": client_ip,
        "timestamp": int(time.time())
    }

# 4. FILE UPLOAD ENDPOINT
@app.post("/api/vault/upload")
async def upload_file_to_vault(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(VAULT_DIR, file.filename)
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
        return {"status": "SUCCESS", "filename": file.filename, "message": "File secured inside vault."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Vault Upload Error: {str(e)}")

# 5. LIST VAULT FILES ENDPOINT
@app.get("/api/vault/files")
async def list_vault_files():
    try:
        files = os.listdir(VAULT_DIR)
        return {"files": files}
    except Exception as e:
        return {"files": ["Confidential_Enterprise_Report.txt"]}

# 6. SECURE FILE DOWNLOAD ENDPOINT
@app.get("/api/vault/download")
async def download_file(filename: str, token: str):
    if token != "VERIFIED_ZTNA_TOKEN":
        raise HTTPException(status_code=403, detail="ZTNA Perimeter Violation: Token Invalid or Revoked")
    
    file_path = os.path.join(VAULT_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=filename)
    
    raise HTTPException(status_code=404, detail="File Not Found in Vault")
