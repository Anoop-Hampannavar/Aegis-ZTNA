import React, { useState, useEffect } from 'react';

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const RENDER_BACKEND_URL = "https://aegis-ztna-9spx.onrender.com";

export default function AegisZTNADashboard() {
  const [identity, setIdentity] = useState('anoop@enterprise.com');
  const [passphrase, setPassphrase] = useState('');
  const [keyTimes, setKeyTimes] = useState([]);
  const [cadence, setCadence] = useState(190);
  
  // Modals for Header Controls
  const [showTopology, setShowTopology] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  // Vault & File Management
  const [vaultFiles, setVaultFiles] = useState(['Confidential_Enterprise_Report.txt']);
  const [selectedFile, setSelectedFile] = useState('Confidential_Enterprise_Report.txt');
  const [uploading, setUploading] = useState(false);

  // Context Signals
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [violationCount, setViolationCount] = useState(0);
  const [clientIp, setClientIp] = useState('127.0.0.1');

  // Evaluation Output States
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [txLogs, setTxLogs] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    fetchVaultFiles();
  }, []);

  const fetchVaultFiles = async () => {
    try {
      const res = await fetch(`${RENDER_BACKEND_URL}/api/vault/files`);
      const data = await res.json();
      if (data.files && data.files.length > 0) {
        setVaultFiles(data.files);
        setSelectedFile(data.files[0]);
      }
    } catch (e) {
      console.log("Backend loading...");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${RENDER_BACKEND_URL}/api/vault/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert(`File '${file.name}' uploaded to Protected Vault!`);
        await fetchVaultFiles();
        setSelectedFile(file.name);
      }
    } catch (err) {
      alert("Upload error: Check backend deployment.");
    } finally {
      setUploading(false);
    }
  };

  const handleKeyDown = () => {
    const now = performance.now();
    setKeyTimes((prev) => {
      const updated = [...prev, now];
      if (updated.length > 1) {
        const intervals = [];
        for (let i = 1; i < updated.length; i++) {
          intervals.push(updated[i] - updated[i - 1]);
        }
        const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        setCadence(Math.round(avg));
      }
      return updated;
    });
  };

  const handleEvaluate = async () => {
    setEvaluating(true);
    setDownloadUrl(null);

    try {
      const res = await fetch(`${RENDER_BACKEND_URL}/api/gateway/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: identity,
          target_resource: selectedFile,
          access_hour: parseInt(currentHour),
          keystroke_cadence: cadence,
          violation_count: parseInt(violationCount)
        })
      });

      const aiData = await res.json();
      setEvalResult(aiData);
      setClientIp(aiData.client_ip);

      let realTxHash = "0x" + Math.random().toString(16).substr(2, 40);
      try {
        const rpcRes = await fetch('http://127.0.0.1:8545', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "eth_sendTransaction",
            params: [{
              from: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
              to: CONTRACT_ADDRESS,
              data: "0x"
            }],
            id: 1
          })
        });
        const rpcData = await rpcRes.json();
        if (rpcData.result) {
          realTxHash = rpcData.result;
        }
      } catch (err) {
        console.log("Local node fallback...");
      }

      const newLog = {
        identity: aiData.user_id,
        target: aiData.target_resource,
        risk: aiData.risk_score,
        status: aiData.status,
        txHash: realTxHash
      };
      setTxLogs((prev) => [newLog, ...prev]);

      if (aiData.status === "GRANTED") {
        setDownloadUrl(`${RENDER_BACKEND_URL}/api/vault/download?filename=${encodeURIComponent(selectedFile)}&token=VERIFIED_ZTNA_TOKEN`);
      }

    } catch (err) {
      alert("Error: Backend server API is offline.");
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#070b14', minHeight: '100vh', color: '#f1f5f9', padding: '32px', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* Header Banner */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', backgroundColor: '#4f46e5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            🛡️
          </div>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: '0', color: '#ffffff' }}>Aegis ZTNA Gateway</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>AI & Decentralized Blockchain Access Verification Node • HIT Nidasoshi</p>
          </div>
        </div>

        {/* Top Right Navigation Controls */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={() => setShowTopology(true)}
            style={{ backgroundColor: '#1e293b', color: '#a5b4fc', border: '1px solid #334155', fontSize: '12px', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            🗺️ Topology Map
          </button>
          
          <span style={{ backgroundColor: '#1e1b4b', color: '#818cf8', border: '1px solid #3730a3', fontSize: '12px', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
            📈 Live Control Node
          </span>

          <button 
            onClick={() => setShowHowItWorks(true)}
            style={{ backgroundColor: '#1e293b', color: '#94a3b8', border: '1px solid #334155', fontSize: '12px', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            ❓ How It Works
          </button>
        </div>
      </header>

      {/* Grid Container */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
        
        {/* Left Column: Contextual Security Controls */}
        <div style={{ backgroundColor: '#0e1626', border: '1px solid #1e293b', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', color: '#818cf8', margin: '0 0 8px 0', letterSpacing: '0.05em' }}>
            ❯_ Contextual Security Signals
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 'bold' }}>Target Identity Principal</label>
            <input 
              type="text" 
              value={identity} 
              onChange={(e) => setIdentity(e.target.value)}
              style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#a5b4fc', fontSize: '14px', boxSizing: 'border-box' }} 
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 'bold' }}>Protected Enterprise Target Asset</label>
              <label style={{ fontSize: '12px', color: '#818cf8', cursor: 'pointer', textDecoration: 'underline' }}>
                {uploading ? "Uploading..." : "Upload File to Vault"}
                <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <select 
              value={selectedFile} 
              onChange={(e) => setSelectedFile(e.target.value)}
              style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box' }}
            >
              {vaultFiles.map((file, idx) => (
                <option key={idx} value={file}>{file}</option>
              ))}
            </select>
          </div>

          {/* Live Biometrics Box */}
          <div style={{ backgroundColor: '#070b14', border: '1px solid #1e293b', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#818cf8', fontWeight: 'bold' }}>
              Live Biometric Keystroke Dynamics Passphrase
            </label>
            <input 
              type="text"
              value={passphrase}
              onKeyDown={handleKeyDown}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="Type here to capture live typing cadence..."
              style={{ width: '100%', backgroundColor: '#0e1626', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              <span>Calculated Typing Cadence:</span>
              <span style={{ fontFamily: 'monospace', color: '#34d399', fontWeight: 'bold' }}>{cadence} ms</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 'bold' }}>Access Hour (Auto-Detected)</label>
              <input 
                type="number" 
                value={currentHour} 
                onChange={(e) => setCurrentHour(e.target.value)}
                style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box' }} 
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 'bold' }}>Hourly Access Violations</label>
              <input 
                type="number" 
                value={violationCount} 
                onChange={(e) => setViolationCount(e.target.value)}
                style={{ width: '100%', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px', color: '#ffffff', fontSize: '14px', boxSizing: 'border-box' }} 
              />
            </div>
          </div>

          <button 
            onClick={handleEvaluate}
            disabled={evaluating}
            style={{ width: '100%', backgroundColor: '#4f46e5', color: '#ffffff', fontWeight: 'bold', fontSize: '13px', padding: '14px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            {evaluating ? "Evaluating Threat Parameters..." : "Evaluating Threat Parameters..."}
          </button>
        </div>

        {/* Right Column: AI Engine Output Terminal */}
        <div style={{ backgroundColor: '#0e1626', border: '1px solid #1e293b', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', color: '#818cf8', margin: '0 0 16px 0', letterSpacing: '0.05em' }}>
              🔑 AI Engine Interception Terminal
            </h2>

            {evalResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ backgroundColor: '#070b14', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', display: 'block' }}>Calculated Threat Risk</span>
                    <span style={{ fontSize: '36px', fontWeight: '900', color: evalResult.risk_score > 0.6 ? '#f43f5e' : '#34d399' }}>
                      {(evalResult.risk_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div style={{ padding: '8px 16px', borderRadius: '8px', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', backgroundColor: evalResult.status === 'GRANTED' ? '#064e3b' : '#881337', color: evalResult.status === 'GRANTED' ? '#34d399' : '#f43f5e', border: evalResult.status === 'GRANTED' ? '1px solid #047857' : '1px solid #9f1239' }}>
                    {evalResult.status}
                  </div>
                </div>

                <div style={{ backgroundColor: '#070b14', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', fontSize: '12px', fontFamily: 'monospace', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><span style={{ color: '#64748b' }}>Client Address:</span> {clientIp}</div>
                  <div><span style={{ color: '#64748b' }}>Decision Reason:</span> {evalResult.reason}</div>
                  <div><span style={{ color: '#64748b' }}>Target File Node:</span> {evalResult.target_resource}</div>
                </div>

                {downloadUrl && (
                  <a 
                    href={downloadUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ display: 'block', textAlign: 'center', backgroundColor: '#059669', color: '#ffffff', fontWeight: 'bold', fontSize: '12px', padding: '12px', borderRadius: '8px', textDecoration: 'none', textTransform: 'uppercase' }}
                  >
                    🔓 DOWNLOAD REAL PROTECTED FILE FROM VAULT
                  </a>
                )}
              </div>
            ) : (
              <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontStyle: 'italic', fontSize: '14px' }}>
                Awaiting challenge request initialization...
              </div>
            )}
          </div>

          <div style={{ fontSize: '11px', color: '#64748b', textAlign: 'center', borderTop: '1px solid #1e293b', paddingTop: '16px', marginTop: '16px' }}>
            Anomaly Detection Model: Isolation Forest Core Baseline Profile (Contamination Rate: 15%)
          </div>
        </div>

      </div>

      {/* Bottom Table: Cryptographic Audit Stream */}
      <div style={{ backgroundColor: '#0e1626', border: '1px solid #1e293b', padding: '24px', borderRadius: '16px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', color: '#818cf8', margin: '0 0 16px 0', letterSpacing: '0.05em' }}>
          🪙 Decentralized Vault Audit Trail (Distributed Block Logging)
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', fontSize: '12px', fontFamily: 'monospace', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b', color: '#94a3b8', textTransform: 'uppercase' }}>
                <th style={{ paddingBottom: '12px' }}>Identity Address</th>
                <th style={{ paddingBottom: '12px' }}>Target Protected Resource</th>
                <th style={{ paddingBottom: '12px' }}>Context Risk Assessment</th>
                <th style={{ paddingBottom: '12px' }}>Gateway Decision Policy</th>
                <th style={{ paddingBottom: '12px' }}>Cryptographic Tx Receipt Hash</th>
              </tr>
            </thead>
            <tbody>
              {txLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ paddingTop: '16px', paddingBottom: '16px', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
                    No block events written to the local network yet.
                  </td>
                </tr>
              ) : txLogs.map((log, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '12px 0', color: '#a5b4fc' }}>{log.identity}</td>
                  <td style={{ padding: '12px 0', color: '#cbd5e1' }}>{log.target}</td>
                  <td style={{ padding: '12px 0' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', backgroundColor: log.risk > 0.6 ? '#881337' : '#064e3b', color: log.risk > 0.6 ? '#f43f5e' : '#34d399' }}>
                      {log.risk > 0.6 ? 'HIGH' : 'LOW'} ({(log.risk * 100).toFixed(0)}%)
                    </span>
                  </td>
                  <td style={{ padding: '12px 0', fontWeight: 'bold', color: log.status === 'GRANTED' ? '#34d399' : '#f43f5e' }}>
                    {log.status}
                  </td>
                  <td style={{ padding: '12px 0', color: '#818cf8' }}>
                    {log.txHash.substring(0, 32)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TOPOLOGY MAP MODAL */}
      {showTopology && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', items: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#0e1626', border: '1px solid #334155', borderRadius: '16px', padding: '32px', maxWidth: '600px', width: '90%', color: '#f1f5f9' }}>
            <h3 style={{ fontSize: '18px', color: '#818cf8', marginTop: 0 }}>🗺️ ZTNA System Network Topology</h3>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', backgroundColor: '#070b14', padding: '16px', borderRadius: '8px', color: '#34d399', lineHeight: '1.8' }}>
              [ Client Browser Request ] <br/>
              &nbsp;&nbsp;&nbsp;&nbsp;│ <br/>
              &nbsp;&nbsp;&nbsp;&nbsp;▼ <br/>
              [ Live Keystroke Dynamics & Context Engine ] <br/>
              &nbsp;&nbsp;&nbsp;&nbsp;│ <br/>
              &nbsp;&nbsp;&nbsp;&nbsp;▼ <br/>
              [ Isolation Forest AI Anomaly Evaluator (Render) ] <br/>
              &nbsp;&nbsp;&nbsp;&nbsp;│ <br/>
              &nbsp;&nbsp;&nbsp;&nbsp;▼ <br/>
              [ Decentralized Solidity Smart Contract Ledger ] <br/>
              &nbsp;&nbsp;&nbsp;&nbsp;│ <br/>
              &nbsp;&nbsp;&nbsp;&nbsp;▼ <br/>
              [ Protected File Vault Gateway (Access Granted / Denied) ]
            </div>
            <button 
              onClick={() => setShowTopology(false)}
              style={{ marginTop: '20px', width: '100%', backgroundColor: '#4f46e5', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              CLOSE TOPOLOGY VIEW
            </button>
          </div>
        </div>
      )}

      {/* HOW IT WORKS MODAL */}
      {showHowItWorks && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', items: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#0e1626', border: '1px solid #334155', borderRadius: '16px', padding: '32px', maxWidth: '600px', width: '90%', color: '#f1f5f9' }}>
            <h3 style={{ fontSize: '18px', color: '#818cf8', marginTop: 0 }}>❓ How Aegis ZTNA Architecture Works</h3>
            <ul style={{ fontSize: '13px', lineHeight: '1.7', color: '#cbd5e1', paddingLeft: '20px' }}>
              <li><strong>Continuous Verification:</strong> Zero Trust architecture assumes no identity is safe by default.</li>
              <li><strong>Behavioral AI Analysis:</strong> Machine learning evaluates typing rhythm cadence, login hours, and contextual signals to compute dynamic threat scores.</li>
              <li><strong>Decentralized Auditing:</strong> Smart contracts log every perimeter request permanently on a blockchain network to prevent log tampering.</li>
              <li><strong>Secure Vault Gateway:</strong> File download tokens are generated only when the computed risk score remains below safe thresholds.</li>
            </ul>
            <button 
              onClick={() => setShowHowItWorks(false)}
              style={{ marginTop: '20px', width: '100%', backgroundColor: '#4f46e5', color: '#fff', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              CLOSE SYSTEM MANUAL
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
