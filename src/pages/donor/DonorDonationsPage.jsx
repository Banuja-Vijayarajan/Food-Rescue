import React, { useState } from 'react';
import { PlusCircle, MapPin, Clock, Edit3, Trash2, Search, Package, Eye, X, Utensils, Info, Layers } from 'lucide-react';
import { StatusBadge } from '../../components/donor/DonorShared';
import { DONOR_MY_POSTINGS } from '../../data/donorMockData';

export default function DonorDonationsPage({ onOpenPost, foodListings, highlightedMealId }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [viewingMeal, setViewingMeal] = useState(null);
  const statuses = ['All', 'Available', 'Requested', 'Accepted', 'Collected'];

  const allPostings = [
    ...DONOR_MY_POSTINGS,
    ...((foodListings || []).filter(f => f.donorName && f.donorName.includes('Green Leaf'))),
  ];

  const filtered = allPostings.filter(p => {
    const matchSearch = (p.title || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === 'All' || p.status === filter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="fr-dash-view">
      <div className="fr-page-header">
        <div>
          <h1 className="fr-page-title">My Donations</h1>
          <p className="fr-page-sub">All active and scheduled food surplus listings for Green Leaf Hotel</p>
        </div>
        <button className="fr-btn fr-btn-primary" onClick={onOpenPost}>
          <PlusCircle size={16} /> Post New Surplus
        </button>
      </div>

      <div className="fr-filter-bar">
        <div className="fr-search-wrap">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search your postings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="fr-filter-pills">
          {statuses.map(s => (
            <button
              key={s}
              className={`fr-pill ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="fr-section-card">
        <div className="fr-table-wrap">
          <table className="fr-table">
            <thead>
              <tr>
                <th>FOOD ITEM</th>
                <th>QUANTITY</th>
                <th>LOCATION</th>
                <th>SAFE UNTIL</th>
                <th>STATUS</th>
                <th>REQUESTS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="fr-empty-state" style={{ padding: '40px' }}>
                      <Package size={32} /><p>No postings found</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(p => {
                const isSelected = highlightedMealId === p.id;
                return (
                  <tr 
                    key={p.id}
                    style={isSelected ? {
                      background: 'rgba(25, 195, 125, 0.12)',
                      boxShadow: 'inset 0 0 0 2px var(--fr-primary)'
                    } : undefined}
                  >
                    <td>
                      <div className="fr-table-meal">
                        <img
                          src={p.image} alt={p.title}
                          className="fr-table-img"
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                        <div>
                          <div className="fr-table-meal-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {p.title}
                            {isSelected && (
                              <span style={{
                                fontSize: '0.68rem',
                                background: 'var(--fr-primary)',
                                color: '#04140c',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 800
                              }}>
                                VIEWED
                              </span>
                            )}
                          </div>
                          <div className="fr-table-meal-time">{p.postedAgo || p.timeAgo || 'Just now'}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="fr-table-qty">{p.quantity || p.portions}</span></td>
                    <td><span className="fr-table-loc"><MapPin size={12} />{p.location || p.district}</span></td>
                    <td><span className="fr-table-time"><Clock size={12} />{p.safeUntil || p.availableUntil}</span></td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>
                      <span className={`fr-req-count ${(p.requests || 0) > 0 ? 'has-req' : ''}`}>
                        {p.requests || 0}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="fr-icon-btn" 
                          title="View Full Specifications"
                          onClick={() => setViewingMeal(p)}
                        >
                          <Eye size={14} />
                        </button>
                        <button className="fr-icon-btn" title="Edit"><Edit3 size={14} /></button>
                        <button className="fr-icon-btn danger" title="Remove"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Posting Details Modal in Donor Portal */}
      {viewingMeal && (
        <div className="fr-modal-backdrop" onClick={() => setViewingMeal(null)}>
          <div className="fr-meal-detail-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="fr-meal-modal-close-btn"
              onClick={() => setViewingMeal(null)}
              title="Close"
            >
              <X size={18} />
            </button>

            <div className="fr-meal-modal-img-wrap">
              <img src={viewingMeal.image} alt={viewingMeal.title} className="fr-meal-modal-img" />
              <span className={`fr-badge-status ${(viewingMeal.status || 'Available').toLowerCase()}`}>
                <Clock size={12} /> {viewingMeal.status}
              </span>
              <span className="fr-badge-portions">
                {viewingMeal.quantity || viewingMeal.portions}
              </span>
            </div>

            <div className="fr-meal-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Utensils size={16} color="var(--fr-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--fr-primary)' }}>
                  Green Leaf Hotel & Banquets (Donor)
                </span>
              </div>

              <h2 style={{ fontSize: '1.38rem', fontWeight: 800, color: 'var(--fr-text-heading)', marginBottom: '12px' }}>
                {viewingMeal.title}
              </h2>

              <p style={{ color: 'var(--fr-text-body)', lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '18px' }}>
                {viewingMeal.description || 'Freshly prepared catering surplus compliant with hygiene and safe food holding regulations.'}
              </p>

              <div style={{
                background: 'var(--fr-bg-subtle)',
                border: '1px solid var(--fr-border-card)',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fr-text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Safe Consumption Until</span>
                  <strong style={{ fontSize: '0.86rem', color: 'var(--fr-text-heading)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                    <Clock size={14} color="var(--fr-primary)" /> {viewingMeal.safeUntil || viewingMeal.availableUntil}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fr-text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Pickup Location</span>
                  <strong style={{ fontSize: '0.86rem', color: 'var(--fr-text-heading)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                    <MapPin size={14} color="var(--fr-primary)" /> {viewingMeal.location || 'Vavuniya'}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fr-text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Active Requests</span>
                  <strong style={{ fontSize: '0.86rem', color: 'var(--fr-text-heading)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                    <Layers size={14} color="var(--fr-primary)" /> {viewingMeal.requests || 0} organizations
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fr-text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Storage Condition</span>
                  <strong style={{ fontSize: '0.86rem', color: 'var(--fr-text-heading)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                    <Info size={14} color="var(--fr-primary)" /> {viewingMeal.storage || 'Insulated thermal hot-carriers (65°C+)'}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="fr-btn fr-btn-secondary"
                  onClick={() => setViewingMeal(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
