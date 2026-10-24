import React, { useState } from 'react';
import {
  Truck, CalendarClock, MapPin, Phone, CheckCircle2,
  Clock, ShieldCheck, UserCheck, Star, AlertCircle,
  FileCheck, Edit3, ArrowRight, ThumbsUp
} from 'lucide-react';
import { StatusBadge } from '../../components/donor/DonorShared';
import '../../styles/recipient-dashboard.css';

export default function RecipientPickupPage({
  pickups = [],
  onUpdatePickup,
  onNavigate
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  // Modals
  const [editingDriverPickup, setEditingDriverPickup] = useState(null);
  const [ratingModalPickup, setRatingModalPickup] = useState(null);

  // Driver Edit Form
  const [driverName, setDriverName] = useState('Mr. Kumaran Selvan');
  const [driverPhone, setDriverPhone] = useState('+94 77 111 2233');
  const [vehicleNo, setVehicleNo] = useState('Van WP ND-4521');
  const [etaTime, setEtaTime] = useState('Today, 7:30 PM');

  // Rating Modal Form
  const [stars, setStars] = useState(5);
  const [freshness, setFreshness] = useState('Hot & Fresh (Complies with safety standard)');
  const [packagingCheck, setPackagingCheck] = useState(true);
  const [feedbackText, setFeedbackText] = useState('Food was hot, delicious, and hygienically packed. Fed all resident children tonight!');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const filteredPickups = pickups.filter(p => {
    if (filter === 'active') return p.status !== 'Completed';
    if (filter === 'completed') return p.status === 'Completed';
    return true;
  });

  const handleOpenEditDriver = (p) => {
    setEditingDriverPickup(p);
    setDriverName(p.driverName || 'Mr. Kumaran Selvan');
    setDriverPhone(p.driverPhone || '+94 77 111 2233');
    setVehicleNo(p.vehicleNumber || 'Van WP ND-4521');
    setEtaTime(p.scheduledTime || 'Today, 7:30 PM');
  };

  const handleSaveDriver = (e) => {
    e.preventDefault();
    if (!editingDriverPickup) return;
    if (onUpdatePickup) {
      onUpdatePickup(editingDriverPickup.id, {
        driverName,
        driverPhone,
        vehicleNumber: vehicleNo,
        scheduledTime: etaTime,
        status: 'Pickup Scheduled',
      });
    }
    setEditingDriverPickup(null);
  };

  const handleMarkCollected = (pickupId) => {
    if (window.confirm('Confirm that driver has collected the food containers from donor establishment?')) {
      if (onUpdatePickup) {
        onUpdatePickup(pickupId, { status: 'Collected' });
      }
    }
  };

  const handleOpenRateHandover = (p) => {
    setRatingModalPickup(p);
    setRatingSubmitted(false);
  };

  const handleSubmitRating = (e) => {
    e.preventDefault();
    if (!ratingModalPickup) return;
    setRatingSubmitted(true);
    setTimeout(() => {
      if (onUpdatePickup) {
        onUpdatePickup(ratingModalPickup.id, {
          status: 'Completed',
          ratingGiven: stars,
          feedbackGiven: feedbackText,
          completedAt: 'Just now',
        });
      }
      setRatingModalPickup(null);
      setRatingSubmitted(false);
    }, 600);
  };

  return (
    <div className="fr-recipient-view">

      {/* Page Header */}
      <div className="fr-page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h1 className="fr-page-title">Pickup & Logistics Management</h1>
          <p className="fr-page-sub">
            Coordinate food collection schedules, assign drivers, verify temperature compliance, and confirm final handover
          </p>
        </div>
        <button
          className="fr-btn fr-btn-secondary"
          onClick={() => onNavigate('available-food')}
        >
          Discover Available Surplus
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <button
          className={`fr-rec-chip ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Logistics ({pickups.length})
        </button>
        <button
          className={`fr-rec-chip ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active Logistics ({pickups.filter(p => p.status !== 'Completed').length})
        </button>
        <button
          className={`fr-rec-chip ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed &amp; Rated ({pickups.filter(p => p.status === 'Completed').length})
        </button>
      </div>

      {/* Pickups List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredPickups.length === 0 ? (
          <div className="fr-section-card" style={{ padding: '60px', textAlign: 'center' }}>
            <Truck size={42} color="var(--fr-primary)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: 'var(--fr-text-heading)', fontSize: '1.2rem', marginBottom: '8px' }}>
              No pickup appointments in this view
            </h3>
            <p style={{ color: 'var(--fr-text-muted)', fontSize: '0.88rem' }}>
              When your portion requests are approved by donors, they will be scheduled for collection here.
            </p>
            <button
              className="fr-btn fr-btn-primary"
              style={{ marginTop: '16px' }}
              onClick={() => onNavigate('available-food')}
            >
              Browse Surplus Food
            </button>
          </div>
        ) : (
          filteredPickups.map(p => {
            const isCompleted = p.status === 'Completed';
            const isCollected = p.status === 'Collected';
            const isScheduled = p.status === 'Pickup Scheduled';

            return (
              <div 
                key={p.id} 
                className={`fr-rec-pickup-card ${!isCompleted ? 'active-pickup' : ''}`}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--fr-text-heading)' }}>
                        {p.mealTitle}
                      </h2>
                      <span className={`fr-pickup-status-step ${isCompleted ? 'completed' : isCollected ? 'collected' : 'scheduled'}`}>
                        {isCompleted ? '✓ Handover Completed' : isCollected ? '🚚 Food In Transit' : '🕒 Pickup Scheduled'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.84rem', color: 'var(--fr-text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--fr-text-heading)' }}>{p.donorName}</span>
                      <span>• <MapPin size={13} style={{ display: 'inline', color: 'var(--fr-primary)' }} /> {p.donorAddress} ({p.distance})</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)', fontWeight: 700 }}>COLLECTION WINDOW</div>
                    <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--fr-primary)' }}>
                      {p.scheduledTime}
                    </div>
                  </div>
                </div>

                {/* 3-Column Logistics Info Grid */}
                <div className="fr-pickup-meta-columns">
                  {/* Col 1: Driver & Transport */}
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--fr-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      ASSIGNED LOGISTICS DRIVER
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--fr-text-heading)' }}>
                      {p.driverName || 'No driver assigned'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--fr-text-muted)' }}>
                      {p.vehicleNumber}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--fr-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Phone size={12} /> {p.driverPhone}
                    </div>
                  </div>

                  {/* Col 2: Quantity & Food Safety */}
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--fr-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      PORTIONS & TEMPERATURE
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--fr-text-heading)' }}>
                      {p.portions}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--fr-text-muted)' }}>
                      Safe Expiry: {p.safeExpiry}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--fr-primary)', marginTop: '4px' }}>
                      Temp: {p.temperatureCheck || 'Above 65°C Verified'}
                    </div>
                  </div>

                  {/* Col 3: Donor Contact & Instructions */}
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--fr-text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      DONOR CONTACT DESK
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--fr-text-heading)' }}>
                      {p.donorContact}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--fr-primary)', marginTop: '2px' }}>
                      {p.donorPhone}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)', marginTop: '4px' }}>
                      Instructions: {p.storageInstructions}
                    </div>
                  </div>
                </div>

                {/* Handover Rating Preview (if completed) */}
                {isCompleted && p.feedbackGiven && (
                  <div style={{ 
                    padding: '12px 16px', 
                    background: 'rgba(25, 195, 125, 0.08)', 
                    border: '1px solid rgba(25, 195, 125, 0.25)', 
                    borderRadius: 'var(--fr-radius-md)',
                    marginBottom: '14px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ color: '#f59e0b', fontSize: '0.95rem' }}>
                        {'★'.repeat(p.ratingGiven || 5)}
                      </span>
                      <strong style={{ fontSize: '0.84rem', color: 'var(--fr-text-heading)' }}>
                        Feedback Given to Donor
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--fr-text-body)', fontStyle: 'italic' }}>
                      "{p.feedbackGiven}"
                    </p>
                  </div>
                )}

                {/* Action Buttons Toolbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={`tel:${p.donorPhone}`}
                      className="fr-btn fr-btn-secondary fr-btn-sm"
                    >
                      <Phone size={13} /> Call Donor
                    </a>
                    <a
                      href={`tel:${p.driverPhone}`}
                      className="fr-btn fr-btn-secondary fr-btn-sm"
                    >
                      <Phone size={13} /> Call Driver
                    </a>
                    {!isCompleted && (
                      <button
                        className="fr-btn fr-btn-secondary fr-btn-sm"
                        onClick={() => handleOpenEditDriver(p)}
                      >
                        <Edit3 size={13} /> Change Driver / Vehicle
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    {isScheduled && (
                      <button
                        className="fr-btn fr-btn-primary fr-btn-sm"
                        onClick={() => handleMarkCollected(p.id)}
                      >
                        <Truck size={14} /> Mark as Collected by Driver
                      </button>
                    )}

                    {isCollected && (
                      <button
                        className="fr-btn fr-btn-accent fr-btn-sm"
                        onClick={() => handleOpenRateHandover(p)}
                      >
                        <CheckCircle2 size={15} /> Confirm Safe Receipt &amp; Rate Donor
                      </button>
                    )}

                    {isCompleted && (
                      <span style={{ fontSize: '0.84rem', color: 'var(--fr-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ShieldCheck size={16} /> Handover Completed &amp; Documented
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Assign / Edit Driver & Logistics Modal ── */}
      {editingDriverPickup && (
        <div className="fr-modal-layer" onClick={() => setEditingDriverPickup(null)}>
          <div className="fr-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="fr-dialog-header">
              <h2 className="fr-dialog-title">Assign Logistics &amp; Driver</h2>
              <button className="fr-dialog-close" onClick={() => setEditingDriverPickup(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDriver} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--fr-text-muted)' }}>
                Food Item: <strong>{editingDriverPickup.mealTitle}</strong> ({editingDriverPickup.portions}) from {editingDriverPickup.donorName}
              </div>

              <div className="fr-form-group">
                <label>Driver / Volunteer Full Name:</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  required
                />
              </div>

              <div className="fr-form-group">
                <label>Driver Mobile Number:</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  required
                />
              </div>

              <div className="fr-form-group">
                <label>Vehicle Model &amp; Registration Number:</label>
                <input
                  type="text"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  placeholder="e.g. Van WP ND-4521"
                  required
                />
              </div>

              <div className="fr-form-group">
                <label>Expected Collection Time:</label>
                <input
                  type="text"
                  value={etaTime}
                  onChange={(e) => setEtaTime(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="fr-btn fr-btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setEditingDriverPickup(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="fr-btn fr-btn-primary"
                  style={{ flex: 1.5 }}
                >
                  Confirm &amp; Notify Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Rate Donor & Confirm Final Handover Modal (Proposal Section 3.2 #7 & 3.4) ── */}
      {ratingModalPickup && (
        <div className="fr-modal-layer" onClick={() => setRatingModalPickup(null)}>
          <div className="fr-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="fr-dialog-header">
              <div>
                <h2 className="fr-dialog-title">Confirm Handover &amp; Rate Donor</h2>
                <span style={{ fontSize: '0.78rem', color: 'var(--fr-text-muted)' }}>
                  Handover for {ratingModalPickup.mealTitle} from {ratingModalPickup.donorName}
                </span>
              </div>
              <button className="fr-dialog-close" onClick={() => setRatingModalPickup(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRating} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Star Rating */}
              <div className="fr-form-group" style={{ alignItems: 'center', textAlign: 'center' }}>
                <label>Overall Donor Experience &amp; Food Quality:</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      className={`fr-rating-star-btn ${s <= stars ? 'gold' : ''}`}
                      onClick={() => setStars(s)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--fr-primary)', marginTop: '4px' }}>
                  {stars === 5 ? '5.0 - Exceptional Quality & Coordination' : `${stars}.0 Stars`}
                </span>
              </div>

              {/* Freshness Assessment */}
              <div className="fr-form-group">
                <label>Food Freshness &amp; Temperature Inspection:</label>
                <select
                  value={freshness}
                  onChange={(e) => setFreshness(e.target.value)}
                >
                  <option value="Hot & Fresh (Complies with safety standard)">Hot &amp; Fresh (Maintained &gt;65°C)</option>
                  <option value="Chilled & Fresh (Clean produce)">Chilled &amp; Fresh (Produce / Cold Storage)</option>
                  <option value="Ambient & Dry (Bakery goods sealed)">Ambient &amp; Dry (Bakery goods clean &amp; sealed)</option>
                </select>
              </div>

              {/* Hygiene check */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  id="hygieneCheck"
                  checked={packagingCheck}
                  onChange={(e) => setPackagingCheck(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--fr-primary)' }}
                />
                <label htmlFor="hygieneCheck" style={{ fontSize: '0.84rem', color: 'var(--fr-text-heading)', cursor: 'pointer' }}>
                  I confirm food containers were clean, sealed, and verified safe for resident consumption.
                </label>
              </div>

              {/* Review / Comments */}
              <div className="fr-form-group">
                <label>Feedback &amp; Words of Appreciation to Donor:</label>
                <textarea
                  rows="3"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share a short note on how the meals helped your beneficiaries..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  className="fr-btn fr-btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setRatingModalPickup(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="fr-btn fr-btn-primary"
                  style={{ flex: 1.5 }}
                  disabled={ratingSubmitted || !packagingCheck}
                >
                  {ratingSubmitted ? 'Logging Verification...' : 'Submit & Complete Handover'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
