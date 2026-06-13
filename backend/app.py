import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
from web3 import Web3

app = Flask(__name__)
CORS(app)

# Load machine learning engine weights
model = joblib.load('ztna_model.joblib')

@app.route('/api/access/evaluate', methods=['POST'])
def evaluate_access():
    try:
        data = request.json
        user = data.get('user', 'unknown_identity')
        resource = data.get('resource', 'unspecified_resource')
        hour = int(data.get('hour', 12))
        delay = int(data.get('delay', 150))
        attempts = int(data.get('attempts', 0))

        # Perform Inference check using ML model
        features = [[hour, delay, attempts]]
        prediction = model.predict(features)
        
        # Mapping parameters (-1 Anomaly, 1 Baseline Normal)
        if prediction[0] == 1:
            risk_level = "LOW"
            status = "GRANTED"
        else:
            risk_level = "HIGH"
            status = "DENIED_MFA_REQUIRED"

        return jsonify({
            "status": status,
            "riskLevel": risk_level,
            "metricsEvaluated": {"hour": hour, "typingDelayMs": delay, "failedAttempts": attempts}
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)