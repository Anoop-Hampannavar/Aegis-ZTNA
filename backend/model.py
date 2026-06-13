import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

def train_base_model():
    # Structural features: [RequestHour (0-23), InterKeyPressDelay(ms), FailedAttemptsThisHour]
    normal_behavior = [
        [9, 120, 0], [10, 150, 0], [14, 110, 0], [17, 135, 0],
        [11, 140, 1], [13, 115, 0], [16, 130, 0], [15, 125, 0]
    ]
    malicious_anomalies = [
        [2, 12, 8],   # 2 AM systematic automated brute-force attack
        [23, 850, 4]  # Late night highly erratic typing cadence manual exploit
    ]
    
    training_set = normal_behavior + malicious_anomalies
    
    # Isolation forest setup for detecting outliers
    clf = IsolationForest(n_estimators=100, contamination=0.15, random_state=42)
    clf.fit(training_set)
    
    joblib.dump(clf, 'ztna_model.joblib')
    print("AI Model state optimized and written to ztna_model.joblib")

if __name__ == "__main__":
    train_base_model()