import React, { useState } from 'react';
import {
  User, Building2, ShieldCheck, Mail, Phone, MapPin,
  Award, CheckCircle2, Clock, Edit3, Save, X, Utensils,
  Thermometer, Bell, Sparkles, FileText, Navigation, ExternalLink
} from 'lucide-react';

export default function DonorProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Profile data
  const [profile, setProfile] = useState({
    businessName: 'Green Leaf Hotel & Banquets',
    contactPerson: 'Mr. Rohan Fernando',
    designation: 'Operations & Food Rescue Manager',
    email: 'donor@greenleafhotel.lk',
    phone: '+94 77 123 4567',
    secondaryPhone: '+94 24 222 1890',
    address: 'No. 42, A9 Highway, Vavuniya Town',
    district: 'Vavuniya',
    province: 'Northern Province',
    businessRegNo: 'PV-98241 / LK-HOTEL-2021',
    phiLicense: 'PHI-VAV-2024-089 (Grade A Premium)',
    kitchenType: 'Commercial Banquet & Hotel Kitchen',
    capacity: '500+ covers per day',
    pickupGate: 'Gate 2 - Kitchen Service Bay & Loading Ramp',
    lunchSlot: '02:00 PM - 04:00 PM',
    dinnerSlot: '09:30 PM - 11:30 PM',
    storageFacilities: 'Commercial hot holding warmers (>65°C), Cold room (0-4°C), Insulated carriers',
    bio: 'Premier hospitality provider in Vavuniya committed to zero food waste. Partnered with Food Rescue since March 2024 to redistribute banquet surplus cleanly and promptly to vetted welfare homes.',
    smsNotifications: true,
    callNotifications: true,
    emailReceipts: true
  });

  const [formData, setFormData] = useState({ ...profile });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile({ ...formData });
    setIsEditing(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
  };

  return (
    <div className="fr-dash-view">
      {/* Toast Alert */}
      {saveToast && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 22px',
          borderRadius: '14px',
          background: 'rgba(25, 195, 125, 0.16)',
          border: '1px solid var(--fr-primary)',
          color: 'var(--fr-primary)',
          fontWeight: '700',
          fontSize: '0.92rem',
          boxShadow: '0 8px 24px rgba(25, 195, 125, 0.2)'
        }}>
          <CheckCircle2 size={22} />
          <span>Donor profile details have been successfully updated and saved!</span>
        </div>
      )}

      {/* Profile Header Hero Card */}
      <div className="fr-welcome-card" style={{ padding: '32px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '22px',
            background: 'linear-gradient(135deg, #19C37D, #0f7a4e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '900',
            fontSize: '2.1rem',
            color: '#fff',
            boxShadow: '0 8px 26px rgba(25,195,125,0.45)',
            border: '2px solid rgba(255,255,255,0.25)',
            flexShrink: 0
          }}>
            GL
          </div>

          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '8px' }}>
              <span className="fr-profile-badge-pill fr-badge-success">
                <ShieldCheck size={14} /> Verified Food Donor
              </span>
              <span className="fr-profile-badge-pill fr-badge-amber">
                <Award size={14} /> PHI Grade A Premium (4.9 ★)
              </span>
            </div>

            <h1 className="fr-welcome-title" style={{ fontSize: '1.85rem', marginBottom: '6px' }}>
              {profile.businessName}
            </h1>
            <p className="fr-welcome-sub" style={{ margin: 0, maxWidth: '100%', color: '#a5d6be', fontSize: '0.92rem' }}>
              Donor Representative: <strong style={{ color: '#fff' }}>{profile.contactPerson}</strong> ({profile.designation}) • {profile.district}, {profile.province}
            </p>
          </div>
        </div>

        <div className="fr-welcome-actions">
          {!isEditing ? (
            <button
              type="button"
              className="fr-btn fr-btn-primary"
              onClick={() => {
                setFormData({ ...profile });
                setIsEditing(true);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
            >
              <Edit3 size={16} /> Edit Profile Details
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="fr-btn fr-btn-secondary"
                onClick={handleCancel}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px' }}
              >
                <X size={16} /> Cancel
              </button>
              <button
                type="button"
                className="fr-btn fr-btn-primary"
                onClick={handleSave}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px' }}
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="fr-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="fr-stat-card fr-stat-emerald">
          <div className="fr-stat-top">
            <span className="fr-stat-label">Meals Rescued</span>
            <div className="fr-stat-icon-wrap"><Utensils size={18} /></div>
          </div>
          <div className="fr-stat-value">1,285+</div>
          <div className="fr-stat-sub">Portions safely shared</div>
        </div>

        <div className="fr-stat-card fr-stat-lime">
          <div className="fr-stat-top">
            <span className="fr-stat-label">Surplus Saved</span>
            <div className="fr-stat-icon-wrap"><Award size={18} /></div>
          </div>
          <div className="fr-stat-value">578 kg</div>
          <div className="fr-stat-sub">High-quality cooked food</div>
        </div>

        <div className="fr-stat-card fr-stat-sky">
          <div className="fr-stat-top">
            <span className="fr-stat-label">CO₂e Prevented</span>
            <div className="fr-stat-icon-wrap"><Sparkles size={18} /></div>
          </div>
          <div className="fr-stat-value">1,214 kg</div>
          <div className="fr-stat-sub">Landfill emissions diverted</div>
        </div>

        <div className="fr-stat-card fr-stat-green">
          <div className="fr-stat-top">
            <span className="fr-stat-label">Handover Rate</span>
            <div className="fr-stat-icon-wrap"><CheckCircle2 size={18} /></div>
          </div>
          <div className="fr-stat-value">100%</div>
          <div className="fr-stat-sub">43 verified pickups</div>
        </div>
      </div>

      {/* Main Donor Profile Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '24px' }}>
        
        {/* Left Side: Donor Identity, Contact & Legal Information */}
        <div className="fr-section-card">
          <div className="fr-section-header">
            <div>
              <div className="fr-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} color="var(--fr-primary)" />
                Donor Contact & Identification Details
              </div>
              <div className="fr-section-sub">Official profile information registered for food redistribution</div>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            {!isEditing ? (
              <div className="fr-profile-grid">
                
                {/* Donor Business Name */}
                <div className="fr-profile-field-card">
                  <div className="fr-profile-field-icon">
                    <Building2 size={20} />
                  </div>
                  <div className="fr-profile-field-content">
                    <span className="fr-profile-field-label">Donor Business Name</span>
                    <span className="fr-profile-field-value">{profile.businessName}</span>
                  </div>
                </div>

                {/* Contact Person */}
                <div className="fr-profile-field-card">
                  <div className="fr-profile-field-icon">
                    <User size={20} />
                  </div>
                  <div className="fr-profile-field-content">
                    <span className="fr-profile-field-label">Registered Contact Person</span>
                    <span className="fr-profile-field-value">{profile.contactPerson}</span>
                  </div>
                </div>

                {/* Designation */}
                <div className="fr-profile-field-card">
                  <div className="fr-profile-field-icon">
                    <Award size={20} />
                  </div>
                  <div className="fr-profile-field-content">
                    <span className="fr-profile-field-label">Designation / Role</span>
                    <span className="fr-profile-field-value">{profile.designation}</span>
                  </div>
                </div>

                {/* Email Address */}
                <div className="fr-profile-field-card">
                  <div className="fr-profile-field-icon">
                    <Mail size={20} />
                  </div>
                  <div className="fr-profile-field-content">
                    <span className="fr-profile-field-label">Official Email</span>
                    <span className="fr-profile-field-value" style={{ color: 'var(--fr-primary)' }}>
                      {profile.email}
                    </span>
                  </div>
                </div>

                {/* Primary Hotline */}
                <div className="fr-profile-field-card">
                  <div className="fr-profile-field-icon" style={{ background: 'rgba(25, 195, 125, 0.2)' }}>
                    <Phone size={20} />
                  </div>
                  <div className="fr-profile-field-content">
                    <span className="fr-profile-field-label">Primary Hotline (IVR / Calls)</span>
                    <span className="fr-profile-field-value" style={{ color: 'var(--fr-primary)', fontWeight: '700' }}>
                      {profile.phone}
                    </span>
                  </div>
                </div>

                {/* Secondary Contact */}
                <div className="fr-profile-field-card">
                  <div className="fr-profile-field-icon">
                    <Phone size={20} />
                  </div>
                  <div className="fr-profile-field-content">
                    <span className="fr-profile-field-label">Secondary Contact</span>
                    <span className="fr-profile-field-value">{profile.secondaryPhone}</span>
                  </div>
                </div>

                {/* Physical Address (Full Width) */}
                <div className="fr-profile-field-card fr-profile-full-card">
                  <div className="fr-profile-field-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="fr-profile-field-content">
                    <span className="fr-profile-field-label">Physical Address & Location</span>
                    <span className="fr-profile-field-value">
                      {profile.address}, {profile.district}, {profile.province}
                    </span>
                  </div>
                </div>

                {/* Business Registration */}
                <div className="fr-profile-field-card">
                  <div className="fr-profile-field-icon">
                    <FileText size={20} />
                  </div>
                  <div className="fr-profile-field-content">
                    <span className="fr-profile-field-label">Business Registration #</span>
                    <span className="fr-profile-field-value">{profile.businessRegNo}</span>
                  </div>
                </div>

                {/* Food Hygiene License */}
                <div className="fr-profile-field-card">
                  <div className="fr-profile-field-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div className="fr-profile-field-content">
                    <span className="fr-profile-field-label">Food Hygiene License</span>
                    <span className="fr-profile-field-value" style={{ color: '#f59e0b', fontWeight: '700' }}>
                      {profile.phiLicense}
                    </span>
                  </div>
                </div>

                {/* Donor Statement / Policy (Full Width) */}
                <div className="fr-profile-field-card fr-profile-full-card" style={{ background: 'rgba(25, 195, 125, 0.05)', borderColor: 'rgba(25, 195, 125, 0.2)' }}>
                  <div className="fr-profile-field-icon">
                    <Sparkles size={20} />
                  </div>
                  <div className="fr-profile-field-content">
                    <span className="fr-profile-field-label">Donor Surplus Mission & Policy</span>
                    <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--fr-text-body)', lineHeight: 1.6 }}>
                      {profile.bio}
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              /* Edit Profile Form */
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="fr-form-group">
                    <label>Business / Donor Name</label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => handleChange('businessName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="fr-form-group">
                    <label>Contact Person</label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => handleChange('contactPerson', e.target.value)}
                      required
                    />
                  </div>

                  <div className="fr-form-group">
                    <label>Designation / Role</label>
                    <input
                      type="text"
                      value={formData.designation}
                      onChange={(e) => handleChange('designation', e.target.value)}
                      required
                    />
                  </div>

                  <div className="fr-form-group">
                    <label>Official Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                    />
                  </div>

                  <div className="fr-form-group">
                    <label>Primary Hotline (Calls & IVR)</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      required
                    />
                  </div>

                  <div className="fr-form-group">
                    <label>Secondary Phone</label>
                    <input
                      type="text"
                      value={formData.secondaryPhone}
                      onChange={(e) => handleChange('secondaryPhone', e.target.value)}
                    />
                  </div>
                </div>

                <div className="fr-form-group">
                  <label>Physical Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="fr-form-group">
                    <label>District</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => handleChange('district', e.target.value)}
                      required
                    />
                  </div>

                  <div className="fr-form-group">
                    <label>Province</label>
                    <input
                      type="text"
                      value={formData.province}
                      onChange={(e) => handleChange('province', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="fr-form-group">
                  <label>Donor Statement & Surplus Mission</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                  <button type="button" className="fr-btn fr-btn-secondary" onClick={handleCancel}>
                    Cancel
                  </button>
                  <button type="submit" className="fr-btn fr-btn-primary">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Kitchen Protocols & Alert Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Kitchen & Dispatch Protocols */}
          <div className="fr-section-card">
            <div className="fr-section-header">
              <div>
                <div className="fr-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={18} color="var(--fr-primary)" />
                  Kitchen & Surplus Pickup Logistics
                </div>
                <div className="fr-section-sub">Pickup protocols for registered recipient organizations</div>
              </div>
            </div>

            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Pickup Point */}
              <div className="fr-profile-field-card">
                <div className="fr-profile-field-icon">
                  <Navigation size={20} />
                </div>
                <div className="fr-profile-field-content">
                  <span className="fr-profile-field-label">Designated Handover Point</span>
                  <span className="fr-profile-field-value">{profile.pickupGate}</span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)', marginTop: '2px' }}>
                    Dedicated vehicle bay with ramp access for shelters & vans
                  </span>
                </div>
              </div>

              {/* Release Windows */}
              <div className="fr-profile-field-card">
                <div className="fr-profile-field-icon">
                  <Clock size={20} />
                </div>
                <div className="fr-profile-field-content">
                  <span className="fr-profile-field-label">Standard Surplus Release Slots</span>
                  <span className="fr-profile-field-value" style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                    <span>Lunch Slot: <strong style={{ color: 'var(--fr-primary)' }}>{profile.lunchSlot}</strong></span>
                    <span>Dinner Slot: <strong style={{ color: 'var(--fr-primary)' }}>{profile.dinnerSlot}</strong></span>
                  </span>
                </div>
              </div>

              {/* Storage Compliance */}
              <div className="fr-profile-field-card">
                <div className="fr-profile-field-icon">
                  <Thermometer size={20} />
                </div>
                <div className="fr-profile-field-content">
                  <span className="fr-profile-field-label">Temperature & Holding Standard</span>
                  <span className="fr-profile-field-value" style={{ fontSize: '0.86rem' }}>
                    {profile.storageFacilities}
                  </span>
                  <span style={{ fontSize: '0.76rem', color: 'var(--fr-primary)', fontWeight: '700', marginTop: '3px' }}>
                    ✓ 100% PHI Sanitary Compliance Certified
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Alert & Automated Dispatch Settings */}
          <div className="fr-section-card">
            <div className="fr-section-header">
              <div>
                <div className="fr-section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={18} color="var(--fr-primary)" />
                  Automated Alert & Notification Preferences
                </div>
                <div className="fr-section-sub">Real-time alerts for incoming requests and pickups</div>
              </div>
            </div>

            <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '10px 0' }}>
                <div style={{ paddingRight: '12px' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--fr-text-heading)' }}>
                    Automated Phone Dispatch (IVR)
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)', marginTop: '2px' }}>
                    Auto-ring shelter coordinators when large meal surplus is posted
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={profile.callNotifications}
                  onChange={(e) => setProfile(p => ({ ...p, callNotifications: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--fr-primary)', cursor: 'pointer', flexShrink: 0 }}
                />
              </label>

              <div style={{ height: '1px', background: 'var(--fr-border-card)' }} />

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '10px 0' }}>
                <div style={{ paddingRight: '12px' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--fr-text-heading)' }}>
                    SMS Pickup & Driver Arrival Alerts
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)', marginTop: '2px' }}>
                    Receive instantaneous SMS when recipient vehicle arrives at gate
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={profile.smsNotifications}
                  onChange={(e) => setProfile(p => ({ ...p, smsNotifications: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--fr-primary)', cursor: 'pointer', flexShrink: 0 }}
                />
              </label>

              <div style={{ height: '1px', background: 'var(--fr-border-card)' }} />

              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '10px 0' }}>
                <div style={{ paddingRight: '12px' }}>
                  <div style={{ fontWeight: '600', fontSize: '0.88rem', color: 'var(--fr-text-heading)' }}>
                    Digital Handover Receipts
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)', marginTop: '2px' }}>
                    Email verified handover confirmation for CSR and sustainability logs
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={profile.emailReceipts}
                  onChange={(e) => setProfile(p => ({ ...p, emailReceipts: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--fr-primary)', cursor: 'pointer', flexShrink: 0 }}
                />
              </label>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
