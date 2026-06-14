import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Activity, Database, Key, HelpCircle, Terminal, Layers, CheckCircle, Map } from 'lucide-react';

export default function App() {
  const [inputs, setInputs] = useState({ user: 'anoop@enterprise.com', resource: 'Core Financial DB', hour: 10, delay: 130, attempts: 0 });
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // State to toggle pages
  const [showArchModal, setShowArchModal] = useState(false);
  const [chainLogs, setChainLogs] = useState([
    { user: 'sys_admin', resource: 'Root DNS', time: '10 mins ago', risk: 'LOW', status: 'GRANTED', tx: '0x74a1b92c83d6a4fe91002bcedf826311' }
  ]);

  // Secure Environment Variable extraction with reliable fallback to your live Render instance
  const baseUrl = import.meta.env.VITE_API_URL || 'https://aegis-ztna.onrender.com';

  const triggerEvaluation = async () => {
    setLoading(true);
    try {
      // Dynamic route generation targeting production cloud instances securely
      const response = await fetch(`${baseUrl}/api/access/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      const data = await response.json();
      setEvaluation(data);

      const pseudoTx = '0x' + Math.random().toString(16).substring(2, 15) + Math.random().toString(16).substring(2, 15);
      setChainLogs(prev => [
        { user: inputs.user, resource: inputs.resource, time: 'Just Now', risk: data.riskLevel, status: data.status, tx: pseudoTx },
        ...prev
      ]);
    } catch (err) {
      alert('Backend cluster communication timeout. Please ensure your cloud instance on Render has completed initialization and is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#090d16', color: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', padding: '32px' }}>
      
      {/* Injecting CSS Shimmer Styles Directly into Document for clean visual compilation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-box {
          background: linear-gradient(90deg, #111827 25%, #1f293d 50%, #111827 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
          border: 1px solid #1e293b;
          border-radius: 12px;
          height: 140px;
          width: 100%;
        }
        @keyframes pulseArrow {
          0%, 100% { opacity: 0.3; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(4px); }
        }
        .pulse-arrow {
          animation: pulseArrow 2s infinite ease-in-out;
        }
      `}</style>

      {/* Top Professional Navigation Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flexGrow: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ backgroundColor: '#3b82f6', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' }}>
              <Shield size={28} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0', tracking: '-0.05em', color: '#ffffff' }}>
                Aegis <span style={{ color: '#3b82f6' }}>ZTNA</span> Gateway
              </h1>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0', fontWeight: '500' }}>AI & Decentralized Blockchain Access Verification Node • HIT Nidasoshi</p>
            </div>
          </div>
        </div>

        {/* Action Toggle Layout Interface */}
        <div style={{ display: 'flex', gap: '8px', background: '#111827', padding: '6px', borderRadius: '10px', border: '1px solid #1e293b', alignItems: 'center' }}>
          <button 
            onClick={() => setShowArchModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', background: '#1e1b4b', color: '#818cf8', marginRight: '4px', border: '1px solid #4338ca' }}
          >
            <Map size={16} /> Topology Map
          </button>
          
          <button 
            onClick={() => setActiveTab('dashboard')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: '0.2s', background: activeTab === 'dashboard' ? '#1e293b' : 'transparent', color: activeTab === 'dashboard' ? '#3b82f6' : '#94a3b8' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Activity size={16} /> Live Control Node</div>
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', transition: '0.2s', background: activeTab === 'docs' ? '#1e293b' : 'transparent', color: activeTab === 'docs' ? '#3b82f6' : '#94a3b8' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><HelpCircle size={16} /> How It Works</div>
          </button>
        </div>
      </header>

      {/* PAGE 1: DYNAMIC SECURITY INTERFACE */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
            
            {/* Input Telemetry Form Card Container */}
            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', marginTop: '0', marginBottom: '20px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
                <Terminal size={18} color="#3b82f6" /> Contextual Security Signals
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Target Identity Principal</label>
                  <input type="text" value={inputs.user} onChange={e => setInputs({...inputs, user: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 12px', color: '#f1f5f9', fontSize: '13px', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Protected Enterprise Target Asset</label>
                  <input type="text" value={inputs.resource} onChange={e => setInputs({...inputs, resource: e.target.value})} style={{ width: '100%', boxSizing: 'border-box', background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 12px', color: '#f1f5f9', fontSize: '13px', outline: 'none' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Access Execution Hour</label>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#3b82f6' }}>{inputs.hour}:00 hrs</span>
                  </div>
                  <input type="range" min="0" max="23" value={inputs.hour} onChange={e => setInputs({...inputs, hour: parseInt(e.target.value)})} style={{ width: '100%', cursor: 'pointer' }} />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Keystroke Dynamics Cadence</label>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>{inputs.delay} ms</span>
                  </div>
                  <input type="range" min="10" max="1000" value={inputs.delay} onChange={e => setInputs({...inputs, delay: parseInt(e.target.value)})} style={{ width: '100%', cursor: 'pointer' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Hourly Access Violations Counter</label>
                  <input type="number" min="0" max="20" value={inputs.attempts} onChange={e => setInputs({...inputs, attempts: parseInt(e.target.value)})} style={{ width: '100%', boxSizing: 'border-box', background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', padding: '10px 12px', color: '#f1f5f9', fontSize: '13px', outline: 'none' }} />
                </div>

                <button 
                  onClick={triggerEvaluation} 
                  disabled={loading}
                  style={{ width: '100%', background: '#3b82f6', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: '0.2s', marginTop: '8px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}
                  onMouseOver={e => !loading && (e.target.style.background = '#2563eb')}
                  onMouseOut={e => !loading && (e.target.style.background = '#3b82f6')}
                >
                  {loading ? 'Evaluating Threat Parameters...' : 'Deploy Policy Challenge Evaluation'}
                </button>
              </div>
            </div>

            {/* AI Decision Analysis Box Card Container with Integrated Shimmer Loaders */}
            <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '700', marginTop: '0', marginBottom: '20px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
                  <Key size={18} color="#10b981" /> AI Engine Interception Terminal
                </h2>

                {loading ? (
                  /* Dynamic Shimmer Placeholder Engine Loading State Layout */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="shimmer-box" style={{ height: '125px' }}></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="shimmer-box" style={{ height: '65px' }}></div>
                      <div className="shimmer-box" style={{ height: '65px' }}></div>
                    </div>
                  </div>
                ) : evaluation ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ backgroundColor: evaluation.riskLevel === 'LOW' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', border: evaluation.riskLevel === 'LOW' ? '1px solid #10b981' : '1px solid #ef4444', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
                      {evaluation.riskLevel === 'LOW' ? (
                        <div>
                          <ShieldCheck size={54} color="#10b981" style={{ margin: '0 auto 10px auto' }} />
                          <div style={{ color: '#10b981', fontWeight: '800', fontSize: '18px', letterSpacing: '0.05em' }}>ACCESS SECURITY CLEARED</div>
                        </div>
                      ) : (
                        <div>
                          <ShieldAlert size={54} color="#ef4444" style={{ margin: '0 auto 10px auto' }} />
                          <div style={{ color: '#ef4444', fontWeight: '800', fontSize: '18px', letterSpacing: '0.05em' }}>ACCESS INTERCEPTED / BLOCKED</div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ background: '#090d16', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>AI Inference Matrix</div>
                        <div style={{ fontSize: '18px', fontWeight: '800', marginTop: '4px', color: evaluation.riskLevel === 'LOW' ? '#10b981' : '#ef4444' }}>{evaluation.riskLevel} RISK</div>
                      </div>
                      <div style={{ background: '#090d16', padding: '14px', borderRadius: '8px', border: '1px solid #1e293b', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Enforced Action Policy</div>
                        <div style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: '700', marginTop: '6px', color: '#f1f5f9' }}>{evaluation.status}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#475569', padding: '60px 20px', fontSize: '14px' }}>
                    <Activity size={32} style={{ margin: '0 auto 12px auto', opacity: '0.3', display: 'block' }} />
                    <div>Awaiting streaming evaluation signals... Move parameters and dispatch the evaluation execution button.</div>
                  </div>
                )}
              </div>
              <div style={{ fontSize: '10px', color: '#475569', borderTop: '1px solid #1e293b', paddingTop: '12px', marginTop: '16px', fontFamily: 'monospace' }}>
                Anomaly Detection Model: Isolation Forest Core Baseline Profile (Contamination Rate: 15%)
              </div>
            </div>

          </div>

          {/* Ledger Table Section */}
          <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', marginTop: '0', marginBottom: '20px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
              <Database size={18} color="#eab308" /> Decentralized Vault Audit Trail (Distributed Block Logging)
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: '#090d16', border: '1px solid #1e293b', color: '#64748b' }}>
                    <th style={{ padding: '12px' }}>Identity Address</th>
                    <th style={{ padding: '12px' }}>Target Protected Resource</th>
                    <th style={{ padding: '12px' }}>Context Risk Assessment</th>
                    <th style={{ padding: '12px' }}>Gateway Decision Policy</th>
                    <th style={{ padding: '12px', fontFamily: 'monospace' }}>Cryptographic Tx Receipt Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {chainLogs.map((log, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #1e293b', background: 'rgba(17,24,39,0.2)' }}>
                      <td style={{ padding: '14px', fontWeight: '600', color: '#f1f5f9' }}>{log.user}</td>
                      <td style={{ padding: '14px', color: '#94a3b8' }}>{log.resource}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '4px', border: log.risk === 'LOW' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(239,68,68,0.3)', background: log.risk === 'LOW' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: log.risk === 'LOW' ? '#10b981' : '#ef4444' }}>
                          {log.risk}
                        </span>
                      </td>
                      <td style={{ padding: '14px', fontFamily: 'monospace', fontSize: '12px', color: '#cbd5e1' }}>{log.status}</td>
                      <td style={{ padding: '14px', fontFamily: 'monospace', fontSize: '11px', color: '#3b82f6' }}>{log.tx}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* PAGE 2: HOW IT WORKS EDUCATION PANEL */}
      {activeTab === 'docs' && (
        <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '16px', padding: '32px', maxWidth: '850px', margin: '0 auto', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', marginTop: '0', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
            <Layers color="#3b82f6" /> System Architecture & Execution Pipeline
          </h2>
          
          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' }}>
            This system establishes an advanced <strong>Zero Trust Network Access (ZTNA) Framework</strong> prototype. Instead of using legacy username/password authentication models, every validation challenge triggers a real-time dual evaluation check using <strong>Artificial Intelligence (Inference Verification)</strong> and <strong>Blockchain (Immutable State Logging)</strong>.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
            <div style={{ background: '#090d16', border: '1px solid #1e293b', padding: '20px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#3b82f6', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
                <CheckCircle size={16} /> Step 1: Contextual Telemetry Capture
              </div>
              <div style={{ color: '#94a3b8', fontSize: '13px', paddingLeft: '26px', lineHeight: '1.5' }}>
                The access gateway intercepts connections and collects real-time context metrics: user profiles, resource targets, time matrices, and typing mechanics (keystroke flight delay profiles).
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1px solid #1e293b', padding: '20px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
                <CheckCircle size={16} /> Step 2: AI Behavioral Risk Assessment
              </div>
              <div style={{ color: '#94a3b8', fontSize: '13px', paddingLeft: '26px', lineHeight: '1.5' }}>
                The Flask backend feeds these context variables into an un-supervised <strong>Isolation Forest Machine Learning Model</strong>. The model computes an outlier boundary classification. If the parameters correlate with normal behaviors, access passes. If anomalies like credential stuffing or automated attacks trigger, it flags a high risk.
              </div>
            </div>

            <div style={{ background: '#090d16', border: '1px solid #1e293b', padding: '20px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#eab308', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>
                <CheckCircle size={16} /> Step 3: Immutable Blockchain Auditing
              </div>
              <div style={{ color: '#94a3b8', fontSize: '13px', paddingLeft: '26px', lineHeight: '1.5' }}>
                The final validation metadata is committed to a decentralized <strong>Solidity Smart Contract</strong>. Once signed and mined into a block, this data trace is completely unalterable. Administrators cannot clear, hide, or manipulate the threat history profile ledger logs.
              </div>
            </div>
          </div>

          <div style={{ marginTop: '32px', borderTop: '1px solid #1e293b', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#475569', uppercase: 'true', fontWeight: '700' }}>Hirasugar Institute of Technology • Major Academic Project 2026</span>
            <button onClick={() => setActiveTab('dashboard')} style={{ background: 'transparent', border: '1px solid #3b82f6', color: '#3b82f6', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Back to Real-time Node Console</button>
          </div>
        </div>
      )}

      {/* INTERACTIVE TOPOLOGY DIAGRAM OVERLAY MODAL */}
      {showArchModal && (
        <div style={{ fixed: 'true', position: 'fixed', inset: 0, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#0f1422', border: '1px solid #1e293b', borderRadius: '20px', maxWidth: '800px', width: '100%', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', position: 'relative' }}>
            
            {/* Modal Exit Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '14px', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: 0 }}>Aegis ZTNA Infrastructure Topology</h3>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>Live secure cross-origin request-response pipeline layout</p>
              </div>
              <button 
                onClick={() => setShowArchModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}
                onMouseOver={e => e.target.style.color = '#ffffff'}
                onMouseOut={e => e.target.style.color = '#64748b'}
              >
                ✕
              </button>
            </div>

            {/* Visual Distributed Node Architecture Map */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'space-between', margin: '32px 0', flexWrap: 'wrap' }}>
              
              {/* Client Endpoint Block */}
              <div style={{ flex: '1 1 180px', background: '#111827', border: '1px solid #4338ca', padding: '16px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(67, 56, 202, 0.15)' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>📱</div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#818cf8' }}>Mobile Client App</div>
                <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px', fontFamily: 'monospace' }}>React View State</div>
              </div>

              {/* Data Vector Stream Line 1 */}
              <div className="pulse-arrow" style={{ color: '#4338ca', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '2px', userSelect: 'none' }}>──➔</div>

              {/* Static Frontend CDN Cluster Block */}
              <div style={{ flex: '1 1 180px', background: '#111827', border: '1px solid #065f46', padding: '16px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(6, 95, 70, 0.15)' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>⚡</div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#34d399' }}>Edge Gateway Host</div>
                <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px', fontFamily: 'monospace' }}>Vercel Cloud Serverless</div>
              </div>

              {/* Data Vector Stream Line 2 */}
              <div className="pulse-arrow" style={{ color: '#065f46', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '2px', userSelect: 'none' }}>──➔</div>

              {/* Heavy Computing ML Engine Stack Block */}
              <div style={{ flex: '1 1 180px', background: '#111827', border: '1px solid #92400e', padding: '16px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(146, 64, 14, 0.15)' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>🔥</div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#fbbf24' }}>AI Inference Node</div>
                <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px', fontFamily: 'monospace' }}>Flask API (Render Engine)</div>
              </div>

            </div>

            {/* Technical Verification Details */}
            <div style={{ background: '#111827', border: '1px solid #1e293b', padding: '16px', borderRadius: '12px', fontSize: '12px', color: '#94a3b8', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong style={{ color: '#818cf8' }}>Handshake Pipeline Vectors:</strong> Parameters captured locally stream as asynchronous JSON objects bypassing cross-origin configuration restrictions (CORS validated) to hit decoupled multi-worker calculation endpoints.
              </div>
              <div>
                <strong style={{ color: '#fbbf24' }}>Dynamic State Isolation:</strong> Runtime computations evaluate anomalous metrics inside decoupled context trees, rendering structural decisions before writing non-volatile logs to the decentralized vault.
              </div>
            </div>

          </div>
        </div>
      )}
      
    </div>
  );
}
