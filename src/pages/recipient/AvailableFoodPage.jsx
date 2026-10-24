import React, { useState, useMemo } from 'react';
import {
  Search, Filter, MapPin, Clock, ShieldCheck,
  AlertTriangle, CheckCircle2, ChevronRight,
  Info, Sparkles, Building2, Eye, Send, ArrowRight
} from 'lucide-react';
import { StatusBadge } from '../../components/donor/DonorShared';
import '../../styles/recipient-dashboard.css';

const CATEGORIES = [
  'All Categories',
  'Prepared meals',
  'Rice & Curry',
  'Bakery items',
  'Fruits',
  'Vegetables',
  'Bread & Roti',
];

const DISTANCES = [
  { label: 'All Distances', maxKm: 999 },
  { label: 'Within 2 km', maxKm: 2 },
  { label: 'Within 5 km', maxKm: 5 },
  { label: 'Within 15 km', maxKm: 15 },
];

export default function AvailableFoodPage({
  foodListings = [],
  onRequestMeal,
  onNavigate
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDistance, setSelectedDistance] = useState(999);
  const [statusFilter, setStatusFilter] = useState('Available'); // 'All' | 'Available'

  // Modal states
  const [detailsModalMeal, setDetailsModalMeal] = useState(null);
  const [requestModalMeal, setRequestModalMeal] = useState(null);

  // Form states for requesting food
  const [requestPortions, setRequestPortions] = useState(30);
  const [requestPurpose, setRequestPurpose] = useState('Dinner for resident children at Poonthottam shelter');
  const [contactName, setContactName] = useState('Mrs. Shanthi Sivakumar');
  const [contactPhone, setContactPhone] = useState('+94 77 987 6543');
  const [pickupWindow, setPickupWindow] = useState('Within 45 minutes');
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(null);

  // Parse distance from string e.g. "Vavuniya Town (1.2 km away)" -> 1.2
  const extractKm = (locStr = '') => {
    const match = locStr.match(/([\d.]+)\s*km/i);
    return match ? parseFloat(match[1]) : 1.0;
  };

  const filteredListings = useMemo(() => {
    return foodListings.filter(item => {
      // Search
      const textMatch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category
      const catMatch =
        selectedCategory === 'All Categories' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      // Distance
      const km = extractKm(item.location);
      const distMatch = km <= selectedDistance;

      // Status
      const statMatch = statusFilter === 'All' || item.status === 'Available';

      return textMatch && catMatch && distMatch && statMatch;
    });
  }, [foodListings, searchQuery, selectedCategory, selectedDistance, statusFilter]);

  const handleOpenRequest = (meal) => {
    setRequestModalMeal(meal);
    // default portion request
    const maxPortion = parseInt(meal.portions) || 40;
    setRequestPortions(Math.min(maxPortion, 30));
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!requestModalMeal) return;
    setSubmitting(true);

    setTimeout(() => {
      if (onRequestMeal) {
        onRequestMeal({
          mealId: requestModalMeal.id,
          mealTitle: requestModalMeal.title,
          image: requestModalMeal.image,
          donorName: requestModalMeal.donorName,
          donorLocation: requestModalMeal.location,
          portionsRequested: Number(requestPortions),
          totalAvailable: requestModalMeal.portions,
          safeUntil: requestModalMeal.availableUntil,
          storageMethod: requestModalMeal.storage,
          purpose: requestPurpose,
          contactPerson: `${contactName} (${contactPhone})`,
          pickupWindow: pickupWindow,
        });
      }
      setSubmitting(false);
      setSuccessToast(`Request sent for ${requestPortions} portions of ${requestModalMeal.title}! Donor has been notified via IVR.`);
      setRequestModalMeal(null);

      setTimeout(() => {
        setSuccessToast(null);
      }, 5000);
    }, 600);
  };

  return (
    <div className="fr-recipient-view">
      {/* Top Banner */}
      <div className="fr-rec-banner">
        <div className="fr-rec-banner-info">
          <span className="fr-rec-verified-pill">
            <ShieldCheck size={13} /> Verified Recipient Portal • Vavuniya
          </span>
          <h1 className="fr-rec-banner-title">Browse Available Surplus Food</h1>
          <p className="fr-rec-banner-sub">
            Hotels, restaurants, and catering banquets report fresh edible surplus with safe consumption windows. Claim portions for your welfare center instantly.
          </p>
        </div>
        <div>
          <button
            className="fr-btn fr-btn-primary"
            onClick={() => onNavigate && onNavigate('requests')}
          >
            My Active Requests <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {successToast && (
        <div 
          className="fr-rec-req-note" 
          style={{ 
            marginBottom: '20px', 
            background: 'rgba(25, 195, 125, 0.2)', 
            borderColor: 'var(--fr-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={18} color="var(--fr-primary)" />
            <strong style={{ color: 'var(--fr-text-heading)' }}>{successToast}</strong>
          </div>
          <button 
            className="fr-btn fr-btn-secondary fr-btn-sm"
            onClick={() => onNavigate && onNavigate('requests')}
          >
            Track in Requests
          </button>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="fr-filter-bar-container">
        <div className="fr-search-row">
          <div className="fr-search-input-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by food name, hotel / banquet, ingredients, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              className="fr-rec-chip"
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(Number(e.target.value))}
              style={{ padding: '8px 14px', cursor: 'pointer' }}
            >
              {DISTANCES.map(d => (
                <option key={d.maxKm} value={d.maxKm}>{d.label}</option>
              ))}
            </select>

            <button
              className={`fr-rec-chip ${statusFilter === 'Available' ? 'active' : ''}`}
              onClick={() => setStatusFilter(prev => prev === 'Available' ? 'All' : 'Available')}
            >
              {statusFilter === 'Available' ? '✓ Showing Available Only' : 'Showing All'}
            </button>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="fr-filter-chips-scroll">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`fr-rec-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Food Listings */}
      <div className="fr-available-grid">
        {filteredListings.length === 0 ? (
          <div 
            className="fr-section-card" 
            style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px' }}
          >
            <Info size={40} color="var(--fr-primary)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ color: 'var(--fr-text-heading)', fontSize: '1.2rem', marginBottom: '8px' }}>
              No surplus food matching your criteria
            </h3>
            <p style={{ color: 'var(--fr-text-muted)', fontSize: '0.88rem' }}>
              Try clearing filters or search terms. Donors publish new meals regularly throughout the day.
            </p>
            <button 
              className="fr-btn fr-btn-secondary fr-btn-sm" 
              style={{ marginTop: '16px' }}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Categories');
                setSelectedDistance(999);
                setStatusFilter('Available');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredListings.map(meal => {
            const isAvailable = meal.status === 'Available';
            return (
              <div key={meal.id} className="fr-food-card">
                {/* Image & Badges */}
                <div className="fr-food-card-img-wrap">
                  <img src={meal.image} alt={meal.title} className="fr-food-card-img" />
                  <span className="fr-food-category-pill">{meal.category}</span>
                  <span className="fr-food-expiry-pill">
                    <Clock size={11} /> {meal.availableUntil.split('(')[1]?.replace(')', '') || '2h left'}
                  </span>
                </div>

                {/* Card Content */}
                <div className="fr-food-card-body">
                  {/* Donor Info Header */}
                  <div className="fr-food-card-donor">
                    <div className="fr-donor-avatar-small">
                      {meal.donorName.charAt(0)}
                    </div>
                    <div>
                      <div className="fr-food-donor-title" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {meal.donorName}
                        <ShieldCheck size={12} color="var(--fr-primary)" />
                      </div>
                      <div className="fr-food-donor-sub">{meal.donorType} • ★ {meal.rating}</div>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <StatusBadge status={meal.status} />
                    </div>
                  </div>

                  <h3 className="fr-food-title">{meal.title}</h3>
                  <p className="fr-food-desc">{meal.description}</p>

                  {/* Metadata Grid */}
                  <div className="fr-food-meta-grid">
                    <div className="fr-food-meta-item">
                      <Sparkles size={14} />
                      <span>Quantity: <strong>{meal.portions}</strong></span>
                    </div>
                    <div className="fr-food-meta-item">
                      <Clock size={14} />
                      <span>Expires: <strong>{meal.availableUntil.split('today')[0] || meal.availableUntil}</strong></span>
                    </div>
                    <div className="fr-food-meta-item" style={{ gridColumn: '1 / -1' }}>
                      <MapPin size={14} />
                      <span>{meal.location}</span>
                    </div>
                  </div>

                  {/* Storage Method */}
                  <div className="fr-food-storage-tag">
                    <ShieldCheck size={13} color="var(--fr-primary)" />
                    <span>Storage: <strong>{meal.storage || 'Temperature Controlled Container'}</strong></span>
                  </div>

                  {/* Action Buttons */}
                  <div className="fr-food-card-actions">
                    <button
                      className="fr-btn fr-btn-secondary"
                      style={{ flex: 1, fontSize: '0.82rem' }}
                      onClick={() => setDetailsModalMeal(meal)}
                    >
                      <Eye size={14} /> Details
                    </button>
                    {isAvailable ? (
                      <button
                        className="fr-btn fr-btn-primary"
                        style={{ flex: 1.4, fontSize: '0.82rem' }}
                        onClick={() => handleOpenRequest(meal)}
                      >
                        <Send size={14} /> Request Food
                      </button>
                    ) : (
                      <button
                        className="fr-btn fr-btn-secondary"
                        disabled
                        style={{ flex: 1.4, opacity: 0.6, cursor: 'not-allowed', fontSize: '0.82rem' }}
                      >
                        Claimed / Pending
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Food Details Modal ── */}
      {detailsModalMeal && (
        <div className="fr-modal-layer" onClick={() => setDetailsModalMeal(null)}>
          <div className="fr-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="fr-dialog-header">
              <h2 className="fr-dialog-title">Food Surplus Specifications</h2>
              <button 
                className="fr-dialog-close" 
                onClick={() => setDetailsModalMeal(null)}
              >
                ✕
              </button>
            </div>

            <img
              src={detailsModalMeal.image}
              alt={detailsModalMeal.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px' }}
            />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span className="fr-rec-chip active">{detailsModalMeal.category}</span>
                <StatusBadge status={detailsModalMeal.status} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--fr-text-heading)' }}>
                {detailsModalMeal.title}
              </h3>
              <p style={{ color: 'var(--fr-text-muted)', fontSize: '0.88rem', marginTop: '6px', lineHeight: 1.6 }}>
                {detailsModalMeal.description}
              </p>
            </div>

            <div className="fr-rec-req-details-box" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="fr-rec-req-detail-col">
                <span className="label">Donor Organization</span>
                <span className="value">{detailsModalMeal.donorName}</span>
              </div>
              <div className="fr-rec-req-detail-col">
                <span className="label">Donor Location</span>
                <span className="value">{detailsModalMeal.location}</span>
              </div>
              <div className="fr-rec-req-detail-col">
                <span className="label">Available Quantity</span>
                <span className="value">{detailsModalMeal.portions}</span>
              </div>
              <div className="fr-rec-req-detail-col">
                <span className="label">Safe Consumption Window</span>
                <span className="value" style={{ color: 'var(--fr-primary)' }}>{detailsModalMeal.availableUntil}</span>
              </div>
              <div className="fr-rec-req-detail-col" style={{ gridColumn: '1 / -1' }}>
                <span className="label">Hygienic Storage & Packaging</span>
                <span className="value">{detailsModalMeal.storage}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button 
                className="fr-btn fr-btn-secondary" 
                style={{ flex: 1 }} 
                onClick={() => setDetailsModalMeal(null)}
              >
                Close
              </button>
              {detailsModalMeal.status === 'Available' && (
                <button 
                  className="fr-btn fr-btn-primary" 
                  style={{ flex: 1.5 }}
                  onClick={() => {
                    const m = detailsModalMeal;
                    setDetailsModalMeal(null);
                    handleOpenRequest(m);
                  }}
                >
                  <Send size={15} /> Proceed to Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Request Food Modal (Portion Count, Purpose, Contact) ── */}
      {requestModalMeal && (
        <div className="fr-modal-layer" onClick={() => setRequestModalMeal(null)}>
          <div className="fr-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="fr-dialog-header">
              <div>
                <h2 className="fr-dialog-title">Submit Portion Request</h2>
                <span style={{ fontSize: '0.78rem', color: 'var(--fr-text-muted)' }}>
                  Requesting from {requestModalMeal.donorName}
                </span>
              </div>
              <button className="fr-dialog-close" onClick={() => setRequestModalMeal(null)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                padding: '12px 14px', 
                background: 'var(--fr-bg-subtle)', 
                borderRadius: 'var(--fr-radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <img 
                  src={requestModalMeal.image} 
                  alt="" 
                  style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} 
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--fr-text-heading)' }}>
                    {requestModalMeal.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--fr-text-muted)' }}>
                    Total Available: <strong>{requestModalMeal.portions}</strong> • Safe Until: {requestModalMeal.availableUntil}
                  </div>
                </div>
              </div>

              {/* Portion Input */}
              <div className="fr-form-group">
                <label>Number of Portions Required (Max: {requestModalMeal.portions}):</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="number"
                    min="1"
                    max={parseInt(requestModalMeal.portions) || 100}
                    value={requestPortions}
                    onChange={(e) => setRequestPortions(e.target.value)}
                    required
                    style={{ width: '120px' }}
                  />
                  <span style={{ fontSize: '0.82rem', color: 'var(--fr-text-muted)' }}>
                    portions for resident consumption
                  </span>
                </div>
              </div>

              {/* Purpose */}
              <div className="fr-form-group">
                <label>Consumption Purpose / Beneficiary Group:</label>
                <textarea
                  rows="2"
                  value={requestPurpose}
                  onChange={(e) => setRequestPurpose(e.target.value)}
                  placeholder="e.g. Evening meal for 48 resident children at our orphanage"
                  required
                />
              </div>

              {/* Contact Person */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="fr-form-group">
                  <label>Representative Name:</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                  />
                </div>
                <div className="fr-form-group">
                  <label>Emergency Phone:</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Pickup Readiness Window */}
              <div className="fr-form-group">
                <label>Estimated Collection Readiness Window:</label>
                <select
                  value={pickupWindow}
                  onChange={(e) => setPickupWindow(e.target.value)}
                >
                  <option value="Within 30 minutes">Immediately (within 30 mins)</option>
                  <option value="Within 45 minutes">Within 45 minutes</option>
                  <option value="Within 1 hour">Within 1 hour</option>
                  <option value="Today evening (7:00 PM - 8:30 PM)">Today evening (7:00 PM - 8:30 PM)</option>
                </select>
              </div>

              {/* Hygiene notice */}
              <div style={{ 
                fontSize: '0.78rem', 
                color: 'var(--fr-text-muted)', 
                background: 'rgba(25, 195, 125, 0.08)', 
                padding: '10px 12px', 
                borderRadius: '8px',
                display: 'flex',
                gap: '8px'
              }}>
                <ShieldCheck size={16} color="var(--fr-primary)" style={{ flexShrink: 0 }} />
                <span>
                  By requesting, you confirm that your organization has verified temperature-controlled transport (hot-boxes or coolers) and will complete handover inspection upon arrival.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  className="fr-btn fr-btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setRequestModalMeal(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="fr-btn fr-btn-primary"
                  style={{ flex: 1.5 }}
                  disabled={submitting}
                >
                  {submitting ? 'Transmitting Request...' : 'Confirm & Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
