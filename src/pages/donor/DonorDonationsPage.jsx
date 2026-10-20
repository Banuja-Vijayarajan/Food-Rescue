import React, { useState } from 'react';
import { PlusCircle, MapPin, Clock, Edit3, Trash2, Search, Package } from 'lucide-react';
import { StatusBadge } from '../../components/donor/DonorShared';
import { DONOR_MY_POSTINGS } from '../../data/donorMockData';

export default function DonorDonationsPage({ onOpenPost, foodListings }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
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
          <p className="fr-page-sub">All your active and past food surplus listings</p>
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
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="fr-table-meal">
                      <img
                        src={p.image} alt={p.title}
                        className="fr-table-img"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                      <div>
                        <div className="fr-table-meal-name">{p.title}</div>
                        <div className="fr-table-meal-time">{p.postedAgo || p.timeAgo}</div>
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
                      <button className="fr-icon-btn" title="Edit"><Edit3 size={14} /></button>
                      <button className="fr-icon-btn danger" title="Remove"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
