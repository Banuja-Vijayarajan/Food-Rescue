import React, { useState } from 'react';
import {
  Inbox, Clock, CheckCircle2, XCircle, Truck,
  MapPin, Phone, ShieldCheck, ChevronRight, AlertTriangle,
  Calendar, FileText, ArrowRight, UserCheck
} from 'lucide-react';
import { StatusBadge } from '../../components/donor/DonorShared';
import '../../styles/recipient-dashboard.css';

// Lifecycle stages from Project Proposal Section 2.1 & 3.2
const LIFECYCLE_STAGES = [
  { id: 'posted', label: '1. Posted' },
  { id: 'requested', label: '2. Requested' },
  { id: 'accepted', label: '3. Accepted' },
  { id: 'scheduled', label: '4. Pickup Scheduled' },
  { id: 'collected', label: '5. Collected' },
  { id: 'completed', label: '6. Handed Over' },
];

export default function RecipientRequestsPage({
  requests = [],
  onRequestStatusChange,
  onNavigate
}) {
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'pending' | 'accepted' | 'completed'

  const filteredRequests = requests.filter(req => {
    if (filterTab === 'pending') return req.status === 'Requested';
    if (filterTab === 'accepted') return req.status === 'Accepted' || req.status === 'Pickup Scheduled';
    if (filterTab === 'completed') return req.status === 'Completed';
    return true;
  });

  const handleCancel = (requestId) => {
    if (window.confirm('Are you sure you want to withdraw this surplus food request?')) {
      if (onRequestStatusChange) {
        onRequestStatusChange(requestId, 'Cancelled');
      }
    }
  };

  const getStageNumber = (status) => {
    switch (status) {
      case 'Available': return 0;
      case 'Requested': return 1;
      case 'Accepted': return 2;
      case 'Pickup Scheduled': return 3;
      case 'Collected': return 4;
      case 'Handed Over':
      case 'Completed': return 5;
      default: return 1;
    }
  };

  return (
    <div className="fr-recipient-view">

      {/* Page Header */}
      <div className="fr-page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="fr-page-title">Track Food Requests & Lifecycle</h1>
          <p className="fr-page-sub">
            Monitor real-time status of all surplus food claims from initial request to pickup and final handover
          </p>
        </div>
        <button
          className="fr-btn fr-btn-primary"
          onClick={() => onNavigate('available-food')}
        >
          Browse Available Food <ArrowRight size={15} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          className={`fr-rec-chip ${filterTab === 'all' ? 'active' : ''}`}
          onClick={() => setFilterTab('all')}
        >
          All Requests ({requests.length})
        </button>
        <button
          className={`fr-rec-chip ${filterTab === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterTab('pending')}
        >
          Awaiting Decision ({requests.filter(r => r.status === 'Requested').length})
        </button>
        <button
          className={`fr-rec-chip ${filterTab === 'accepted' ? 'active' : ''}`}
          onClick={() => setFilterTab('accepted')}
        >
          Accepted &amp; Logistics ({requests.filter(r => r.status === 'Accepted' || r.status === 'Pickup Scheduled').length})
        </button>
        <button
          className={`fr-rec-chip ${filterTab === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterTab('completed')}
        >
          Completed ({requests.filter(r => r.status === 'Completed').length})
        </button>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="fr-section-card" style={{ padding: '60px', textAlign: 'center' }}>
          <Inbox size={42} color="var(--fr-primary)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ color: 'var(--fr-text-heading)', fontSize: '1.2rem', marginBottom: '8px' }}>
            No requests found in this category
          </h3>
          <p style={{ color: 'var(--fr-text-muted)', fontSize: '0.88rem' }}>
            You haven't submitted any portion requests in this status yet.
          </p>
          <button 
            className="fr-btn fr-btn-primary" 
            style={{ marginTop: '16px' }}
            onClick={() => onNavigate('available-food')}
          >
            Find Surplus Food
          </button>
        </div>
      ) : (
        filteredRequests.map(req => {
          const currentStage = getStageNumber(req.status);
          const percent = (currentStage / (LIFECYCLE_STAGES.length - 1)) * 100;

          return (
            <div key={req.id} className="fr-rec-request-card">
              {/* Top Row: Photo, Title, Donor & Status */}
              <div className="fr-rec-req-top">
                <img src={req.image} alt={req.mealTitle} className="fr-rec-req-img" />
                <div className="fr-rec-req-header-info">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <h3 className="fr-rec-req-title">{req.mealTitle}</h3>
                    <StatusBadge status={req.status} />
                  </div>

                  <div className="fr-rec-req-donor">
                    <span style={{ fontWeight: 700, color: 'var(--fr-text-heading)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {req.donorName}
                      <ShieldCheck size={13} color="var(--fr-primary)" />
                    </span>
                    <span>• {req.donorType}</span>
                    <span>• <MapPin size={12} style={{ display: 'inline' }} /> {req.donorLocation}</span>
                    <span>• ★ {req.donorRating}</span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--fr-text-muted)', marginTop: '4px' }}>
                    Requested: <strong>{req.portionsRequested} portions</strong> (of {req.totalAvailable} total available) • Submitted {req.requestedAt}
                  </div>
                </div>
              </div>

              {/* ── Lifecycle Tracking Bar (Proposal Section 2.1 & 3.2) ── */}
              <div style={{ background: 'var(--fr-bg-subtle)', borderRadius: 'var(--fr-radius-md)', padding: '16px 14px' }}>
                <div style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--fr-text-muted)', marginBottom: '8px' }}>
                  Donation Lifecycle Progress
                </div>
                <div className="fr-timeline-container">
                  <div className="fr-timeline-track">
                    <div className="fr-timeline-track-fill" style={{ width: `${percent}%` }} />
                  </div>

                  {LIFECYCLE_STAGES.map((stg, index) => {
                    const isCompleted = index <= currentStage;
                    const isActive = index === currentStage;
                    return (
                      <div 
                        key={stg.id} 
                        className={`fr-timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                      >
                        <div className="fr-timeline-circle">
                          {isCompleted ? '✓' : index + 1}
                        </div>
                        <span className="fr-timeline-label">{stg.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details Data Box */}
              <div className="fr-rec-req-details-box">
                <div className="fr-rec-req-detail-col">
                  <span className="label">Safe Consumption Until</span>
                  <span className="value" style={{ color: 'var(--fr-primary)' }}>{req.safeUntil}</span>
                </div>
                <div className="fr-rec-req-detail-col">
                  <span className="label">Hygienic Storage</span>
                  <span className="value">{req.storageMethod || 'Thermal Food Carrier'}</span>
                </div>
                <div className="fr-rec-req-detail-col">
                  <span className="label">Beneficiary Purpose</span>
                  <span className="value">{req.purpose}</span>
                </div>
                <div className="fr-rec-req-detail-col">
                  <span className="label">Contact Person</span>
                  <span className="value">{req.contactPerson}</span>
                </div>
              </div>

              {/* Status Notes Banner */}
              {req.statusNotes && (
                <div className="fr-rec-req-note">
                  <FileText size={14} color="var(--fr-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{req.statusNotes}</span>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="fr-rec-req-actions">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a
                    href={`tel:${req.donorPhone}`}
                    className="fr-btn fr-btn-secondary fr-btn-sm"
                  >
                    <Phone size={13} /> Call Donor ({req.donorPhone})
                  </a>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {req.status === 'Requested' && (
                    <button
                      className="fr-btn fr-btn-secondary fr-btn-sm"
                      style={{ color: 'var(--fr-danger)' }}
                      onClick={() => handleCancel(req.id)}
                    >
                      <XCircle size={14} /> Cancel Request
                    </button>
                  )}

                  {req.status === 'Accepted' && (
                    <button
                      className="fr-btn fr-btn-primary fr-btn-sm"
                      onClick={() => onNavigate('pickup')}
                    >
                      <Truck size={14} /> Arrange &amp; Confirm Pickup
                    </button>
                  )}

                  {req.status === 'Pickup Scheduled' && (
                    <button
                      className="fr-btn fr-btn-primary fr-btn-sm"
                      onClick={() => onNavigate('pickup')}
                    >
                      <CheckCircle2 size={14} /> View Logistics &amp; Handover
                    </button>
                  )}

                  {req.status === 'Completed' && (
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--fr-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} /> Handover Completed &amp; Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}

    </div>
  );
}
