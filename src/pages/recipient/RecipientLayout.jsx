import React, { useState } from 'react';
import {
  LayoutDashboard, Utensils, Inbox, Truck,
  Bell, User, Settings, LogOut,
  ShieldCheck, ChevronRight, CheckCircle2, HeartHandshake, Edit3, Save, X,
  PhoneCall, MessageSquare, MonitorSmartphone, LockKeyhole, UserX, AlertTriangle
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
  const [recipientProfile, setRecipientProfile] = useState({ ...RECIPIENT_PROFILE });
  const [profileForm, setProfileForm] = useState({ ...RECIPIENT_PROFILE });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [callAlertsEnabled, setCallAlertsEnabled] = useState(true);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const startProfileEdit = () => {
    setProfileForm({ ...recipientProfile });
    setIsEditingProfile(true);
  };

  const cancelProfileEdit = () => {
    setProfileForm({ ...recipientProfile });
    setIsEditingProfile(false);
  };

  const saveProfile = (event) => {
    event.preventDefault();
    setRecipientProfile({
      ...profileForm,
      beneficiaryCount: Number(profileForm.beneficiaryCount) || 0,
    });
    setIsEditingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
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
    { id: 'notifications',  label: 'Notifications',         icon: Bell },
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
      case 'notifications':
        return (
          <div className="fr-recipient-view">
            <div className="fr-page-header">
              <div>
                <h1 className="fr-page-title">Notification Alerts</h1>
                <p className="fr-page-sub">Choose how your organization is alerted when a donor posts surplus food.</p>
              </div>
            </div>

            <div className="fr-rec-notification-card">
              <div className="fr-rec-notification-intro">
                <Bell size={22} />
                <div>
                  <strong>New donor food post alerts</strong>
                  <p>Alerts are sent immediately to help your organization respond before the safe collection window closes.</p>
                </div>
              </div>

              <div className="fr-rec-alert-option locked">
                <div className="fr-rec-alert-icon"><MonitorSmartphone size={20} /></div>
                <div className="fr-rec-alert-copy">
                  <strong>System Alerts</strong>
                  <span>In-app alerts for every new surplus food post.</span>
                  <small><LockKeyhole size={12} /> Required and cannot be disabled</small>
                </div>
                <label className="fr-rec-alert-switch" title="System alerts are required">
                  <input type="checkbox" checked disabled readOnly />
                  <span />
                </label>
              </div>

              <div className="fr-rec-alert-option locked">
                <div className="fr-rec-alert-icon"><MessageSquare size={20} /></div>
                <div className="fr-rec-alert-copy">
                  <strong>SMS Alerts</strong>
                  <span>SMS sent to {recipientProfile.phone} when new food is posted.</span>
                  <small><LockKeyhole size={12} /> Required and cannot be disabled</small>
                </div>
                <label className="fr-rec-alert-switch" title="SMS alerts are required">
                  <input type="checkbox" checked disabled readOnly />
                  <span />
                </label>
              </div>

              <div className="fr-rec-alert-option">
                <div className="fr-rec-alert-icon"><PhoneCall size={20} /></div>
                <div className="fr-rec-alert-copy">
                  <strong>Call Alerts</strong>
                  <span>Receive automated phone calls when a donor posts urgent surplus food.</span>
                  <small className="optional">Optional — your organization can disable this alert.</small>
                </div>
                <label className="fr-rec-alert-switch">
                  <input
                    type="checkbox"
                    checked={callAlertsEnabled}
                    onChange={(event) => setCallAlertsEnabled(event.target.checked)}
                  />
                  <span />
                </label>
              </div>

              <div className="fr-rec-alert-status">
                <CheckCircle2 size={17} />
                {callAlertsEnabled
                  ? 'System, SMS and call alerts are currently enabled.'
                  : 'System and SMS alerts are enabled. Call alerts are disabled.'}
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="fr-recipient-view">
            <div className="fr-section-card" style={{ maxWidth: '780px', margin: '0 auto', padding: '36px' }}>
              {profileSaved && (
                <div className="fr-rec-profile-saved">
                  <CheckCircle2 size={18} /> Welfare profile updated successfully.
                </div>
              )}

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
                  {recipientProfile.avatar}
                </div>
                <div>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--fr-text-heading)' }}>
                    {recipientProfile.name}
                  </h1>
                  <span className="fr-rec-verified-pill" style={{ marginTop: '4px' }}>
                    <ShieldCheck size={12} /> Certified Welfare Organization • {recipientProfile.regNumber}
                  </span>
                </div>
              </div>

              {!isEditingProfile ? (
                <>
                  <div className="fr-rec-req-details-box" style={{ gridTemplateColumns: '1fr 1fr', marginBottom: '24px' }}>
                    <div className="fr-rec-req-detail-col">
                      <span className="label">Contact Director</span>
                      <span className="value">{recipientProfile.contactPerson}</span>
                    </div>
                    <div className="fr-rec-req-detail-col">
                      <span className="label">Direct Phone / Hotline</span>
                      <span className="value">{recipientProfile.phone}</span>
                    </div>
                    <div className="fr-rec-req-detail-col">
                      <span className="label">Registered Address</span>
                      <span className="value">{recipientProfile.address}</span>
                    </div>
                    <div className="fr-rec-req-detail-col">
                      <span className="label">Resident Beneficiaries</span>
                      <span className="value">{recipientProfile.beneficiaryCount} resident children &amp; elders</span>
                    </div>
                    <div className="fr-rec-req-detail-col">
                      <span className="label">Designated Logistics Driver</span>
                      <span className="value">{recipientProfile.assignedDriver}</span>
                    </div>
                    <div className="fr-rec-req-detail-col">
                      <span className="label">Registered Vehicle</span>
                      <span className="value">{recipientProfile.vehicleDetails}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', flexWrap: 'wrap' }}>
                    <button className="fr-btn fr-btn-secondary" onClick={startProfileEdit}>
                      <Edit3 size={15} /> Edit Profile
                    </button>
                    <button className="fr-btn fr-btn-primary" onClick={() => setActiveNav('available-food')}>
                      Browse Food for Beneficiaries
                    </button>
                  </div>
                </>
              ) : (
                <form className="fr-rec-profile-edit-form" onSubmit={saveProfile}>
                  <div className="fr-rec-profile-form-grid">
                    <div className="fr-form-group">
                      <label>Organization Name</label>
                      <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required />
                    </div>
                    <div className="fr-form-group">
                      <label>Registration Number</label>
                      <input value={profileForm.regNumber} onChange={(e) => setProfileForm({ ...profileForm, regNumber: e.target.value })} required />
                    </div>
                    <div className="fr-form-group">
                      <label>Contact Director</label>
                      <input value={profileForm.contactPerson} onChange={(e) => setProfileForm({ ...profileForm, contactPerson: e.target.value })} required />
                    </div>
                    <div className="fr-form-group">
                      <label>Direct Phone / Hotline</label>
                      <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} required />
                    </div>
                    <div className="fr-form-group fr-rec-profile-full-field">
                      <label>Registered Address</label>
                      <input value={profileForm.address} onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })} required />
                    </div>
                    <div className="fr-form-group">
                      <label>Resident Beneficiaries</label>
                      <input type="number" min="0" value={profileForm.beneficiaryCount} onChange={(e) => setProfileForm({ ...profileForm, beneficiaryCount: e.target.value })} required />
                    </div>
                    <div className="fr-form-group">
                      <label>Designated Logistics Driver</label>
                      <input value={profileForm.assignedDriver} onChange={(e) => setProfileForm({ ...profileForm, assignedDriver: e.target.value })} />
                    </div>
                    <div className="fr-form-group fr-rec-profile-full-field">
                      <label>Registered Vehicle</label>
                      <input value={profileForm.vehicleDetails} onChange={(e) => setProfileForm({ ...profileForm, vehicleDetails: e.target.value })} />
                    </div>
                  </div>

                  <div className="fr-rec-profile-form-actions">
                    <button type="button" className="fr-btn fr-btn-secondary" onClick={cancelProfileEdit}>
                      <X size={15} /> Cancel
                    </button>
                    <button type="submit" className="fr-btn fr-btn-primary">
                      <Save size={15} /> Save Profile
                    </button>
                  </div>
                </form>
              )}

              <div className="fr-rec-profile-danger-zone">
                <div className="fr-account-danger-icon"><AlertTriangle size={22} /></div>
                <div className="fr-rec-profile-danger-copy">
                  <h3>Deactivate organization account</h3>
                  <p>Your welfare profile, active requests and access to available surplus food will be disabled.</p>
                </div>

                {!showDeactivateConfirm ? (
                  <button
                    type="button"
                    className="fr-account-deactivate-btn"
                    onClick={() => setShowDeactivateConfirm(true)}
                  >
                    <UserX size={16} /> Deactivate Account
                  </button>
                ) : (
                  <div className="fr-account-confirm-box">
                    <strong>Are you sure you want to deactivate this organization account?</strong>
                    <div>
                      <button type="button" className="fr-btn fr-btn-secondary" onClick={() => setShowDeactivateConfirm(false)}>
                        Cancel
                      </button>
                      <button type="button" className="fr-account-deactivate-btn" onClick={handleSignOut}>
                        Yes, Deactivate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return <RecipientDashboardPage onNavigate={setActiveNav} activeRequests={requests} pickupSchedule={pickups} foodListings={foodListings} />;
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
            {recipientProfile.avatar}
          </div>
          {sidebarOpen && (
            <div className="fr-sidebar-profile-info">
              <div className="fr-sidebar-name">{recipientProfile.name}</div>
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
