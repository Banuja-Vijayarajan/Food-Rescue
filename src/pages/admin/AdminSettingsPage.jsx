import React, { useState } from 'react';
import {
  Settings,
  PhoneCall,
  ShieldCheck,
  MapPin,
  Activity,
  Save,
  CheckCircle2,
  Database,
  Server,
  Bell,
  Search,
  Download,
  AlertTriangle,
  Play
} from 'lucide-react';
import { SYSTEM_CONFIGURATION, ADMIN_AUDIT_LOGS } from '../../data/adminMockData';

export default function AdminSettingsPage() {
  const [config, setConfig] = useState(SYSTEM_CONFIGURATION);
  const [auditLogs, setAuditLogs] = useState(ADMIN_AUDIT_LOGS);
  const [auditSearch, setAuditSearch] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [ivrTestRinging, setIvrTestRinging] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Handle Save Configuration
  const handleSaveConfig = (e) => {
    e.preventDefault();
    const newLog = {
      id: `log-${Date.now()}`,
      action: 'SYSTEM_SETTINGS_UPDATE',
      admin: 'Operations Central Admin',
      target: 'Platform Core Rules',
      details: 'Updated telephony dispatch parameters and food safety holding thresholds.',
      timestamp: 'Just now',
      ip: '127.0.0.1 (Local Session)',
    };
    setAuditLogs([newLog, ...auditLogs]);
    showToast('System configuration & parameters saved successfully!');
  };

  // Handle IVR Call Simulation Test
  const handleTestIvr = () => {
    setIvrTestRinging(true);
    showToast('Simulating automated IVR emergency call broadcast to nearby shelters...');
    setTimeout(() => {
      setIvrTestRinging(false);
      showToast('IVR Telephony Test Completed: SIP Trunk Handshake 200 OK.');
    }, 2500);
  };

  // Filtered audit logs
  const filteredLogs = auditLogs.filter(log =>
    log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.target.toLowerCase().includes(auditSearch.toLowerCase()) ||
    log.admin.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="fr-admin-settings-page">
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          background: 'var(--fr-primary)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          fontWeight: 700,
          fontSize: '0.86rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} /> {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="fr-admin-card-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--fr-text-heading)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={24} color="var(--fr-primary)" />
            System Information & Operational Parameters
          </h1>
          <p style={{ color: 'var(--fr-text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
            Manage automated IVR voice telephony, food safety thresholds, district zones, and view security audit logs
          </p>
        </div>

        <button
          type="button"
          className="fr-table-btn primary"
          onClick={handleSaveConfig}
          style={{ padding: '10px 18px', fontSize: '0.86rem' }}
        >
          <Save size={16} /> Save Configuration
        </button>
      </div>

      {/* System Health Overview Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="fr-admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--fr-primary)' }}>
            <Server size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>API GATEWAY</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--fr-text-heading)' }}>
            Operational (99.98%)
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>
            Node.js / Express Core v20
          </div>
        </div>

        <div className="fr-admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
            <Database size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>MONGODB CLUSTER</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--fr-text-heading)' }}>
            Connected & Synced
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>
            Mongoose Replica Set Active
          </div>
        </div>

        <div className="fr-admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b' }}>
            <PhoneCall size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>IVR TELEPHONY</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--fr-text-heading)' }}>
            SIP Trunk Online
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>
            Dialog / Mobitel / Twilio Gateway
          </div>
        </div>

        <div className="fr-admin-stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#8b5cf6' }}>
            <ShieldCheck size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>PHI COMPLIANCE</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--fr-text-heading)' }}>
            Rules Enforced
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>
            Hot &gt;= 65°C | Cold &lt;= 5°C
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* IVR Voice Telephony Configuration */}
        <div className="fr-admin-card" style={{ marginBottom: 0 }}>
          <div className="fr-admin-card-header">
            <div>
              <h2 className="fr-admin-card-title">
                <PhoneCall size={18} color="var(--fr-primary)" />
                Automated IVR Telephony Gateway
              </h2>
              <p className="fr-admin-card-subtitle">
                Automated phone ring dispatch when surplus meals are registered by hotels
              </p>
            </div>
            <button
              type="button"
              className="fr-table-btn"
              onClick={handleTestIvr}
              disabled={ivrTestRinging}
            >
              <Play size={13} /> {ivrTestRinging ? 'Ringing...' : 'Test IVR Call'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--fr-text-heading)' }}>
                  Auto-Dial on Surplus Registration
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)' }}>
                  Immediately trigger automated phone calls to nearby verified shelters
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.ivrGateway.autoDialOnSurplusPost}
                onChange={(e) => setConfig({
                  ...config,
                  ivrGateway: { ...config.ivrGateway, autoDialOnSurplusPost: e.target.checked }
                })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--fr-primary)' }}
              />
            </div>

            <div className="fr-form-group">
              <label className="fr-form-label">Broadcast Proximity Radius (km)</label>
              <input
                type="number"
                value={config.ivrGateway.dispatchRadiusKm}
                onChange={(e) => setConfig({
                  ...config,
                  ivrGateway: { ...config.ivrGateway, dispatchRadiusKm: parseInt(e.target.value) || 10 }
                })}
                className="fr-form-input"
              />
            </div>

            <div className="fr-form-group">
              <label className="fr-form-label">Maximum Retry Attempts on Unanswered Call</label>
              <input
                type="number"
                value={config.ivrGateway.maxRetryAttempts}
                onChange={(e) => setConfig({
                  ...config,
                  ivrGateway: { ...config.ivrGateway, maxRetryAttempts: parseInt(e.target.value) || 3 }
                })}
                className="fr-form-input"
              />
            </div>

            <div>
              <span className="fr-form-label">Supported Languages for Voice Dispatch</span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {config.ivrGateway.languages.map(lang => (
                  <span key={lang} style={{
                    background: 'var(--fr-bg-subtle)',
                    border: '1px solid var(--fr-border-card)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700
                  }}>
                    ✓ {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Food Safety Rules & Thresholds */}
        <div className="fr-admin-card" style={{ marginBottom: 0 }}>
          <div className="fr-admin-card-header">
            <div>
              <h2 className="fr-admin-card-title">
                <ShieldCheck size={18} color="var(--fr-primary)" />
                Food Safety & Temperature Standards
              </h2>
              <p className="fr-admin-card-subtitle">
                Ministry of Health & PHI food redistribution hygiene guidelines
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="fr-form-group">
              <label className="fr-form-label">Maximum Cooked Food Ambient Holding (Hours)</label>
              <input
                type="number"
                step="0.5"
                value={config.foodSafetyRules.maxCookedFoodAmbientHours}
                onChange={(e) => setConfig({
                  ...config,
                  foodSafetyRules: { ...config.foodSafetyRules, maxCookedFoodAmbientHours: parseFloat(e.target.value) || 3 }
                })}
                className="fr-form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="fr-form-group">
                <label className="fr-form-label">Min Hot Holding Temp (°C)</label>
                <input
                  type="number"
                  value={config.foodSafetyRules.minHotFoodHoldingTempCelsius}
                  onChange={(e) => setConfig({
                    ...config,
                    foodSafetyRules: { ...config.foodSafetyRules, minHotFoodHoldingTempCelsius: parseFloat(e.target.value) || 65 }
                  })}
                  className="fr-form-input"
                />
              </div>

              <div className="fr-form-group">
                <label className="fr-form-label">Max Cold Storage Temp (°C)</label>
                <input
                  type="number"
                  value={config.foodSafetyRules.maxColdFoodHoldingTempCelsius}
                  onChange={(e) => setConfig({
                    ...config,
                    foodSafetyRules: { ...config.foodSafetyRules, maxColdFoodHoldingTempCelsius: parseFloat(e.target.value) || 5 }
                  })}
                  className="fr-form-input"
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--fr-border-card)', paddingTop: '10px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Mandatory Temperature Logging on Handover</div>
                <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>Drivers must probe food and record temperature in van log</div>
              </div>
              <input
                type="checkbox"
                checked={config.foodSafetyRules.mandatoryTemperatureLogging}
                onChange={(e) => setConfig({
                  ...config,
                  foodSafetyRules: { ...config.foodSafetyRules, mandatoryTemperatureLogging: e.target.checked }
                })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--fr-primary)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Regional District Hubs */}
      <div className="fr-admin-card">
        <div className="fr-admin-card-header">
          <div>
            <h2 className="fr-admin-card-title">
              <MapPin size={18} color="var(--fr-primary)" />
              Active Operating Districts & Service Coverage
            </h2>
            <p className="fr-admin-card-subtitle">
              Manage regions where automatic donor-to-recipient matching is enabled
            </p>
          </div>
        </div>

        <div className="fr-admin-table-wrap">
          <table className="fr-admin-table">
            <thead>
              <tr>
                <th>District Name</th>
                <th>Province</th>
                <th>Status</th>
                <th>Registered Donors</th>
                <th>Registered Recipients</th>
                <th>Redistribution Coverage</th>
                <th>Enable / Disable</th>
              </tr>
            </thead>
            <tbody>
              {config.activeDistricts.map((dist, idx) => (
                <tr key={dist.name}>
                  <td><strong>{dist.name}</strong></td>
                  <td>{dist.province}</td>
                  <td>
                    <span className="fr-status-badge fr-badge-active">Active</span>
                  </td>
                  <td><strong>{dist.donors}</strong> Hotels & Kitchens</td>
                  <td><strong>{dist.recipients}</strong> Welfare Centers</td>
                  <td>
                    <span style={{ color: 'var(--fr-primary)', fontWeight: 700 }}>{dist.coverage}</span>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={dist.active}
                      onChange={(e) => {
                        const updated = [...config.activeDistricts];
                        updated[idx].active = e.target.checked;
                        setConfig({ ...config, activeDistricts: updated });
                        showToast(`Zone ${dist.name} coverage updated.`);
                      }}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--fr-primary)' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Log */}
      <div className="fr-admin-card">
        <div className="fr-admin-card-header">
          <div>
            <h2 className="fr-admin-card-title">
              <Activity size={18} color="var(--fr-primary)" />
              Platform Governance Audit Logs
            </h2>
            <p className="fr-admin-card-subtitle">
              Chronological ledger of verification approvals, status overrides, and system changes
            </p>
          </div>

          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--fr-text-muted)' }} />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              className="fr-admin-search-input"
              style={{ width: '100%', paddingLeft: '32px' }}
            />
          </div>
        </div>

        <div className="fr-admin-table-wrap">
          <table className="fr-admin-table">
            <thead>
              <tr>
                <th>Action Type</th>
                <th>Admin Authority</th>
                <th>Target Entity / Batch</th>
                <th>Audit Details & Action Recorded</th>
                <th>Timestamp</th>
                <th>IP / Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id}>
                  <td>
                    <span style={{
                      background: 'rgba(25, 195, 125, 0.12)',
                      color: 'var(--fr-primary)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '0.72rem'
                    }}>
                      {log.action}
                    </span>
                  </td>
                  <td><strong>{log.admin}</strong></td>
                  <td>{log.target}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--fr-text-body)' }}>{log.details}</td>
                  <td style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)' }}>{log.timestamp}</td>
                  <td style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
