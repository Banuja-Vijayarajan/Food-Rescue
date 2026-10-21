import React, { useState } from 'react';
import {
  ArrowLeft, PlusCircle, ListOrdered, Inbox, CalendarClock,
  History, Bell, User, Settings, LogOut,
  LayoutDashboard, ShieldCheck, ChevronDown, ChevronRight
} from 'lucide-react';
import DonorDashboardPage from './DonorDashboardPage';
import DonorDonationsPage from './DonorDonationsPage';
import DonorRequestsPage from './DonorRequestsPage';
import DonorPickupPage from './DonorPickupPage';
import PostFoodPage from './PostFoodPage';
import DonorProfilePage from './DonorProfilePage';
import '../../styles/donor-dashboard.css';

const NAV_ITEMS = [
  { id: 'dashboard',     label: 'Dashboard',           icon: LayoutDashboard },
  { id: 'post-food',     label: 'Post Food',            icon: PlusCircle },
  { id: 'my-donations',  label: 'My Donations',         icon: ListOrdered },
  { id: 'requests',      label: 'Incoming Requests',    icon: Inbox, badge: 2 },
  { id: 'pickup',        label: 'Pickup Schedule',      icon: CalendarClock },
  { id: 'history',       label: 'Donation History',     icon: History },
  { id: 'notifications', label: 'Notifications',        icon: Bell },
  { id: 'profile',       label: 'Donor Profile',        icon: User },
  { id: 'settings',      label: 'Settings',             icon: Settings },
];

export default function DonorLayout({ 
  setCurrentPage, 
  setCurrentRole, 
  foodListings, 
  onMealPosted,
  initialNav = 'dashboard',
  highlightedMealId = null
}) {
  const [activeNav, setActiveNav] = useState(initialNav || 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Return to Home Page
  const handleBackToHome = () => {
    if (setCurrentRole) setCurrentRole('visitor');
    if (setCurrentPage) setCurrentPage('home');
  };

  const handleSignOut = () => {
    if (setCurrentRole) setCurrentRole('visitor');
    if (setCurrentPage) setCurrentPage('home');
  };

  const renderPage = () => {
    switch (activeNav) {
      case 'dashboard':    return <DonorDashboardPage onNavigate={setActiveNav} foodListings={foodListings} />;
      case 'post-food':    return <PostFoodPage onNavigate={setActiveNav} onMealPosted={onMealPosted} />;
      case 'my-donations': return (
        <DonorDonationsPage 
          onOpenPost={() => setActiveNav('post-food')} 
          foodListings={foodListings} 
          highlightedMealId={highlightedMealId}
        />
      );
      case 'requests':     return <DonorRequestsPage />;
      case 'pickup':       return <DonorPickupPage />;
      case 'profile':      return <DonorProfilePage />;
      default:
        return (
          <div className="fr-dash-view">
            <div className="fr-section-card" style={{ padding: '60px', textAlign: 'center' }}>
              <Bell size={40} color="var(--fr-primary)" />
              <h2 style={{ marginTop: '16px', color: 'var(--fr-text-heading)' }}>
                {NAV_ITEMS.find(n => n.id === activeNav)?.label}
              </h2>
              <p style={{ color: 'var(--fr-text-muted)', marginTop: '8px' }}>
                This section is coming soon!
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fr-donor-layout">
      {/* Sidebar */}
      <aside className={`fr-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div 
          className="fr-sidebar-profile" 
          onClick={() => setActiveNav('profile')}
          style={{ cursor: 'pointer' }}
          title="View Donor Profile"
        >
          <div className="fr-sidebar-avatar">GL</div>
          {sidebarOpen && (
            <div className="fr-sidebar-profile-info">
              <div className="fr-sidebar-name">Green Leaf Hotel</div>
              <div className="fr-sidebar-role">
                <span className="fr-sidebar-verified"><ShieldCheck size={11} /></span>
                Food Donor
              </div>
            </div>
          )}
        </div>

        <nav className="fr-sidebar-nav">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                className={`fr-sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon size={18} />
                {sidebarOpen && <span className="fr-sidebar-label">{item.label}</span>}
                {sidebarOpen && item.badge > 0 && (
                  <span className="fr-sidebar-badge">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="fr-sidebar-footer">
          {/* Back to Home Button in Sidebar */}
          <button 
            className="fr-sidebar-item back-home" 
            onClick={handleBackToHome} 
            title="Back to Home Page"
          >
            <ArrowLeft size={18} />
            {sidebarOpen && <span className="fr-sidebar-label">Back to Home</span>}
          </button>
          <button 
            className="fr-sidebar-item signout" 
            onClick={handleSignOut} 
            title="Sign Out"
          >
            <LogOut size={18} />
            {sidebarOpen && <span className="fr-sidebar-label">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="fr-dash-main">
        <header className="fr-dash-topbar">
          <div className="fr-topbar-left">
            {/* Prominent Back to Home Button */}
            <button
              type="button"
              className="fr-topbar-back-btn"
              onClick={handleBackToHome}
              title="Return to Home Page"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>

            <div className="fr-topbar-divider" />

            <button 
              type="button"
              className="fr-sidebar-toggle" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title="Toggle Sidebar"
            >
              <LayoutDashboard size={18} />
            </button>

            <div className="fr-topbar-breadcrumb">
              <span className="fr-breadcrumb-root">Donor Portal</span>
              {activeNav !== 'dashboard' && (
                <>
                  <ChevronRight size={14} />
                  <span>{NAV_ITEMS.find(n => n.id === activeNav)?.label}</span>
                </>
              )}
            </div>
          </div>

          <div className="fr-topbar-right">
            <button className="fr-topbar-icon-btn" title="Notifications">
              <Bell size={18} />
              <span className="fr-topbar-notif-dot" />
            </button>
            <button
              className="fr-btn fr-btn-primary fr-btn-sm"
              onClick={() => setActiveNav('post-food')}
            >
              <PlusCircle size={15} /> Post Surplus
            </button>
            <div 
              className="fr-topbar-profile"
              onClick={() => setActiveNav('profile')}
              style={{ cursor: 'pointer' }}
              title="View Donor Profile"
            >
              <div className="fr-topbar-avatar">GL</div>
              <div className="fr-topbar-info">
                <div className="fr-topbar-name">Green Leaf Hotel</div>
                <div className="fr-topbar-role">Food Donor</div>
              </div>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>

        <main className="fr-dash-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
