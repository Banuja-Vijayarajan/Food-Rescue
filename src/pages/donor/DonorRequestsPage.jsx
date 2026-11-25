import React, { useState } from 'react';
import {
  CheckCircle2, XCircle, Inbox, MapPin,
  Phone, FileText
} from 'lucide-react';
import { StatusBadge } from '../../components/donor/DonorShared';
import { DONOR_INCOMING_REQUESTS } from '../../data/donorMockData';

function StarRating({ value }) {
  return (
    <span className="fr-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= value ? '#f59e0b' : 'var(--fr-border-card)' }}>★</span>
      ))}
    </span>
  );
}

export default function DonorRequestsPage() {
  const [requests, setRequests] = useState(DONOR_INCOMING_REQUESTS);

  const handleAccept = (id) =>
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'accepted' } : r));
  const handleDecline = (id) =>
    setRequests(prev => prev.filter(r => r.id !== id));

  return (
    <div className="fr-dash-view">
      <div className="fr-page-header">
        <div>
          <h1 className="fr-page-title">Incoming Requests</h1>
          <p className="fr-page-sub">
            Review and respond to portion requests from verified welfare organizations
          </p>
        </div>
        <span className="fr-count-badge">
          {requests.filter(r => r.status === 'pending').length} Pending
        </span>
      </div>

      <div className="fr-requests-list">
        {requests.length === 0 ? (
          <div className="fr-section-card">
            <div className="fr-empty-state" style={{ padding: '60px' }}>
              <Inbox size={40} />
              <p>No incoming requests at this time</p>
              <span>When organizations request your surplus, they'll appear here</span>
            </div>
          </div>
        ) : requests.map(r => (
          <div key={r.id} className={`fr-request-card ${r.status !== 'pending' ? 'accepted' : ''}`}>
            <div className="fr-req-card-top">
              <div className="fr-req-org-row">
                <div className="fr-req-avatar large">{r.avatar}</div>
                <div>
                  <div className="fr-req-org-name">{r.orgName}</div>
                  <div className="fr-req-org-type">{r.orgType}</div>
                  <div className="fr-req-meta">
                    <span><MapPin size={12} />{r.distance}</span>
                    <span><Phone size={12} />{r.phone}</span>
                    <StarRating value={Math.round(r.rating)} />
                    <span className="fr-rating-val">{r.rating}</span>
                  </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            </div>

            <div className="fr-req-card-body">
              <div className="fr-req-detail-row">
                <div className="fr-req-detail">
                  <span className="fr-detail-label">Requesting</span>
                  <span className="fr-detail-val">{r.meal}</span>
                </div>
                <div className="fr-req-detail">
                  <span className="fr-detail-label">Portions</span>
                  <span className="fr-detail-val">{r.portions}</span>
                </div>
                <div className="fr-req-detail">
                  <span className="fr-detail-label">Received</span>
                  <span className="fr-detail-val">{r.requestedAt}</span>
                </div>
              </div>
              <div className="fr-req-message">
                <FileText size={14} />
                <span>"{r.message}"</span>
              </div>
            </div>

            {r.status === 'pending' && (
              <div className="fr-req-card-footer">
                <button className="fr-btn fr-btn-secondary" onClick={() => handleDecline(r.id)}>
                  <XCircle size={15} /> Decline
                </button>
                <button className="fr-btn fr-btn-primary" onClick={() => handleAccept(r.id)}>
                  <CheckCircle2 size={15} /> Accept &amp; Schedule Pickup
                </button>
              </div>
            )}

            {r.status === 'accepted' && (
              <div className="fr-req-accepted-banner">
                <CheckCircle2 size={16} /> Request accepted — Pickup will be coordinated with {r.orgName}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
