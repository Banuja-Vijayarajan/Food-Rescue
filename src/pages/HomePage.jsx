import React, { useState } from 'react';
import '../styles/home.css';
import '../styles/components.css';
import { 
  Utensils, 
  ArrowRight, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  HeartHandshake, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Layers,
  Building2,
  Heart,
  X
} from 'lucide-react';
import { IMPACT_METRICS, HOW_IT_WORKS_STEPS } from '../data/mockData';

export default function HomePage({ 
  foodListings, 
  setCurrentPage, 
  onOpenCallSim, 
  currentRole,
  setCurrentRole,
  onClaimMeal,
  onOpenDonorPage
}) {
  const [heroCardIndex, setHeroCardIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [requestNotice, setRequestNotice] = useState(null);
  const [highlightedMealId, setHighlightedMealId] = useState(null);
  const [selectedMealForModal, setSelectedMealForModal] = useState(null);

  const categories = ['ALL', 'Prepared meals', 'Rice & Curry', 'Bakery items', 'Bread & Roti', 'Fruits', 'Vegetables'];
  const districts = ['ALL', 'Vavuniya', 'Jaffna', 'Kilinochchi', 'Mannar', 'Anuradhapura'];

  const currentHeroMeal = foodListings[heroCardIndex] || foodListings[0];

  const handleNextHeroMeal = () => {
    setHeroCardIndex((prev) => (prev + 1) % foodListings.length);
  };

  const handlePrevHeroMeal = () => {
    setHeroCardIndex((prev) => (prev - 1 + foodListings.length) % foodListings.length);
  };

  // Scroll directly to the selected meal in the Available Food section and highlight it
  const handleViewDetails = (meal) => {
    // Clear any active search or category filters to ensure this meal is rendered
    setSelectedCategory('ALL');
    setSelectedDistrict('ALL');
    setSearchQuery('');
    setHighlightedMealId(meal.id);

    // Scroll smoothly right to the specific card
    setTimeout(() => {
      const cardEl = document.getElementById(`meal-card-${meal.id}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const sectionEl = document.getElementById('available-food');
        if (sectionEl) sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);

    // Remove the highlight after 5 seconds
    setTimeout(() => {
      setHighlightedMealId(prev => (prev === meal.id ? null : prev));
    }, 5000);
  };

  const filteredMeals = foodListings.filter((meal) => {
    const matchesSearch = 
      meal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || meal.category === selectedCategory;
    const matchesDistrict = selectedDistrict === 'ALL' || meal.district === selectedDistrict;

    return matchesSearch && matchesCategory && matchesDistrict;
  });

  const handleRequestClick = (meal) => {
    if (currentRole === 'visitor') {
      setRequestNotice(`To request portions of "${meal.title}", please sign in or register as a Recipient Organization.`);
      setTimeout(() => setRequestNotice(null), 5000);
    } else {
      if (onClaimMeal) onClaimMeal(meal.id);
      setRequestNotice(`Portion request registered with ${meal.donorName} for "${meal.title}". Dispatch coordination active.`);
      setTimeout(() => setRequestNotice(null), 5000);
    }
  };

  return (
    <main className="fr-home-page">
      {/* ====================================================================
          1. HERO SECTION (id="home")
          ==================================================================== */}
      <section className="fr-hero-section" id="home">
        <div className="fr-container">
          <div className="fr-hero-grid">
            
            {/* Left Content */}
            <div className="fr-hero-content">
              <div className="fr-hero-pill-badge">
                <Sparkles size={14} /> Smart Food Surplus Redistribution Platform
              </div>

              <h1 className="fr-hero-title">
                Turn Surplus Food <br />
                <span className="fr-hero-title-highlight">Into Shared Hope.</span>
              </h1>

              <p className="fr-hero-description">
                Food Rescue connects food donors with verified community organizations to safely redistribute surplus food before it goes to waste. When donors post food, automated alerts and calls coordinate quick collection for communities.
              </p>

              <div className="fr-hero-cta-group">
                <button 
                  type="button"
                  className="fr-btn fr-btn-primary"
                  onClick={() => setCurrentPage('login')}
                  title="Sign In to Donate Surplus Food"
                >
                  Donate Surplus Food <ArrowRight size={16} />
                </button>

                <a href="#available-food" className="fr-btn fr-btn-secondary">
                  Find Available Food
                </a>
              </div>

              <div className="fr-hero-meta">
                <div className="fr-hero-meta-item">
                  <ShieldCheck size={18} color="var(--fr-primary)" />
                  <span>Verified Organization Network</span>
                </div>
                <span>•</span>
                <div className="fr-hero-meta-item">
                  <MapPin size={18} color="var(--fr-primary)" />
                  <span>Regional Operations Coverage</span>
                </div>
              </div>
            </div>

            {/* Right: Featured Meal Card */}
            <div className="fr-hero-card-container">
              {/* Header */}
              <div className="fr-hero-card-header">
                <div className="fr-hero-card-header-left">
                  <span className="fr-brand-pulse-dot"></span>
                  <span>Recently Donated Meals</span>
                </div>
                <div className="fr-hero-card-nav-dots">
                  <span style={{ fontSize: '0.78rem', color: 'var(--fr-text-muted)', marginRight: '6px' }}>
                    Meal {heroCardIndex + 1} of {foodListings.length}
                  </span>
                  <button className="fr-hero-card-arrow-btn" onClick={handlePrevHeroMeal} aria-label="Previous meal">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="fr-hero-card-arrow-btn" onClick={handleNextHeroMeal} aria-label="Next meal">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Donor Row */}
              <div className="fr-hero-card-donor-row">
                <div className="fr-hero-card-donor-info">
                  <div className="fr-donor-avatar">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.94rem', color: 'var(--fr-text-heading)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {currentHeroMeal.donorName} <CheckCircle2 size={14} color="var(--fr-primary)" />
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--fr-text-muted)' }}>
                      {currentHeroMeal.donorType} • Rating {currentHeroMeal.rating}★
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {currentHeroMeal.timeAgo}
                  </span>
                  <span style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: '800', 
                    padding: '3px 8px', 
                    borderRadius: '4px',
                    background: currentHeroMeal.status === 'Available' ? 'rgba(25, 195, 125, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: currentHeroMeal.status === 'Available' ? 'var(--fr-primary)' : '#f59e0b',
                    textTransform: 'uppercase'
                  }}>
                    {currentHeroMeal.status}
                  </span>
                </div>
              </div>

              {/* Meal Photo */}
              <div className="fr-hero-card-image-wrap">
                <img 
                  src={currentHeroMeal.image} 
                  alt={currentHeroMeal.title} 
                  className="fr-hero-card-img" 
                />
                <span className="fr-hero-card-img-badge-left">
                  {currentHeroMeal.category}
                </span>
                <span className="fr-hero-card-img-badge-right">
                  {currentHeroMeal.portions}
                </span>
              </div>

              {/* Body */}
              <div className="fr-hero-card-body">
                <h3 className="fr-hero-card-title">{currentHeroMeal.title}</h3>
                <p className="fr-hero-card-desc">{currentHeroMeal.description}</p>

                <div className="fr-hero-card-specs">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="var(--fr-primary)" />
                    Available: <strong>{currentHeroMeal.availableUntil}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="var(--fr-primary)" />
                    {currentHeroMeal.location}
                  </span>
                </div>

                <div className="fr-hero-card-storage-note">
                  <Info size={14} />
                  <span>Storage: {currentHeroMeal.storage}</span>
                </div>

                <div className="fr-hero-card-actions">
                  <button 
                    type="button"
                    className="fr-btn fr-btn-secondary" 
                    style={{ fontSize: '0.84rem', padding: '8px 14px', cursor: 'pointer' }}
                    onClick={() => {
                      if (onOpenDonorPage) {
                        onOpenDonorPage(currentHeroMeal);
                      } else if (setCurrentRole) {
                        setCurrentRole('donor');
                      }
                    }}
                    title="Go to donor's page to view details"
                  >
                    View Details <ArrowRight size={14} />
                  </button>
                  <button 
                    type="button"
                    className="fr-btn fr-btn-primary" 
                    style={{ fontSize: '0.84rem', padding: '8px 14px' }}
                    onClick={() => handleRequestClick(currentHeroMeal)}
                  >
                    <HeartHandshake size={15} /> Request Portions
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Floating Notice Toast */}
      {requestNotice && (
        <div style={{
          position: 'fixed',
          top: '90px',
          right: '24px',
          zIndex: 999,
          background: 'var(--fr-bg-card)',
          border: '2px solid var(--fr-primary)',
          color: 'var(--fr-text-heading)',
          padding: '14px 20px',
          borderRadius: '12px',
          boxShadow: 'var(--fr-shadow-card)',
          maxWidth: '420px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'fr-fadeIn 0.2s ease-out'
        }}>
          <Info size={22} color="var(--fr-primary)" />
          <div style={{ fontSize: '0.88rem' }}>{requestNotice}</div>
        </div>
      )}

      {/* ====================================================================
          2. HOW FOOD RESCUE WORKS (id="how-it-works")
          ==================================================================== */}
      <section className="fr-section" id="how-it-works">
        <div className="fr-container">
          <div className="fr-section-header">
            <div className="fr-hero-pill-badge" style={{ margin: '0 auto 16px auto' }}>
              SEAMLESS END-TO-END WORKFLOW
            </div>
            <h2 className="fr-section-title">How Food Rescue Works</h2>
            <p className="fr-section-subtitle">
              Designed specifically to guarantee food safety compliance, prevent unnecessary waste, and ensure maximum dignity for recipients.
            </p>
          </div>

          <div className="fr-workflow-grid">
            {HOW_IT_WORKS_STEPS.map((step) => (
              <div className="fr-workflow-card" key={step.stepNumber}>
                <div className="fr-workflow-card-top">
                  <span className="fr-workflow-step-num">{step.stepNumber}</span>
                  <div className="fr-workflow-icon-box">
                    <CheckCircle2 size={18} />
                  </div>
                </div>

                <h3 className="fr-workflow-card-title">{step.title}</h3>
                <p className="fr-workflow-card-desc">{step.description}</p>

                <div className="fr-workflow-step-link">
                  <span>{step.badge}</span> <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. BROWSE AVAILABLE SURPLUS FOOD SECTION (id="available-food")
          ==================================================================== */}
      <section className="fr-section" id="available-food">
        <div className="fr-container">
          <div style={{ marginBottom: '28px' }}>
            <h2 className="fr-section-title" style={{ fontSize: '2rem' }}>
              Browse Available Surplus Food
            </h2>
            <p className="fr-section-subtitle">
              Live discovery feed of verified commercial food postings ready for community pickup
            </p>
          </div>

          {/* Policy Banner */}
          <div style={{
            background: 'var(--fr-bg-subtle)',
            border: '1px solid var(--fr-border-card)',
            borderRadius: '16px',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            marginBottom: '28px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'rgba(25, 195, 125, 0.15)',
                color: 'var(--fr-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <strong style={{ color: 'var(--fr-text-heading)', display: 'block', fontSize: '0.94rem' }}>
                  Open Public Directory • Request Access Policy
                </strong>
                <span style={{ color: 'var(--fr-text-muted)', fontSize: '0.84rem' }}>
                  Surplus food details, timing, and hygiene logs are openly viewable by anyone. Portion requests are reserved for verified community organizations.
                </span>
              </div>
            </div>
            <button 
              type="button"
              className="fr-btn fr-btn-secondary" 
              style={{ fontSize: '0.84rem', padding: '8px 16px' }}
              onClick={() => setCurrentPage('register')}
            >
              Organization Request Policy <ArrowRight size={14} />
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="fr-browse-filters-box">
            <div className="fr-search-input-wrap">
              <Search size={18} className="fr-search-icon" />
              <input 
                type="text" 
                placeholder="Search available food (e.g. Rice & Curry, Bread, Green Leaf Hotel)..."
                className="fr-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter Pills */}
            <div className="fr-filter-group">
              <span className="fr-filter-label">
                <Layers size={14} /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`fr-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* District Filter Pills */}
            <div className="fr-filter-group">
              <span className="fr-filter-label">
                <MapPin size={14} /> District:
              </span>
              {districts.map((dist) => (
                <button
                  key={dist}
                  type="button"
                  className={`fr-filter-pill ${selectedDistrict === dist ? 'active' : ''}`}
                  onClick={() => setSelectedDistrict(dist)}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>

          {/* Food Grid */}
          <div className="fr-food-grid">
            {filteredMeals.map((meal) => (
              <div 
                className={`fr-food-card ${highlightedMealId === meal.id ? 'highlighted' : ''}`} 
                key={meal.id}
                id={`meal-card-${meal.id}`}
              >
                <div className="fr-food-card-img-wrap">
                  <img src={meal.image} alt={meal.title} className="fr-food-card-img" />
                  {highlightedMealId === meal.id && (
                    <div className="fr-food-card-highlight-pill">
                      <Sparkles size={12} /> Selected from Recent Donations
                    </div>
                  )}
                  <span className={`fr-badge-status ${meal.status.toLowerCase()}`}>
                    <Clock size={12} /> {meal.status}
                  </span>
                  <span className="fr-badge-portions">
                    {meal.portions}
                  </span>
                </div>

                <div className="fr-food-card-body">
                  <div className="fr-food-card-donor">
                    <Utensils size={14} color="var(--fr-primary)" />
                    <span>{meal.donorName}</span>
                  </div>

                  <h3 className="fr-food-card-title">{meal.title}</h3>

                  <div className="fr-food-card-meta">
                    <span><Clock size={13} /> {meal.availableUntil}</span>
                    <span><MapPin size={13} /> {meal.location}</span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--fr-text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
                    {meal.description}
                  </p>

                  <div className="fr-food-card-actions">
                    <button
                      type="button"
                      className="fr-btn fr-btn-ghost"
                      style={{ padding: '6px 10px', fontSize: '0.8rem', color: 'var(--fr-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}
                      onClick={() => setSelectedMealForModal(meal)}
                      title="View all specifications for this meal"
                    >
                      <Info size={14} /> View Details
                    </button>
                    <button 
                      type="button"
                      className="fr-btn fr-btn-primary"
                      style={{ padding: '7px 14px', fontSize: '0.82rem' }}
                      onClick={() => handleRequestClick(meal)}
                    >
                      Request Portions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMeals.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--fr-text-muted)' }}>
              <Utensils size={40} style={{ opacity: 0.4, marginBottom: '12px' }} />
              <h3>No surplus meals found matching your search.</h3>
              <p style={{ fontSize: '0.9rem' }}>Try selecting "ALL" categories or districts above.</p>
            </div>
          )}
        </div>
      </section>

      {/* ====================================================================
          4. IMPACT STATS SECTION (id="impact")
          ==================================================================== */}
      <section className="fr-section" id="impact">
        <div className="fr-container">
          <div className="fr-section-header">
            <h2 className="fr-section-title">Real Numbers. Real Community Change.</h2>
            <p className="fr-section-subtitle">
              Every donation prevents edible food from going to landfill while nourishing vulnerable communities.
            </p>
          </div>

          <div className="fr-impact-grid">
            {IMPACT_METRICS.map((stat) => (
              <div className="fr-impact-card" key={stat.id}>
                <div className="fr-impact-icon-wrap">
                  <Utensils size={22} />
                </div>
                <div className="fr-impact-value">{stat.value}</div>
                <span className="fr-impact-badge">{stat.badge}</span>
                <div className="fr-impact-title">{stat.title}</div>
                <p className="fr-impact-desc">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. ABOUT SECTION (id="about")
          ==================================================================== */}
      <section className="fr-about-section" id="about">
        <div className="fr-container">
          <div className="fr-about-header">
            <h2 className="fr-about-title">
              Rescue Food. Reduce Waste.
              <span className="fr-about-title-highlight">Support Communities.</span>
            </h2>
            <p className="fr-about-subtitle">
              Food Rescue makes it easier for organizations to share safe surplus food with communities that need it.
            </p>
          </div>

          <div className="fr-about-cards-grid">
            {/* Card 1: For Food Donors */}
            <div className="fr-about-card">
              <div className="fr-about-card-icon-box">
                <Building2 size={24} />
              </div>
              <div className="fr-about-card-category">
                HOTELS • RESTAURANTS • CATERERS • EVENT BANQUETS
              </div>
              <h3 className="fr-about-card-heading">
                For Food Donors
              </h3>
              <p className="fr-about-card-desc">
                Convert inevitable banquet and culinary surplus into powerful CSR goodwill. Eliminate landfill disposal costs while receiving verifiable impact certificates.
              </p>

              <ul className="fr-about-checklist">
                <li className="fr-about-check-item">
                  <span className="fr-about-check-icon">✓</span>
                  <span>Post surplus in under 2 minutes with automated portion calculators</span>
                </li>
                <li className="fr-about-check-item">
                  <span className="fr-about-check-icon">✓</span>
                  <span>Strict safety checklists & temperature recording protect your brand</span>
                </li>
                <li className="fr-about-check-item">
                  <span className="fr-about-check-icon">✓</span>
                  <span>Direct coordination with verified, background-checked charities</span>
                </li>
                <li className="fr-about-check-item">
                  <span className="fr-about-check-icon">✓</span>
                  <span>Download verified CSR & ESG carbon reduction reports anytime</span>
                </li>
              </ul>

              <button 
                type="button" 
                className="fr-about-btn-dark"
                onClick={() => setCurrentPage('register')}
              >
                Register as a Food Donor <ArrowRight size={16} />
              </button>
            </div>

            {/* Card 2: For Recipient Organizations */}
            <div className="fr-about-card">
              <div className="fr-about-card-icon-box">
                <Heart size={24} />
              </div>
              <div className="fr-about-card-category">
                ORPHANAGES • SHELTERS • WELFARE NGOS • COMMUNITY KITCHENS
              </div>
              <h3 className="fr-about-card-heading">
                For Recipient Organizations
              </h3>
              <p className="fr-about-card-desc">
                Receive free, high-grade balanced meals from star hotels and banquet suppliers. Real-time notifications ensure food reaches beneficiaries fresh and hot.
              </p>

              <ul className="fr-about-checklist">
                <li className="fr-about-check-item">
                  <span className="fr-about-check-icon">✓</span>
                  <span>Instant push alerts when donations become available in your area</span>
                </li>
                <li className="fr-about-check-item">
                  <span className="fr-about-check-icon">✓</span>
                  <span>Transparent food info: allergen details, prep time & safe expiry</span>
                </li>
                <li className="fr-about-check-item">
                  <span className="fr-about-check-icon">✓</span>
                  <span>Coordinate collection schedules with direct phone hotline contact</span>
                </li>
                <li className="fr-about-check-item">
                  <span className="fr-about-check-icon">✓</span>
                  <span>Zero cost: 100% free surplus distribution for welfare programs</span>
                </li>
              </ul>

              <button 
                type="button" 
                className="fr-about-btn-light"
                onClick={() => setCurrentPage('register')}
              >
                Register as Recipient Org <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Meal Full Details Modal */}
      {selectedMealForModal && (
        <div className="fr-modal-backdrop" onClick={() => setSelectedMealForModal(null)}>
          <div className="fr-meal-detail-modal" onClick={e => e.stopPropagation()}>
            <button 
              className="fr-meal-modal-close-btn"
              onClick={() => setSelectedMealForModal(null)}
              title="Close Details"
            >
              <X size={18} />
            </button>

            <div className="fr-meal-modal-img-wrap">
              <img 
                src={selectedMealForModal.image} 
                alt={selectedMealForModal.title} 
                className="fr-meal-modal-img" 
              />
              <span className={`fr-badge-status ${selectedMealForModal.status.toLowerCase()}`}>
                <Clock size={12} /> {selectedMealForModal.status}
              </span>
              <span className="fr-badge-portions">
                {selectedMealForModal.portions}
              </span>
            </div>

            <div className="fr-meal-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Utensils size={16} color="var(--fr-primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--fr-primary)' }}>
                  {selectedMealForModal.donorName}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--fr-text-muted)' }}>
                  • {selectedMealForModal.donorType} ({selectedMealForModal.rating}★)
                </span>
              </div>

              <h2 style={{ fontSize: '1.38rem', fontWeight: 800, color: 'var(--fr-text-heading)', marginBottom: '12px' }}>
                {selectedMealForModal.title}
              </h2>

              <p style={{ color: 'var(--fr-text-body)', lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '18px' }}>
                {selectedMealForModal.description}
              </p>

              <div style={{ 
                background: 'var(--fr-bg-subtle)', 
                border: '1px solid var(--fr-border-card)', 
                borderRadius: '12px', 
                padding: '14px 18px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fr-text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Available Until</span>
                  <strong style={{ fontSize: '0.86rem', color: 'var(--fr-text-heading)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                    <Clock size={14} color="var(--fr-primary)" /> {selectedMealForModal.availableUntil}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fr-text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Location</span>
                  <strong style={{ fontSize: '0.86rem', color: 'var(--fr-text-heading)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                    <MapPin size={14} color="var(--fr-primary)" /> {selectedMealForModal.location}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fr-text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Category</span>
                  <strong style={{ fontSize: '0.86rem', color: 'var(--fr-text-heading)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                    <Layers size={14} color="var(--fr-primary)" /> {selectedMealForModal.category}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--fr-text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Storage Condition</span>
                  <strong style={{ fontSize: '0.86rem', color: 'var(--fr-text-heading)', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                    <Info size={14} color="var(--fr-primary)" /> {selectedMealForModal.storage}
                  </strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="fr-btn fr-btn-secondary"
                  onClick={() => setSelectedMealForModal(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="fr-btn fr-btn-primary"
                  onClick={() => {
                    handleRequestClick(selectedMealForModal);
                    setSelectedMealForModal(null);
                  }}
                >
                  <HeartHandshake size={16} /> Request Portions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
