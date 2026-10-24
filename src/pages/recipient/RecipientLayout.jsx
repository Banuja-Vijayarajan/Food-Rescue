import React, { useState } from 'react';
import {
  LayoutDashboard, Utensils, Inbox, Truck,
  Bell, User, Settings, LogOut, ArrowLeft,
  ShieldCheck, ChevronRight, CheckCircle2, HeartHandshake
} from 'lucide-react';
import RecipientDashboardPage from './RecipientDashboardPage';
import AvailableFoodPage from './AvailableFoodPage';
import RecipientRequestsPage from './RecipientRequestsPage';
import RecipientPickupPage from './RecipientPickupPage';
import {
  RECIPIENT_PROFILE,
  INITIAL_RECIPIENT_REQUESTS,
  INITIAL_RECIPIENT_PICKUPS
} from '../../data/recipientMockData';
import '../../styles/donor-dashboard.css';
import '../../styles/recipient-dashboard.css';

export default function RecipientLayout({
  setCurrentPage,
  setCurrentRole,
  foodListings = [],
  onClaimMeal,
  initialNav = 'dashboard'
}) {
  const [activeNav, setActiveNav] = useState(initialNav || 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Recipient state for interactive lifecycle
  const [requests, setRequests] = useState(INITIAL_RECIPIENT_REQUESTS);
  const [pickups, setPickups] = useState(INITIAL_RECIPIENT_PICKUPS);

  // Back to Public View
  const handleBackToHome = () => {
    if (setCurrentRole) setCurrentRole('visitor');
    if (setCurrentPage) setCurrentPage('home');
  };

  const handleSignOut = () => {
    if (setCurrentRole) setCurrentRole('visitor');
    if (setCurrentPage) setCurrentPage('home');
  };

  // Callback when a recipient requests food from AvailableFoodPage
  const handleRequestMeal = (requestData) => {
    const newReqId = `req-rec-${Date.now()}`;
    const newRequest = {
      id: newReqId,
      mealId: requestData.mealId,
      mealTitle: requestData.mealTitle,
      image: requestData.image,
      donorName: requestData.donorName,
      donorType: 'Hotel & Banquet Partner',
      donorPhone: '+94 77 123 4567',
      donorLocation: requestData.donorLocation,
      donorRating: 4.9,
      portionsRequested: requestData.portionsRequested,
      totalAvailable: requestData.totalAvailable,
      requestedAt: 'Just now',
      safeUntil: requestData.safeUntil,
      storageMethod: requestData.storageMethod,
      purpose: requestData.purpose,
      contactPerson: requestData.contactPerson,
      status: 'Requested',
      stageIndex: 1,
      driverAssigned: null,
      driverPhone: null,
      vehicleNo: null,
      pickupTime: requestData.pickupWindow,
      statusNotes: 'Request sent to donor. Automated IVR call alert ringing donor contact desk.',
    };

    setRequests(prev => [newRequest, ...prev]);

    // Also inform parent app so the meal shows 'Requested' in the marketplace
    if (onClaimMeal && requestData.mealId) {
      onClaimMeal(requestData.mealId);
    }
  };

  // Change request status (e.g. cancel, or donor accepts)
  const handleRequestStatusChange = (requestId, newStatus) => {
    setRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          status: newStatus,
          statusNotes: newStatus === 'Cancelled' ? 'Request withdrawn by recipient organization.' : r.statusNotes,
        };
      }
      return r;
    }));
  };

  // Update pickup logistics & complete handover
  const handleUpdatePickup = (pickupId, updates) => {
    setPickups(prev => prev.map(p => {
      if (p.id === pickupId) {
        return { ...p, ...updates };
      }
      return p;
    }));

    // If completed, also update the request status to 'Completed'
    if (updates.status === 'Completed') {
      const targetPku = pickups.find(p => p.id === pickupId);
      if (targetPku && targetPku.requestId) {
        setRequests(prev => prev.map(r => {
          if (r.id === targetPku.requestId) {
            return {
              ...r,
              status: 'Completed',
              stageIndex: 5,
              ratingGiven: updates.ratingGiven,
              feedbackGiven: updates.feedbackGiven,
              statusNotes: 'Food received and verified safe. Handover documented.',
            };
          }
          return r;
        }));
      }
    }
  };

  const navItems = [
    { id: 'dashboard',      label: 'Dashboard',             icon: LayoutDashboard },
    { id: 'available-food', label: 'Available Surplus',      icon: Utensils, badge: foodListings.filter(f => f.status === 'Available').length },
    { id: 'requests',       label: 'Portion Requests',      icon: Inbox,    badge: requests.filter(r => r.status === 'Requested').length },
    { id: 'pickup',         label: 'Pickup & Logistics',    icon: Truck,    badge: pickups.filter(p => p.status !== 'Completed').length },
    { id: 'profile',        label: 'Welfare Profile',       icon: User },
    { id: 'notifications',  label: 'IVR Notifications',     icon: Bell },
  ];

  const renderActivePage = () => {
    switch (activeNav) {
      case 'dashboard':
        return (
          <RecipientDashboardPage
            onNavigate={setActiveNav}
            activeRequests={requests}
            pickupSchedule={pickups}
            foodListings={foodListings}
          />
        );
      case 'available-food':
        return (
          <AvailableFoodPage
            foodListings={foodListings}
            onRequestMeal={handleRequestMeal}
            onNavigate={setActiveNav}
          />
        );
      case 'requests':
        return (
          <RecipientRequestsPage
            requests={requests}
            onRequestStatusChange={handleRequestStatusChange}
            onNavigate={setActiveNav}
          />
        );
      case 'pickup':
        return (
          <RecipientPickupPage
            pickups={pickups}
            onUpdatePickup={handleUpdatePickup}
            onNavigate={setActiveNav}
          />
        );
      case 'profile':
        return (
          <div className="fr-recipient-view">
            <div className="fr-section-card" style={{ maxWidth: '780px', margin: '0 auto', padding: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #19C37D, #A3E635)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  color: '#0A1C12'
                }}>
                  {RECIPIENT_PROFILE.avatar}
                </div>
                <div>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--fr-text-heading)' }}>
                    {RECIPIENT_PROFILE.name}
                  </h1>
                  <span className="fr-rec-verified-pill" style={{ marginTop: '4px' }}>
                    <ShieldCheck size={12} /> Certified Welfare Organization • {RECIPIENT_PROFILE.regNumber}
                  </span>
                </div>
              </div>

              <div className="fr-rec-req-details-box" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '24px' }}>
                <div className="fr-rec-req-detail-col">
                  <span className="label">Contact Director</span>
                  <span className="value">{RECIPIENT_PROFILE.contactPerson}</span>
                </div>
                <div className="fr-rec-req-detail-col">
                  <span className="label">Direct Phone / Hotline</span>
                  <span className="value">{RECIPIENT_PROFILE.phone}</span>
                </div>
                <div className="fr-rec-req-detail-col">
                  <span className="label">Registered Address</span>
                  <span className="value">{RECIPIENT_PROFILE.address}</span>
                </div>
                <div className="fr-rec-req-detail-col">
                  <span className="label">Resident Beneficiaries</span>
                  <span className="value">{RECIPIENT_PROFILE.beneficiaryCount} resident children &amp; elders</span>
                </div>
                <div className="fr-rec-req-detail-col">
                  <span className="label">Designated Logistics Driver</span>
                  <span className="value">{RECIPIENT_PROFILE.assignedDriver}</span>
                </div>
                <div className="fr-rec-req-detail-col">
                  <span className="label">Registered Vehicle</span>
                  <span className="value">{RECIPIENT_PROFILE.vehicleDetails}</span>
                </div>
              </div>

              <div style={{ 
                padding: '16px', 
                background: 'var(--fr-bg-subtle)', 
                borderRadius: 'var(--fr-radius-md)', 
                border: '1px solid var(--fr-border-card)',
                marginBottom: '20px'
              }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--fr-text-heading)', marginBottom: '8px' }}>
                  Hygienic Storage &amp; Food Transport Facilities:
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {RECIPIENT_PROFILE.storageFacilities.map((f, i) => (
                    <span key={i} className="fr-rec-chip active" style={{ fontSize: '0.78rem' }}>
                      ✓ {f}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="fr-btn fr-btn-primary" onClick={() => setActiveNav('available-food')}>
                  Browse Food for Beneficiaries
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="fr-recipient-view">
            <div className="fr-section-card" style={{ padding: '60px', textAlign: 'center' }}>
              <Bell size={40} color="var(--fr-primary)" style={{ margin: '0 auto 16px' }} />
              <h2 style={{ color: 'var(--fr-text-heading)' }}>IVR Notification Log</h2>
              <p style={{ color: 'var(--fr-text-muted)', marginTop: '8px' }}>
                Automated phone call alerts and SMS dispatches are linked to hotline: <strong>{RECIPIENT_PROFILE.phone}</strong>
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fr-recipient-layout">
      {/* Sidebar */}
      <aside className={`fr-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div 
          className="fr-sidebar-profile" 
          onClick={() => setActiveNav('profile')}
          style={{ cursor: 'pointer' }}
          title="View Recipient Organization Profile"
        >
          <div className="fr-sidebar-avatar" style={{ background: 'linear-gradient(135deg, #19C37D, #A3E635)', color: '#0A1C12' }}>
            {RECIPIENT_PROFILE.avatar}
          </div>
          {sidebarOpen && (
            <div className="fr-sidebar-profile-info">
              <div className="fr-sidebar-name">{RECIPIENT_PROFILE.name}</div>
              <div className="fr-sidebar-role">
                <span className="fr-sidebar-verified"><ShieldCheck size={11} /></span>
                Recipient Organization
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="fr-sidebar-nav">
          {navItems.map(item => {
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

        {/* Sidebar Footer */}
        <div className="fr-sidebar-footer">
          <button 
            className="fr-sidebar-item back-home" 
            onClick={handleBackToHome} 
            title="Back to Public Marketplace"
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

      {/* Main Dashboard Area */}
      <div className="fr-dash-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Topbar */}
        <header className="fr-dash-topbar">
          <div className="fr-topbar-left">
            <button
              type="button"
              className="fr-topbar-back-btn"
              onClick={handleBackToHome}
              title="Return to Public Site"
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
              <span className="fr-breadcrumb-root">Recipient Portal</span>
              {activeNav !== 'dashboard' && (
                <>
                  <ChevronRight size={14} />
                  <span>{navItems.find(n => n.id === activeNav)?.label}</span>
                </>
              )}
            </div>
          </div>

          <div className="fr-topbar-right">
            <button
              className="fr-btn fr-btn-secondary fr-btn-sm"
              onClick={() => setActiveNav('available-food')}
            >
              <Utensils size={14} /> Browse Surplus
            </button>
          </div>
        </header>

        {/* Page View Body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {renderActivePage()}
        </div>
      </div>
    </div>
  );
}
