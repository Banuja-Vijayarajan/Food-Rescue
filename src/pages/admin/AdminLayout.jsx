import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Truck,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  ChevronDown
} from 'lucide-react';
import AdminDashboardPage from './AdminDashboardPage';
import AdminUsersPage from './AdminUsersPage';
import AdminVerificationPage from './AdminVerificationPage';
import AdminDonationsPage from './AdminDonationsPage';
import AdminReportsPage from './AdminReportsPage';
import AdminAnalyticsPage from './AdminAnalyticsPage';
import AdminSettingsPage from './AdminSettingsPage';
import { ADMIN_PROFILE, INITIAL_VERIFICATIONS, INITIAL_DISPUTES_AND_REPORTS } from '../../data/adminMockData';
import '../../styles/admin-dashboard.css';

const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Dashboard',             icon: LayoutDashboard },
  { id: 'users',         label: 'User Management',       icon: Users, badge: 13 },
  { id: 'verifications', label: 'Verification', icon: ShieldCheck, badge: 4, badgeType: 'amber' },
  { id: 'donations',     label: 'Donation Tracking',     icon: Truck, badge: 7 },
  { id: 'reports',       label: 'Moderation & Disputes', icon: AlertTriangle, badge: 3, badgeType: 'urgent' },
  { id: 'analytics',     label: 'Rating & Reports',      icon: BarChart3 },
  { id: 'settings',      label: 'System Info & Audit',   icon: Settings },
];

export default function AdminLayout({
  setCurrentPage,
  setCurrentRole,
  foodListings = [],
  setFoodListings,
  initialNav = 'dashboard'
}) {
  const [activeNav, setActiveNav] = useState(initialNav || 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(4);
  const [currentTime, setCurrentTime] = useState('');

  // Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = () => {
    if (setCurrentRole) setCurrentRole('visitor');
    if (setCurrentPage) setCurrentPage('home');
  };

  const notifications = [
    {
      id: 1,
      title: 'New Verification Request',
      desc: 'Grand Northern Palace Hotel submitted BRC & PHI certificates.',
      time: '15m ago',
      targetNav: 'verifications'
    },
    {
      id: 2,
      title: 'Active Delivery Scheduled',
      desc: 'Driver Kumaran en route in Van WP ND-4521 to Child Care Center.',
      time: '35m ago',
      targetNav: 'donations'
    },
    {
      id: 3,
      title: 'Food Safety Incident Resolved',
      desc: 'Seafood batch cold-chain breach auto-aborted safely.',
      time: '2h ago',
      targetNav: 'reports'
    },
    {
      id: 4,
      title: 'New Recipient Registered',
      desc: 'Grace Care Sanctuary submitted verification documents.',
      time: '4h ago',
      targetNav: 'verifications'
    },
  ];

  const renderActivePage = () => {
    switch (activeNav) {
      case 'dashboard':
        return <AdminDashboardPage onNavigate={setActiveNav} />;
      case 'users':
        return <AdminUsersPage />;
      case 'verifications':
        return <AdminVerificationPage />;
      case 'donations':
        return <AdminDonationsPage />;
      case 'reports':
        return <AdminReportsPage />;
      case 'analytics':
        return <AdminAnalyticsPage />;
      case 'settings':
        return <AdminSettingsPage />;
      default:
        return <AdminDashboardPage onNavigate={setActiveNav} />;
    }
  };

  return (
    <div className="fr-admin-layout">
      {/* Admin Sidebar */}
      <aside className={`fr-admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="fr-admin-sidebar-header">
          <div className="fr-admin-avatar">
            {ADMIN_PROFILE.avatar}
          </div>
          {sidebarOpen && (
            <div className="fr-admin-header-info">
              <div className="fr-admin-title">Food Rescue Admin</div>
              <div className="fr-admin-badge">
                <ShieldCheck size={12} /> Operations Central
              </div>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <nav className="fr-admin-nav-list">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`fr-admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
                title={item.label}
              >
                <Icon size={18} />
                {sidebarOpen && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`fr-admin-badge-count ${item.badgeType || ''}`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="fr-admin-sidebar-footer">
          <button
            type="button"
            className="fr-admin-nav-item"
            style={{ color: 'var(--fr-danger)' }}
            onClick={handleSignOut}
            title="Sign Out"
          >
            <LogOut size={16} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="fr-admin-main">
        {/* Topbar */}
        <header className="fr-admin-topbar">
          <div className="fr-admin-topbar-left">
            <button
              type="button"
              className="fr-admin-toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? <Menu size={18} /> : <Menu size={18} />}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--fr-text-heading)' }}>
                {NAV_ITEMS.find(n => n.id === activeNav)?.label || 'Dashboard'}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>
                Operations Central • Vavuniya Control Desk • {currentTime}
              </div>
            </div>
          </div>

          <div className="fr-admin-topbar-right">
            {/* System Status Pill */}
            <div className="fr-admin-system-status">
              <span className="fr-pulse-dot-green"></span>
              <span>All Systems Operational</span>
            </div>

            {/* Notification Menu */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="fr-admin-toggle-btn"
                style={{ position: 'relative' }}
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  if (!notifDropdownOpen) setUnreadNotifsCount(0);
                }}
                title="Notifications"
              >
                <Bell size={18} />
                {unreadNotifsCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'var(--fr-danger)',
                    color: '#fff',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="fr-admin-notif-menu">
                  <div className="fr-admin-notif-header">
                    <span>Administrative Notifications</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--fr-primary)', cursor: 'pointer' }} onClick={() => setNotifDropdownOpen(false)}>
                      Close
                    </span>
                  </div>
                  <div className="fr-admin-notif-list">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="fr-admin-notif-item"
                        onClick={() => {
                          setActiveNav(notif.targetNav);
                          setNotifDropdownOpen(false);
                        }}
                      >
                        <div style={{
                          width: '8px', height: '8px', borderRadius: '50%',
                          background: 'var(--fr-primary)', marginTop: '5px', flexShrink: 0
                        }}></div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--fr-text-heading)' }}>{notif.title}</div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)' }}>{notif.desc}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--fr-text-muted)', marginTop: '2px' }}>{notif.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Mini Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 10px',
              borderRadius: '9999px',
              background: 'var(--fr-bg-subtle)',
              border: '1px solid var(--fr-border-card)'
            }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #047857)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.78rem'
              }}>
                AD
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--fr-text-heading)' }}>
                  Supervisor Admin
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--fr-primary)' }}>
                  Level 5 Clearance
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Admin View */}
        <main className="fr-admin-view-container">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
}
