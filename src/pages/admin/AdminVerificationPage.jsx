import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Building2,
  HeartHandshake,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  Check,
  Clock,
  Sparkles
} from 'lucide-react';
import { INITIAL_VERIFICATIONS } from '../../data/adminMockData';

export default function AdminVerificationPage() {
  const [verifications, setVerifications] = useState(INITIAL_VERIFICATIONS);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected verification for review modal
  const [selectedVerif, setSelectedVerif] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [clarifyModalOpen, setClarifyModalOpen] = useState(false);
  const [clarificationMsg, setClarificationMsg] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Filtered verifications
  const filtered = verifications.filter(v => {
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesType = typeFilter === 'all' || v.type === typeFilter;
    const matchesSearch =
      (v.orgName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.businessRegNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.applicantName || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  // Handle Approve
  const handleApprove = (id) => {
    setVerifications(prev => prev.map(v => {
      if (v.id === id) {
        return {
          ...v,
          status: 'Approved',
          approvedAt: 'Just now by Central Administrator',
          approvedBy: 'System Administrator (Level 5)',
        };
      }
      return v;
    }));
    setReviewModalOpen(false);
    showToast('Organization successfully verified and issued Green Verified Partner Badge!');
  };

  // Handle Reject
  const handleReject = (id) => {
    setVerifications(prev => prev.map(v => {
      if (v.id === id) {
        return {
          ...v,
          status: 'Rejected',
          rejectionReason: 'Non-compliant documentation or expired PHI health clearance.',
        };
      }
      return v;
    }));
    setReviewModalOpen(false);
    showToast('Verification rejected. Organization notified.');
  };

  // Handle Send Clarification Request
  const handleSendClarification = (e) => {
    e.preventDefault();
    if (!selectedVerif) return;
    setVerifications(prev => prev.map(v => {
      if (v.id === selectedVerif.id) {
        return {
          ...v,
          status: 'Needs Clarification',
          clarificationNote: clarificationMsg || 'Please provide updated PHI food safety certificate with current expiry date.',
        };
      }
      return v;
    }));
    setClarifyModalOpen(false);
    setReviewModalOpen(false);
    showToast('Clarification request dispatched to organization.');
  };

  const pendingCount = verifications.filter(v => v.status === 'Pending').length;
  const approvedCount = verifications.filter(v => v.status === 'Approved').length;

  return (
    <div className="fr-admin-verification-page">
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
            <ShieldCheck size={24} color="var(--fr-primary)" />
            Organization Verification & Compliance Center
          </h1>
          <p style={{ color: 'var(--fr-text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
            Verify business legality, Public Health Inspector (PHI) food safety certificates, and cold-chain capacity for donors and welfare recipients
          </p>
        </div>

        {/* Quick summary pills */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Clock size={14} /> {pendingCount} Pending Review
          </div>
          <div style={{
            background: 'rgba(25, 195, 125, 0.12)',
            border: '1px solid rgba(25, 195, 125, 0.25)',
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--fr-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <CheckCircle2 size={14} /> {approvedCount} Verified Partners
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="fr-admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Status Tabs */}
          <div className="fr-admin-tabs" style={{ marginBottom: 0 }}>
            <button
              type="button"
              className={`fr-admin-tab-btn ${statusFilter === 'Pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Pending')}
            >
              Pending Submissions <span className="fr-tab-pill-count">{pendingCount}</span>
            </button>
            <button
              type="button"
              className={`fr-admin-tab-btn ${statusFilter === 'Approved' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Approved')}
            >
              Verified Partners <span className="fr-tab-pill-count">{approvedCount}</span>
            </button>
            <button
              type="button"
              className={`fr-admin-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Records <span className="fr-tab-pill-count">{verifications.length}</span>
            </button>
          </div>

          {/* Org Type Filter */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="fr-form-select"
              style={{ padding: '8px 12px', fontSize: '0.84rem' }}
            >
              <option value="all">All Organization Types</option>
              <option value="donor">Food Donors (Hotels & Caterers)</option>
              <option value="recipient">Recipient Welfare Organizations</option>
            </select>

            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--fr-text-muted)' }} />
              <input
                type="text"
                placeholder="Search org or reg no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="fr-admin-search-input"
                style={{ width: '100%', paddingLeft: '32px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Verification Cards Grid */}
      <div className="fr-verif-grid">
        {filtered.map(verif => {
          const isDonor = verif.type === 'donor';
          const isPending = verif.status === 'Pending';
          const isApproved = verif.status === 'Approved';

          return (
            <div key={verif.id} className="fr-verif-card">
              <div className="fr-verif-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '42px', height: '42px', borderRadius: '10px',
                    background: isDonor ? 'linear-gradient(135deg, #10b981, #047857)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '0.9rem'
                  }}>
                    {isDonor ? <Building2 size={20} /> : <HeartHandshake size={20} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--fr-text-heading)' }}>
                      {verif.orgName}
                    </h3>
                    <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>
                      {verif.typeLabel} • {verif.district}
                    </div>
                  </div>
                </div>

                <span className={`fr-status-badge fr-badge-${verif.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  {verif.status}
                </span>
              </div>

              {/* Key Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--fr-text-muted)' }}>Legal Reg Number:</span>
                  <strong>{verif.businessRegNo}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--fr-text-muted)' }}>Health Inspector (PHI) Cert:</span>
                  <strong style={{ color: '#10b981' }}>{verif.phiCertNo}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--fr-text-muted)' }}>Authorized Contact:</span>
                  <span>{verif.applicantName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--fr-text-muted)' }}>Submitted:</span>
                  <span>{verif.submittedAt}</span>
                </div>
              </div>

              {/* Uploaded Documents Preview */}
              <div className="fr-verif-docs-list">
                <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--fr-text-muted)', textTransform: 'uppercase' }}>
                  Submitted Compliance Documents ({verif.documents.length})
                </div>
                {verif.documents.map((doc, dIdx) => (
                  <div key={dIdx} className="fr-verif-doc-item">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--fr-text-heading)' }}>
                      <FileText size={13} color="var(--fr-primary)" />
                      {doc.name}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: doc.status.includes('Verified') || doc.status.includes('Approved') ? '#10b981' : '#f59e0b'
                    }}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Facilities check */}
              {verif.facilities && (
                <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)' }}>
                  <strong>Inspected Facilities:</strong> {verif.facilities.join(' • ')}
                </div>
              )}

              {/* Actions Footer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--fr-border-card)',
                paddingTop: '14px',
                marginTop: 'auto'
              }}>
                <button
                  type="button"
                  className="fr-table-btn"
                  onClick={() => {
                    setSelectedVerif(verif);
                    setReviewModalOpen(true);
                  }}
                >
                  <FileText size={14} /> Review Audit Details
                </button>

                {isPending && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      className="fr-table-btn primary"
                      onClick={() => handleApprove(verif.id)}
                    >
                      <Check size={14} /> Approve & Verify
                    </button>
                  </div>
                )}

                {isApproved && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                    <ShieldCheck size={16} /> Certified Partner
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="fr-admin-card" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <ShieldCheck size={48} color="var(--fr-primary)" style={{ margin: '0 auto 14px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fr-text-heading)' }}>No verification records found</h3>
          <p style={{ color: 'var(--fr-text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
            All organizations matching this filter have been processed.
          </p>
        </div>
      )}

      {/* FULL VERIFICATION AUDIT MODAL */}
      {reviewModalOpen && selectedVerif && (
        <div className="fr-admin-modal-overlay" onClick={() => setReviewModalOpen(false)}>
          <div className="fr-admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fr-admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={22} color="var(--fr-primary)" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--fr-text-heading)' }}>
                    Compliance & Verification Dossier
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)' }}>
                    {selectedVerif.orgName} • Ref: {selectedVerif.id}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="fr-admin-toggle-btn"
                onClick={() => setReviewModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="fr-admin-modal-body">
              {/* Org Summary */}
              <div style={{ background: 'var(--fr-bg-subtle)', padding: '16px', borderRadius: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--fr-text-muted)', fontWeight: 700 }}>ORGANIZATION</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{selectedVerif.orgName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--fr-text-muted)', fontWeight: 700 }}>GOVT REGISTRATION NO</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{selectedVerif.businessRegNo}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--fr-text-muted)', fontWeight: 700 }}>PHI FOOD SAFETY CERTIFICATE</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#10b981' }}>{selectedVerif.phiCertNo}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--fr-text-muted)', fontWeight: 700 }}>PHI CERT VALIDITY</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Valid until {selectedVerif.phiCertExpiry}</div>
                </div>
              </div>

              {/* Contact info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span className="fr-form-label">Authorized Signatory</span>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>{selectedVerif.applicantName} ({selectedVerif.applicantTitle})</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--fr-text-muted)' }}>{selectedVerif.phone} • {selectedVerif.email}</div>
                </div>
                <div>
                  <span className="fr-form-label">Physical Inspection Address</span>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600 }}>{selectedVerif.address}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--fr-text-muted)' }}>District: {selectedVerif.district}</div>
                </div>
              </div>

              {/* Inspector Notes */}
              <div style={{ background: 'rgba(25, 195, 125, 0.08)', border: '1px solid rgba(25, 195, 125, 0.2)', padding: '12px 16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--fr-primary)', marginBottom: '4px' }}>
                  FIELD INSPECTOR AUDIT FINDINGS
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--fr-text-body)' }}>
                  {selectedVerif.verificationNotes}
                </div>
              </div>

              {/* Storage & Facilities */}
              <div>
                <span className="fr-form-label">Verified Storage & Cold Chain Equipment</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                  {selectedVerif.facilities?.map((f, i) => (
                    <span key={i} style={{
                      background: 'var(--fr-bg-subtle)',
                      border: '1px solid var(--fr-border-card)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 600
                    }}>
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="fr-admin-modal-footer">
              <button
                type="button"
                className="fr-table-btn danger"
                onClick={() => handleReject(selectedVerif.id)}
              >
                <XCircle size={14} /> Reject Application
              </button>
              <button
                type="button"
                className="fr-table-btn"
                onClick={() => setClarifyModalOpen(true)}
              >
                <AlertCircle size={14} /> Request Clarification
              </button>
              <button
                type="button"
                className="fr-table-btn primary"
                onClick={() => handleApprove(selectedVerif.id)}
              >
                <CheckCircle2 size={14} /> Grant Verified Seal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLARIFICATION REQUEST MODAL */}
      {clarifyModalOpen && selectedVerif && (
        <div className="fr-admin-modal-overlay" onClick={() => setClarifyModalOpen(false)}>
          <div className="fr-admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <form onSubmit={handleSendClarification}>
              <div className="fr-admin-modal-header">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fr-text-heading)' }}>
                  Request Document Clarification
                </h3>
                <button
                  type="button"
                  className="fr-admin-toggle-btn"
                  onClick={() => setClarifyModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="fr-admin-modal-body">
                <p style={{ fontSize: '0.84rem', color: 'var(--fr-text-muted)' }}>
                  Send an official communication notice to <strong>{selectedVerif.orgName}</strong> detailing missing documentation or renewal requirements.
                </p>

                <div className="fr-form-group">
                  <label className="fr-form-label">Clarification Directive *</label>
                  <textarea
                    rows={4}
                    placeholder="e.g. Please upload the newly renewed PHI Food Hygiene Certificate (Grade A or B) issued by the local health office..."
                    value={clarificationMsg}
                    onChange={(e) => setClarificationMsg(e.target.value)}
                    className="fr-form-textarea"
                    required
                  />
                </div>
              </div>

              <div className="fr-admin-modal-footer">
                <button
                  type="button"
                  className="fr-table-btn"
                  onClick={() => setClarifyModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="fr-table-btn primary"
                >
                  Dispatch Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
