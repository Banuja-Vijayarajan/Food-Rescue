import React from 'react';
import {
  Utensils,
  Scale,
  Building2,
  HeartHandshake,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Leaf,
  Truck,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  MapPin,
  ArrowUpRight,
  FileText,
  Users
} from 'lucide-react';
import { ADMIN_STATS, INITIAL_VERIFICATIONS, INITIAL_ADMIN_DONATIONS, INITIAL_DISPUTES_AND_REPORTS } from '../../data/adminMockData';

export default function AdminDashboardPage({ onNavigate }) {
  const pendingVerifs = INITIAL_VERIFICATIONS.filter(v => v.status === 'Pending');
  const activeDisputes = INITIAL_DISPUTES_AND_REPORTS.filter(d => d.status !== 'Resolved');
  const liveDonations = INITIAL_ADMIN_DONATIONS.filter(d => ['Available', 'Requested', 'Accepted', 'Pickup Scheduled', 'Collected'].includes(d.status));

  return (
    <div className="fr-admin-dashboard-page">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.14), rgba(16, 185, 129, 0.04))',
        border: '1px solid rgba(25, 195, 125, 0.25)',
        borderRadius: 'var(--fr-radius-md)',
        padding: '24px 28px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              background: 'var(--fr-primary)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Supervisor Central Desk
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--fr-text-muted)' }}>
              Food Rescue Platform Governance • IT3162
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--fr-text-heading)' }}>
            Operations & Redistribution Command Center
          </h1>
          <p style={{ color: 'var(--fr-text-muted)', fontSize: '0.88rem', marginTop: '4px', maxWidth: '640px' }}>
            Real-time oversight across food donor hotels, verified welfare organizations, rapid logistics dispatch, and food safety compliance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="fr-table-btn primary"
            style={{ padding: '10px 18px', fontSize: '0.86rem' }}
            onClick={() => onNavigate('verifications')}
          >
            <ShieldCheck size={16} /> Verify Organizations ({pendingVerifs.length})
          </button>
          <button
            type="button"
            className="fr-table-btn"
            style={{ padding: '10px 18px', fontSize: '0.86rem' }}
            onClick={() => onNavigate('donations')}
          >
            <Truck size={16} /> Track Live Food ({liveDonations.length})
          </button>
        </div>
      </div>

      {/* Urgent Action Banner if pending tasks exist */}
      {(pendingVerifs.length > 0 || activeDisputes.length > 0) && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {pendingVerifs.length > 0 && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'var(--fr-radius-sm)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => onNavigate('verifications')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--fr-text-heading)' }}>
                    {pendingVerifs.length} Organizations Awaiting Verification
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--fr-text-muted)' }}>
                    Grand Northern Palace Hotel + Grace Care Sanctuary
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="#f59e0b" />
            </div>
          )}

          {activeDisputes.length > 0 && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--fr-radius-sm)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
            onClick={() => onNavigate('reports')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--fr-text-heading)' }}>
                    {activeDisputes.length} Moderation / Safety Flag Open
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--fr-text-muted)' }}>
                    Logistics delay & portion count clarification
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="#ef4444" />
            </div>
          )}
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="fr-admin-stats-grid">
        <div className="fr-admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="fr-admin-stat-icon-wrap" style={{ background: 'rgba(25, 195, 125, 0.16)', color: 'var(--fr-primary)' }}>
              <Utensils size={22} />
            </div>
            <span className="fr-admin-stat-trend fr-trend-positive">
              <TrendingUp size={14} /> +14.2%
            </span>
          </div>
          <div>
            <div className="fr-admin-stat-val">{ADMIN_STATS.totalMealsRescued.toLocaleString()}+</div>
            <div className="fr-admin-stat-label">Meals Rescued & Served</div>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)', borderTop: '1px solid var(--fr-border-card)', paddingTop: '8px' }}>
            Across 100% verified partner shelters
          </div>
        </div>

        <div className="fr-admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="fr-admin-stat-icon-wrap" style={{ background: 'rgba(163, 230, 53, 0.16)', color: '#84cc16' }}>
              <Scale size={22} />
            </div>
            <span className="fr-admin-stat-trend fr-trend-positive">
              <TrendingUp size={14} /> +9.8%
            </span>
          </div>
          <div>
            <div className="fr-admin-stat-val">{ADMIN_STATS.totalFoodWeightKg.toLocaleString()} kg</div>
            <div className="fr-admin-stat-label">Clean Surplus Redistributed</div>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)', borderTop: '1px solid var(--fr-border-card)', paddingTop: '8px' }}>
            Prevented organic landfill decomposition
          </div>
        </div>

        <div className="fr-admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="fr-admin-stat-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.16)', color: '#3b82f6' }}>
              <Building2 size={22} />
            </div>
            <span className="fr-admin-stat-trend fr-trend-positive">
              <Users size={14} /> {ADMIN_STATS.activeDonors + ADMIN_STATS.activeRecipients} Total
            </span>
          </div>
          <div>
            <div className="fr-admin-stat-val">{ADMIN_STATS.activeDonors} / {ADMIN_STATS.activeRecipients}</div>
            <div className="fr-admin-stat-label">Active Donors / Recipient Orgs</div>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)', borderTop: '1px solid var(--fr-border-card)', paddingTop: '8px' }}>
            Hotels, Caterers, Orphanages, Shelters
          </div>
        </div>

        <div className="fr-admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="fr-admin-stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.16)', color: '#f59e0b' }}>
              <Truck size={22} />
            </div>
            <span className="fr-admin-stat-trend fr-trend-positive">
              <Clock size={14} /> 38m avg
            </span>
          </div>
          <div>
            <div className="fr-admin-stat-val">{liveDonations.length} Live</div>
            <div className="fr-admin-stat-label">Ongoing Surplus Batches</div>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)', borderTop: '1px solid var(--fr-border-card)', paddingTop: '8px' }}>
            In pickup, transit, or awaiting match
          </div>
        </div>

        <div className="fr-admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="fr-admin-stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.16)', color: '#10b981' }}>
              <Leaf size={22} />
            </div>
            <span className="fr-admin-stat-trend fr-trend-positive">
              15.5 T
            </span>
          </div>
          <div>
            <div className="fr-admin-stat-val">{(ADMIN_STATS.co2ePreventedKg / 1000).toFixed(1)} Tons</div>
            <div className="fr-admin-stat-label">CO₂e Emissions Prevented</div>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)', borderTop: '1px solid var(--fr-border-card)', paddingTop: '8px' }}>
            Environmental circular economy impact
          </div>
        </div>

        <div className="fr-admin-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="fr-admin-stat-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.16)', color: '#8b5cf6' }}>
              <ShieldCheck size={22} />
            </div>
            <span className="fr-admin-stat-trend fr-trend-positive">
              <CheckCircle2 size={14} /> Certified
            </span>
          </div>
          <div>
            <div className="fr-admin-stat-val">{ADMIN_STATS.overallSafetyComplianceRate}%</div>
            <div className="fr-admin-stat-label">Food Safety Compliance</div>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)', borderTop: '1px solid var(--fr-border-card)', paddingTop: '8px' }}>
            Temperature logged & PHI verified
          </div>
        </div>
      </div>

      {/* Main Grid: Donation Flow + District Distribution */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Donation Lifecycle Monitor */}
        <div className="fr-admin-card" style={{ marginBottom: 0 }}>
          <div className="fr-admin-card-header">
            <div>
              <h2 className="fr-admin-card-title">
                <Truck size={20} color="var(--fr-primary)" />
                Donation Lifecycle Distribution
              </h2>
              <p className="fr-admin-card-subtitle">
                Real-time tracking from surplus posting to verified handover
              </p>
            </div>
            <button
              type="button"
              className="fr-table-btn"
              onClick={() => onNavigate('donations')}
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { status: 'Available', label: '1. Available for Claim', count: 2, color: '#3b82f6', percent: 25 },
              { status: 'Requested', label: '2. Requested by Recipient', count: 1, color: '#f59e0b', percent: 12.5 },
              { status: 'Accepted', label: '3. Accepted by Donor', count: 1, color: '#8b5cf6', percent: 12.5 },
              { status: 'Pickup Scheduled', label: '4. Pickup Scheduled & Dispatched', count: 1, color: '#0ea5e9', percent: 12.5 },
              { status: 'Collected', label: '5. In Transit (Vehicle En Route)', count: 1, color: '#10b981', percent: 12.5 },
              { status: 'Completed', label: '6. Handed Over & Completed', count: 1, color: '#16a34a', percent: 12.5 },
              { status: 'Cancelled', label: 'Cancelled / Expired (Safety Abort)', count: 1, color: '#ef4444', percent: 12.5 },
            ].map(item => (
              <div key={item.status}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--fr-text-heading)' }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>{item.count} batches</span>
                </div>
                <div className="fr-progress-bar-bg">
                  <div
                    className="fr-progress-bar-fill"
                    style={{ width: `${item.percent}%`, background: item.color }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional District Distribution */}
        <div className="fr-admin-card" style={{ marginBottom: 0 }}>
          <div className="fr-admin-card-header">
            <div>
              <h2 className="fr-admin-card-title">
                <MapPin size={20} color="var(--fr-primary)" />
                Redistribution by District Hub
              </h2>
              <p className="fr-admin-card-subtitle">
                Active coverage across Northern & North Central Provinces
              </p>
            </div>
            <button
              type="button"
              className="fr-table-btn"
              onClick={() => onNavigate('settings')}
            >
              Config Zones <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { district: 'Vavuniya (Central Operations Hub)', share: '46%', meals: '8,487 meals', donors: 18, recipients: 24, status: 'Active Hub' },
              { district: 'Jaffna District', share: '24%', meals: '4,428 meals', donors: 8, recipients: 12, status: 'Active Hub' },
              { district: 'Kilinochchi District', share: '14%', meals: '2,583 meals', donors: 4, recipients: 6, status: 'Covered' },
              { district: 'Anuradhapura Sub-Zone', share: '9%', meals: '1,660 meals', donors: 3, recipients: 4, status: 'Active' },
              { district: 'Mannar & Mullaitivu', share: '7%', meals: '1,292 meals', donors: 3, recipients: 5, status: 'Expanding' },
            ].map((reg, idx) => (
              <div key={idx} style={{
                background: 'var(--fr-bg-subtle)',
                borderRadius: 'var(--fr-radius-sm)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--fr-text-heading)' }}>
                    {reg.district}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)' }}>
                    {reg.donors} Donors • {reg.recipients} Recipient Orgs
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--fr-primary)' }}>
                    {reg.share}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>
                    {reg.meals}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Recent Transactions & Food Batches */}
      <div className="fr-admin-card">
        <div className="fr-admin-card-header">
          <div>
            <h2 className="fr-admin-card-title">
              <Clock size={20} color="var(--fr-primary)" />
              Recent Redistribution Activities & System Events
            </h2>
            <p className="fr-admin-card-subtitle">
              Live audit stream of donor postings, recipient requests, and driver handovers
            </p>
          </div>
          <button
            type="button"
            className="fr-table-btn"
            onClick={() => onNavigate('analytics')}
          >
            <FileText size={14} /> Full Audit Report
          </button>
        </div>

        <div className="fr-admin-table-wrap">
          <table className="fr-admin-table">
            <thead>
              <tr>
                <th>Batch / Food Item</th>
                <th>Donor Partner</th>
                <th>Recipient Organization</th>
                <th>Portions</th>
                <th>Safe Until</th>
                <th>Lifecycle Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_ADMIN_DONATIONS.slice(0, 5).map(meal => (
                <tr key={meal.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--fr-text-heading)' }}>{meal.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--fr-text-muted)' }}>ID: {meal.id} • {meal.category}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{meal.donorName}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>{meal.district}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{meal.recipientName}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>Driver: {meal.driverName}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--fr-primary)' }}>{meal.portions}</span>
                    <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>{meal.weightKg} kg</div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem', color: meal.safeUntil.includes('left') ? 'var(--fr-warning)' : 'var(--fr-text-heading)' }}>
                      {meal.safeUntil}
                    </div>
                  </td>
                  <td>
                    <span className={`fr-status-badge fr-badge-${meal.status.toLowerCase().replace(/\s+/g, '-')}`}>
                      {meal.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="fr-table-btn"
                      onClick={() => onNavigate('donations')}
                    >
                      Track
                    </button>
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
