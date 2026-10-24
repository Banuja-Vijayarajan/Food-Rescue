import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  FileText,
  UserX,
  Trash2,
  Check,
  AlertCircle
} from 'lucide-react';
import { INITIAL_DISPUTES_AND_REPORTS } from '../../data/adminMockData';

export default function AdminReportsPage() {
  const [reports, setReports] = useState(INITIAL_DISPUTES_AND_REPORTS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected report for action modal
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [resolutionAction, setResolutionAction] = useState('warn');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filtered reports
  const filtered = reports.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || r.severity === severityFilter;
    const matchesSearch =
      (r.reportedItem || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.targetUser || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.type || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSeverity && matchesSearch;
  });

  const handleResolve = (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    let actionLabel = 'Official warning issued';
    if (resolutionAction === 'dismiss') actionLabel = 'Report dismissed after review';
    else if (resolutionAction === 'remove') actionLabel = 'Flagged listing removed';
    else if (resolutionAction === 'suspend') actionLabel = 'Offending user account suspended';

    setReports(prev => prev.map(r => {
      if (r.id === selectedReport.id) {
        return {
          ...r,
          status: 'Resolved',
          actionTaken: actionLabel,
          resolutionNotes: resolutionNotes || 'Resolved through central administrative review.',
        };
      }
      return r;
    }));

    setActionModalOpen(false);
    showToast(`Dispute ${selectedReport.id} resolved successfully!`);
  };

  const openCount = reports.filter(r => r.status !== 'Resolved').length;

  return (
    <div className="fr-admin-reports-page">
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
            <AlertTriangle size={24} color="#ef4444" />
            Safety Alerts, Content Moderation & Dispute Queue
          </h1>
          <p style={{ color: 'var(--fr-text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
            Investigate reported food quality violations, logistics disputes, temperature breaches, and user complaints
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            background: openCount > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(25, 195, 125, 0.12)',
            border: `1px solid ${openCount > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(25, 195, 125, 0.3)'}`,
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: openCount > 0 ? 'var(--fr-danger)' : 'var(--fr-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <AlertCircle size={14} /> {openCount} Active Unresolved Issues
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="fr-admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="fr-admin-tabs" style={{ marginBottom: 0 }}>
            <button
              type="button"
              className={`fr-admin-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Reports ({reports.length})
            </button>
            <button
              type="button"
              className={`fr-admin-tab-btn ${statusFilter === 'Investigating' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Investigating')}
            >
              Investigating ({reports.filter(r => r.status === 'Investigating').length})
            </button>
            <button
              type="button"
              className={`fr-admin-tab-btn ${statusFilter === 'Open' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Open')}
            >
              Open ({reports.filter(r => r.status === 'Open').length})
            </button>
            <button
              type="button"
              className={`fr-admin-tab-btn ${statusFilter === 'Resolved' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Resolved')}
            >
              Resolved ({reports.filter(r => r.status === 'Resolved').length})
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="fr-form-select"
              style={{ padding: '8px 12px', fontSize: '0.84rem' }}
            >
              <option value="all">All Severities</option>
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="Low">Low Severity</option>
            </select>

            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--fr-text-muted)' }} />
              <input
                type="text"
                placeholder="Search incident..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="fr-admin-search-input"
                style={{ width: '100%', paddingLeft: '32px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="fr-admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="fr-admin-table-wrap" style={{ border: 'none' }}>
          <table className="fr-admin-table">
            <thead>
              <tr>
                <th>Reported Item / Issue</th>
                <th>Incident Type</th>
                <th>Involved Target User</th>
                <th>Reported By</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Date Logged</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(report => {
                const isHigh = report.severity === 'High';
                const isResolved = report.status === 'Resolved';

                return (
                  <tr key={report.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--fr-text-heading)' }}>
                        {report.reportedItem}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>
                        Ref: {report.id}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{report.type}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{report.targetUser}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--fr-text-muted)' }}>{report.reportedBy}</div>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: isHigh ? 'rgba(239, 68, 68, 0.15)' : report.severity === 'Medium' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: isHigh ? '#ef4444' : report.severity === 'Medium' ? '#f59e0b' : '#3b82f6',
                      }}>
                        {report.severity}
                      </span>
                    </td>
                    <td>
                      <span className={`fr-status-badge fr-badge-${report.status.toLowerCase()}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.78rem', color: 'var(--fr-text-muted)' }}>{report.date}</div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="fr-table-btn primary"
                        onClick={() => {
                          setSelectedReport(report);
                          setActionModalOpen(true);
                        }}
                      >
                        <Eye size={13} /> {isResolved ? 'Audit Dossier' : 'Take Action'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESOLUTION MODAL */}
      {actionModalOpen && selectedReport && (
        <div className="fr-admin-modal-overlay" onClick={() => setActionModalOpen(false)}>
          <div className="fr-admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
            <form onSubmit={handleResolve}>
              <div className="fr-admin-modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertTriangle size={20} color="var(--fr-danger)" />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fr-text-heading)' }}>
                      Incident Investigation & Resolution
                    </h3>
                    <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)' }}>
                      {selectedReport.reportedItem} ({selectedReport.id})
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="fr-admin-toggle-btn"
                  onClick={() => setActionModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="fr-admin-modal-body">
                {/* Details card */}
                <div style={{ background: 'var(--fr-bg-subtle)', padding: '14px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)', fontWeight: 700 }}>INCIDENT STATEMENT</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--fr-text-body)', marginTop: '4px' }}>
                    {selectedReport.details}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--fr-text-muted)', marginTop: '8px' }}>
                    Target: <strong>{selectedReport.targetUser}</strong> • Reported by: <strong>{selectedReport.reportedBy}</strong>
                  </div>
                </div>

                {selectedReport.status === 'Resolved' ? (
                  <div style={{ background: 'rgba(25, 195, 125, 0.1)', border: '1px solid rgba(25, 195, 125, 0.25)', padding: '14px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--fr-primary)' }}>RESOLUTION RECORDED</div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', marginTop: '2px' }}>{selectedReport.actionTaken}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--fr-text-muted)', marginTop: '4px' }}>
                      {selectedReport.resolutionNotes}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="fr-form-group">
                      <label className="fr-form-label">Administrative Action Directive *</label>
                      <select
                        value={resolutionAction}
                        onChange={(e) => setResolutionAction(e.target.value)}
                        className="fr-form-select"
                        required
                      >
                        <option value="warn">Issue Formal Compliance Warning to User</option>
                        <option value="remove">Remove / Hide Flagged Food Surplus Post</option>
                        <option value="suspend">Temporarily Suspend Offending Account</option>
                        <option value="dismiss">Dismiss Report (No Violation Found)</option>
                      </select>
                    </div>

                    <div className="fr-form-group">
                      <label className="fr-form-label">Investigation Findings & Resolution Notes *</label>
                      <textarea
                        rows={3}
                        placeholder="State findings and actions taken to record in the platform permanent audit log..."
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        className="fr-form-textarea"
                        required
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="fr-admin-modal-footer">
                <button
                  type="button"
                  className="fr-table-btn"
                  onClick={() => setActionModalOpen(false)}
                >
                  Close
                </button>
                {selectedReport.status !== 'Resolved' && (
                  <button
                    type="submit"
                    className="fr-table-btn primary"
                  >
                    Confirm Resolution
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
