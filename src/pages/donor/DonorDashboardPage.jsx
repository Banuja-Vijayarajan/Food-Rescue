import React from 'react';
import {
  ShieldCheck, PlusCircle, Inbox, CalendarClock,
  CheckCircle2, TrendingUp, ListOrdered, MapPin,
  Clock, Eye, Leaf, Award, ChevronRight
} from 'lucide-react';
import { StatusBadge } from '../../components/donor/DonorShared';
import { DONOR_STATS, DONOR_MY_POSTINGS, DONOR_INCOMING_REQUESTS } from '../../data/donorMockData';

export default function DonorDashboardPage({ onNavigate, foodListings }) {
  const donorPostings = [
    ...DONOR_MY_POSTINGS,
    ...((foodListings || []).filter(f => f.donorName && f.donorName.includes('Green Leaf'))),
  ];

  return (
    <div className="fr-dash-view">

      {/* Welcome Card */}
      <div className="fr-welcome-card">
        <div className="fr-welcome-left">
          <div className="fr-welcome-badge">
            <ShieldCheck size={14} /> Certified Donor Partner • Vavuniya
          </div>
          <h1 className="fr-welcome-title">Welcome back, Green Leaf Hotel</h1>
          <p className="fr-welcome-sub">
            Track your culinary surplus, coordinate collections with verified welfare partners, and log environmental impact.
          </p>
        </div>
        <div className="fr-welcome-actions">
          <button className="fr-btn fr-btn-primary" onClick={() => onNavigate('post-food')}>
            <PlusCircle size={16} /> Post Surplus Food
          </button>
          <button className="fr-btn fr-btn-secondary" onClick={() => onNavigate('requests')}>
            <Inbox size={16} /> Review Requests ({DONOR_INCOMING_REQUESTS.filter(r => r.status === 'pending').length})
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="fr-stats-grid">
        {DONOR_STATS.map(s => {
          const Icon =
            s.icon === 'ListOrdered'  ? ListOrdered  :
            s.icon === 'Inbox'        ? Inbox        :
            s.icon === 'CalendarClock'? CalendarClock :
            s.icon === 'CheckCircle2' ? CheckCircle2  :
            TrendingUp;
          return (
            <div key={s.id} className={`fr-stat-card fr-stat-${s.color}`}>
              <div className="fr-stat-top">
                <span className="fr-stat-label">{s.label}</span>
                <div className="fr-stat-icon-wrap"><Icon size={18} /></div>
              </div>
              <div className="fr-stat-value">{s.value}</div>
              <div className="fr-stat-sub">{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Recent Postings Table */}
      <div className="fr-section-card">
        <div className="fr-section-header">
          <div>
            <h2 className="fr-section-title">Recent Food Postings</h2>
            <p className="fr-section-sub">Live status and request metrics for your surplus items</p>
          </div>
          <button className="fr-btn fr-btn-secondary fr-btn-sm" onClick={() => onNavigate('my-donations')}>
            View All (3) <ChevronRight size={14} />
          </button>
        </div>
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
              {donorPostings.slice(0, 3).map(p => (
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
                    <button className="fr-btn fr-btn-ghost fr-btn-sm" onClick={() => onNavigate('my-donations')}>
                      <Eye size={14} /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="fr-dash-bottom-row">

        {/* Requests Preview */}
        <div className="fr-section-card">
          <div className="fr-section-header">
            <h2 className="fr-section-title">Incoming Requests</h2>
            <button className="fr-btn fr-btn-ghost fr-btn-sm" onClick={() => onNavigate('requests')}>
              View All <ChevronRight size={14} />
            </button>
          </div>
          {DONOR_INCOMING_REQUESTS.length === 0 ? (
            <div className="fr-empty-state"><Inbox size={32} /><p>No pending requests</p></div>
          ) : (
            <div className="fr-req-preview-list">
              {DONOR_INCOMING_REQUESTS.slice(0, 2).map(r => (
                <div key={r.id} className="fr-req-preview-item">
                  <div className="fr-req-avatar">{r.avatar}</div>
                  <div className="fr-req-info">
                    <div className="fr-req-org">
                      {r.orgName} <span className="fr-req-type">{r.orgType}</span>
                    </div>
                    <div className="fr-req-meal">{r.portions} • {r.distance}</div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Impact Summary */}
        <div className="fr-section-card fr-impact-card">
          <div className="fr-section-header">
            <h2 className="fr-section-title">Your Impact</h2>
            <Leaf size={18} color="var(--fr-primary)" />
          </div>
          <div className="fr-impact-items">
            <div className="fr-impact-item">
              <div className="fr-impact-val">130</div>
              <div className="fr-impact-label">Portions Rescued</div>
            </div>
            <div className="fr-impact-item">
              <div className="fr-impact-val">38.8<span>kg</span></div>
              <div className="fr-impact-label">CO₂e Saved</div>
            </div>
            <div className="fr-impact-item">
              <div className="fr-impact-val">3</div>
              <div className="fr-impact-label">Orgs Helped</div>
            </div>
            <div className="fr-impact-item">
              <div className="fr-impact-val">100<span>%</span></div>
              <div className="fr-impact-label">Handover Rate</div>
            </div>
          </div>
          <div className="fr-impact-badge">
            <Award size={14} /> Certified Rescue Partner — Vavuniya District
          </div>
        </div>

      </div>
    </div>
  );
}
