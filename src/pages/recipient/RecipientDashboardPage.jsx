import React from 'react';
import {
  Utensils, Clock, Truck, CheckCircle2, Users,
  ShieldCheck, MapPin, Phone, ArrowRight, AlertCircle,
  ExternalLink, CalendarClock, ChevronRight, Star,
  Heart, Sparkles, PlusCircle
} from 'lucide-react';
import { StatusBadge } from '../../components/donor/DonorShared';
import { RECIPIENT_PROFILE, RECIPIENT_STATS, RECIPIENT_HISTORY_LOG } from '../../data/recipientMockData';
import '../../styles/recipient-dashboard.css';

export default function RecipientDashboardPage({
  onNavigate,
  activeRequests = [],
  pickupSchedule = [],
  foodListings = []
}) {
  const pendingRequestsCount = activeRequests.filter(r => r.status === 'Requested' || r.status === 'Accepted').length;
  const activePickupsCount = pickupSchedule.filter(p => p.status !== 'Completed').length;
  const availableMealsCount = foodListings.filter(f => f.status === 'Available').length;

  return (
    <div className="fr-recipient-view">

      {/* ── Top Welcome & Organization Card ── */}
      <div className="fr-welcome-card" style={{ marginBottom: '24px' }}>
        <div className="fr-welcome-left">
          <div className="fr-welcome-badge" style={{ background: 'rgba(25, 195, 125, 0.18)', color: 'var(--fr-primary)' }}>
            <ShieldCheck size={14} /> Verified Welfare Organization • Reg: {RECIPIENT_PROFILE.regNumber}
          </div>
          <h1 className="fr-welcome-title">{RECIPIENT_PROFILE.name}</h1>
          <p className="fr-welcome-sub">
            Serving <strong>{RECIPIENT_PROFILE.beneficiaryCount} resident children & elderly</strong> in {RECIPIENT_PROFILE.address}. Connecting surplus culinary banquets with daily nutritional needs.
          </p>
        </div>
        <div className="fr-welcome-actions">
          <button 
            className="fr-btn fr-btn-primary" 
            onClick={() => onNavigate('available-food')}
          >
            <Utensils size={16} /> Browse Food ({availableMealsCount} Available)
          </button>
          <button 
            className="fr-btn fr-btn-secondary" 
            onClick={() => onNavigate('pickup')}
          >
            <Truck size={16} /> Pickup Logistics ({activePickupsCount})
          </button>
        </div>
      </div>

      {/* ── Real-Time Surplus Food Alert Banner (Proposal Section 3.2 #6 Notifications) ── */}
      {availableMealsCount > 0 && (
        <div 
          className="fr-rec-banner"
          style={{ 
            background: 'linear-gradient(135deg, rgba(163, 230, 53, 0.16) 0%, rgba(25, 195, 125, 0.12) 100%)',
            border: '1px solid rgba(163, 230, 53, 0.4)',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: '#A3E635',
              color: '#0A1C12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--fr-primary)' }}>
                Live IVR Surplus Alert • Nearby Donor
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--fr-text-heading)' }}>
                {foodListings[0]?.title} is Available in Vavuniya Town!
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--fr-text-muted)', marginTop: '2px' }}>
                {foodListings[0]?.portions} • Safe for consumption for next 2 hours • 1.2 km away
              </div>
            </div>
          </div>
          <button 
            className="fr-btn fr-btn-accent"
            onClick={() => onNavigate('available-food')}
          >
            Claim Portions Now <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* ── Key Metrics Grid ── */}
      <div className="fr-stats-grid" style={{ marginBottom: '28px' }}>
        {RECIPIENT_STATS.map(stat => {
          const Icon =
            stat.icon === 'Utensils'     ? Utensils :
            stat.icon === 'Clock'        ? Clock :
            stat.icon === 'Truck'        ? Truck :
            stat.icon === 'CheckCircle2' ? CheckCircle2 :
            Users;
          return (
            <div key={stat.id} className={`fr-stat-card fr-stat-${stat.color}`}>
              <div className="fr-stat-top">
                <span className="fr-stat-label">{stat.label}</span>
                <div className="fr-stat-icon-wrap"><Icon size={18} /></div>
              </div>
              <div className="fr-stat-value">{stat.value}</div>
              <div className="fr-stat-sub">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* ── Two Column Layout: Scheduled Pickup & Active Requests ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '28px' }}>

        {/* Column 1: Today's Scheduled Pickups */}
        <div className="fr-section-card">
          <div className="fr-section-header">
            <div>
              <h2 className="fr-section-title">Today's Scheduled Collection</h2>
              <p className="fr-section-sub">Assigned logistics driver and collection rendezvous</p>
            </div>
            <button 
              className="fr-btn fr-btn-secondary fr-btn-sm" 
              onClick={() => onNavigate('pickup')}
            >
              All Pickups <ChevronRight size={14} />
            </button>
          </div>

          {pickupSchedule.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--fr-text-muted)' }}>
              <CalendarClock size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
              <p>No collections scheduled for today.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {pickupSchedule.slice(0, 1).map(p => (
                <div 
                  key={p.id}
                  style={{
                    background: 'var(--fr-bg-subtle)',
                    border: '1px solid var(--fr-border-card)',
                    borderRadius: 'var(--fr-radius-md)',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--fr-text-heading)' }}>
                        {p.mealTitle}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--fr-text-muted)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <MapPin size={12} color="var(--fr-primary)" />
                        {p.donorName} • {p.distance}
                      </div>
                    </div>
                    <span className="fr-pickup-status-step scheduled">
                      <Clock size={12} /> {p.scheduledTime}
                    </span>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '10px', 
                    padding: '10px', 
                    background: 'var(--fr-bg-card)', 
                    borderRadius: '8px' 
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--fr-text-muted)', fontWeight: 700 }}>LOGISTICS DRIVER</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--fr-text-heading)' }}>{p.driverName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--fr-primary)' }}>{p.vehicleNumber}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--fr-text-muted)', fontWeight: 700 }}>QUANTITY / PORTIONS</div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--fr-text-heading)' }}>{p.portions}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--fr-text-muted)' }}>Hot insulated containers</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <a 
                      href={`tel:${p.driverPhone}`} 
                      className="fr-btn fr-btn-secondary fr-btn-sm"
                    >
                      <Phone size={13} /> Call Driver
                    </a>
                    <button 
                      className="fr-btn fr-btn-primary fr-btn-sm"
                      onClick={() => onNavigate('pickup')}
                    >
                      Manage Pickup Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Active Requests Lifecycle */}
        <div className="fr-section-card">
          <div className="fr-section-header">
            <div>
              <h2 className="fr-section-title">Active Requests</h2>
              <p className="fr-section-sub">Donation requests currently in progress</p>
            </div>
            <button 
              className="fr-btn fr-btn-secondary fr-btn-sm" 
              onClick={() => onNavigate('requests')}
            >
              View Requests ({pendingRequestsCount}) <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeRequests.slice(0, 2).map(req => (
              <div 
                key={req.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  background: 'var(--fr-bg-subtle)',
                  borderRadius: 'var(--fr-radius-md)',
                  border: '1px solid var(--fr-border-card)'
                }}
              >
                <img 
                  src={req.image} 
                  alt="" 
                  style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} 
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--fr-text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {req.mealTitle}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--fr-text-muted)' }}>
                    {req.donorName} • {req.portionsRequested} portions
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
          </div>

          <button 
            className="fr-btn fr-btn-secondary" 
            style={{ width: '100%', marginTop: '16px' }}
            onClick={() => onNavigate('available-food')}
          >
            <PlusCircle size={15} /> Find More Food Donations
          </button>
        </div>

      </div>

      {/* ── Donation History & Verified Handover Records ── */}
      <div className="fr-section-card">
        <div className="fr-section-header">
          <div>
            <h2 className="fr-section-title">Verified Handover Records & History</h2>
            <p className="fr-section-sub">
              Complete audit trail of safe food collections with temperature verification and donor rating
            </p>
          </div>
        </div>

        <div className="fr-table-wrap">
          <table className="fr-table">
            <thead>
              <tr>
                <th>DATE & TIME</th>
                <th>DONOR ESTABLISHMENT</th>
                <th>RESCUED MEAL DETAILS</th>
                <th>PORTIONS</th>
                <th>LOGISTICS DRIVER</th>
                <th>HYGIENE COMPLIANCE</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {RECIPIENT_HISTORY_LOG.map(log => (
                <tr key={log.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--fr-text-heading)' }}>{log.date}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)' }}>{log.time}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--fr-text-heading)' }}>{log.donor}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--fr-primary)' }}>Verified Partner</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--fr-text-heading)' }}>{log.meal}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--fr-primary)' }}>{log.portions} portions</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', color: 'var(--fr-text-body)' }}>{log.driver}</div>
                  </td>
                  <td>
                    <span style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      fontSize: '0.78rem', 
                      color: 'var(--fr-primary)',
                      background: 'rgba(25, 195, 125, 0.12)',
                      padding: '3px 8px',
                      borderRadius: '9999px'
                    }}>
                      <ShieldCheck size={12} /> Passed (Hot & Intact)
                    </span>
                  </td>
                  <td>
                    <span className="fr-status-badge badge-collected">
                      <CheckCircle2 size={11} /> Completed
                    </span>
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
