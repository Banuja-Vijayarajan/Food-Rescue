import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Star,
  CheckCircle,
  Users,
  Utensils,
  Package,
  TrendingUp,
  Heart,
  Building2,
  Leaf,
  Phone,
  ArrowRight,
  ShieldCheck,
  Clock,
  Globe,
  ChevronRight,
} from 'lucide-react';
import '../styles/organization.css';

/* ─────────────────────────────────────────────────────────────────────────────
   Mock Data
───────────────────────────────────────────────────────────────────────────── */
const ORGS = [
  {
    id: 1,
    name: 'Green Leaf Hotel & Banquets',
    type: 'hotel',
    typeLabel: 'Hotel & Banquet',
    emoji: '🏨',
    location: 'Vavuniya Town, Northern Province',
    district: 'Vavuniya',
    rating: 4.9,
    verified: true,
    mealsShared: 3420,
    activeDonations: 12,
    recipientCount: 240,
    tags: ['Prepared Meals', 'Banquet Surplus', 'Hot Food', 'Weekly'],
    joinedYear: 2022,
    description: 'Premium hotel donating surplus banquet meals daily to community shelters.',
  },
  {
    id: 2,
    name: 'Hope Harvest Foundation',
    type: 'ngo',
    typeLabel: 'NGO / Charity',
    emoji: '🌿',
    location: 'Jaffna City, Northern Province',
    district: 'Jaffna',
    rating: 5.0,
    verified: true,
    mealsShared: 8900,
    activeDonations: 28,
    recipientCount: 650,
    tags: ['Multi-District', 'Fresh Produce', 'Cooked Meals', 'Emergency'],
    joinedYear: 2021,
    description: 'Northern Sri Lanka\'s largest food redistribution NGO with an AI-assisted routing network.',
  },
  {
    id: 3,
    name: 'Spice Garden Restaurant',
    type: 'resto',
    typeLabel: 'Restaurant',
    emoji: '🍽️',
    location: 'Kilinochchi Town',
    district: 'Kilinochchi',
    rating: 4.7,
    verified: true,
    mealsShared: 1250,
    activeDonations: 5,
    recipientCount: 88,
    tags: ['Cooked Meals', 'Vegetarian', 'End-of-Day'],
    joinedYear: 2023,
    description: 'Family-run restaurant donating end-of-day vegetarian meals three times a week.',
  },
  {
    id: 4,
    name: 'St. Mary\'s School & College',
    type: 'school',
    typeLabel: 'Educational Institution',
    emoji: '🏫',
    location: 'Vavuniya North',
    district: 'Vavuniya',
    rating: 4.8,
    verified: false,
    mealsShared: 620,
    activeDonations: 3,
    recipientCount: 50,
    tags: ['Canteen Surplus', 'Packaged', 'School Days'],
    joinedYear: 2024,
    description: 'School canteen participating in the Food Rescue network on active school days.',
  },
  {
    id: 5,
    name: 'Ceylon Agri Corp',
    type: 'corp',
    typeLabel: 'Corporate',
    emoji: '🏢',
    location: 'Mannar District Hub',
    district: 'Mannar',
    rating: 4.6,
    verified: true,
    mealsShared: 2100,
    activeDonations: 9,
    recipientCount: 170,
    tags: ['Raw Produce', 'Canned Goods', 'Bulk', 'Monthly Drive'],
    joinedYear: 2022,
    description: 'Agricultural corporation donating surplus raw produce and canned goods monthly.',
  },
  {
    id: 6,
    name: 'Sunrise Organic Farms',
    type: 'farm',
    typeLabel: 'Farm / Agriculture',
    emoji: '🌾',
    location: 'Mullaitivu District',
    district: 'Mullaitivu',
    rating: 4.9,
    verified: true,
    mealsShared: 4700,
    activeDonations: 18,
    recipientCount: 310,
    tags: ['Vegetables', 'Fruits', 'Grains', 'Seasonal'],
    joinedYear: 2021,
    description: 'Organic farming cooperative supplying fresh seasonal produce to recipient organisations weekly.',
  },
  {
    id: 7,
    name: 'Northern Star Bakery',
    type: 'resto',
    typeLabel: 'Restaurant',
    emoji: '🥐',
    location: 'Jaffna Fort Area',
    district: 'Jaffna',
    rating: 4.5,
    verified: true,
    mealsShared: 980,
    activeDonations: 4,
    recipientCount: 70,
    tags: ['Baked Goods', 'Bread', 'Morning Pickup'],
    joinedYear: 2023,
    description: 'Artisanal bakery offering surplus baked goods each morning before 8 AM.',
  },
  {
    id: 8,
    name: 'Kilinochchi Care Circle',
    type: 'ngo',
    typeLabel: 'NGO / Charity',
    emoji: '❤️',
    location: 'Kilinochchi Town',
    district: 'Kilinochchi',
    rating: 4.8,
    verified: true,
    mealsShared: 5200,
    activeDonations: 21,
    recipientCount: 390,
    tags: ['Cooked Meals', 'Children', 'Elderly', 'Daily'],
    joinedYear: 2020,
    description: 'Community care circle serving cooked meals daily to children and elderly residents.',
  },
  {
    id: 9,
    name: 'Vavuniya Catering Co.',
    type: 'hotel',
    typeLabel: 'Hotel & Banquet',
    emoji: '🎪',
    location: 'Vavuniya Town',
    district: 'Vavuniya',
    rating: 4.4,
    verified: false,
    mealsShared: 430,
    activeDonations: 2,
    recipientCount: 35,
    tags: ['Event Catering', 'Large Batches', 'As Available'],
    joinedYear: 2024,
    description: 'Event caterer donating large batch surplus after banquets and corporate events.',
  },
];

const TYPE_FILTERS = [
  { key: 'all', label: 'All Types' },
  { key: 'hotel', label: 'Hotels & Banquets' },
  { key: 'ngo', label: 'NGOs / Charities' },
  { key: 'resto', label: 'Restaurants' },
  { key: 'school', label: 'Schools' },
  { key: 'corp', label: 'Corporate' },
  { key: 'farm', label: 'Farms' },
];

const DISTRICT_FILTERS = [
  { key: 'all', label: 'All Districts' },
  { key: 'Vavuniya', label: 'Vavuniya' },
  { key: 'Jaffna', label: 'Jaffna' },
  { key: 'Kilinochchi', label: 'Kilinochchi' },
  { key: 'Mannar', label: 'Mannar' },
  { key: 'Mullaitivu', label: 'Mullaitivu' },
];

const HOW_STEPS = [
  {
    icon: <Building2 size={22} />,
    title: 'Register Your Organisation',
    desc: 'Sign up in minutes. Provide basic details about your organisation type, location, and the kind of food surplus you typically generate.',
  },
  {
    icon: <Package size={22} />,
    title: 'Post Surplus Listings',
    desc: 'When you have surplus food, post it with quantity, pickup window, and storage type. Our AI matches it to nearby recipients instantly.',
  },
  {
    icon: <Phone size={22} />,
    title: 'Automated IVR Dispatch',
    desc: 'Our phone-call alert system notifies verified recipients automatically — no app required. Meals get claimed in minutes, not hours.',
  },
];

const TESTIMONIALS = [
  {
    text: 'Joining Food Rescue transformed how we handle our banquet surplus. Instead of discarding perfectly good food, we now feed hundreds of families every week — it\'s effortless with the IVR system.',
    name: 'Kavitha R.',
    role: 'Operations Manager, Green Leaf Hotel',
    initials: 'KR',
    color: '#19C37D',
    stars: 5,
  },
  {
    text: 'As an NGO, coordinating pickups used to be a nightmare. Now donors post listings, we get a phone call, and our volunteers are on the road within 30 minutes. Incredible platform.',
    name: 'Samuel P.',
    role: 'Director, Hope Harvest Foundation',
    initials: 'SP',
    color: '#A3E635',
    stars: 5,
  },
  {
    text: 'We were throwing away 20 kg of fresh vegetables every other day. Food Rescue connected us to three recipient organisations in Jaffna. It\'s a win-win for everyone.',
    name: 'Ananthi M.',
    role: 'Owner, Sunrise Organic Farms',
    initials: 'AM',
    color: '#34d399',
    stars: 5,
  },
  {
    text: 'Setup took less than 10 minutes. The team verified our account same day, and we had our first pickup request within the week. Highly recommend every restaurant joins.',
    name: 'Rajan K.',
    role: 'Head Chef, Spice Garden Restaurant',
    initials: 'RK',
    color: '#f59e0b',
    stars: 5,
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Star Rating Helper
───────────────────────────────────────────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          fill={s <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke={s <= Math.round(rating) ? '#f59e0b' : '#6b7280'}
          strokeWidth={1.5}
        />
      ))}
      <span style={{ fontSize: '0.76rem', marginLeft: 4, color: 'var(--fr-text-muted)' }}>
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Organisation Card
───────────────────────────────────────────────────────────────────────────── */
function OrgCard({ org }) {
  return (
    <div className="org-card" role="article" aria-label={`Organisation: ${org.name}`}>
      {/* Card Header */}
      <div className="org-card-header">
        <div className={`org-card-logo type-${org.type}`}>{org.emoji}</div>
        <div className="org-card-title-block">
          <div className="org-card-name">{org.name}</div>
          <span className="org-card-type-badge">
            <Leaf size={9} /> {org.typeLabel}
          </span>
        </div>
        {org.verified && (
          <div className="org-card-verified" title="Verified Organisation">
            <ShieldCheck size={18} />
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="org-card-meta">
        <div className="org-card-meta-row">
          <MapPin size={13} />
          <span>{org.location}</span>
        </div>
        <div className="org-card-meta-row">
          <Star size={13} />
          <Stars rating={org.rating} />
          <span style={{ marginLeft: 4, color: 'var(--fr-text-muted)', fontSize: '0.76rem' }}>
            · Member since {org.joinedYear}
          </span>
        </div>
      </div>

      {/* Short Desc */}
      <p
        style={{
          fontSize: '0.82rem',
          color: 'var(--fr-text-muted)',
          lineHeight: 1.55,
          marginBottom: 16,
        }}
      >
        {org.description}
      </p>

      {/* Stats */}
      <div className="org-card-stats">
        <div className="org-card-stat">
          <div className="org-card-stat-value">
            {org.mealsShared.toLocaleString()}<span className="unit"> meals</span>
          </div>
          <div className="org-card-stat-label">Shared</div>
        </div>
        <div className="org-card-stat">
          <div className="org-card-stat-value">
            {org.activeDonations}<span className="unit"> active</span>
          </div>
          <div className="org-card-stat-label">Listings</div>
        </div>
        <div className="org-card-stat">
          <div className="org-card-stat-value">
            {org.recipientCount}<span className="unit">+</span>
          </div>
          <div className="org-card-stat-label">Recipients</div>
        </div>
      </div>

      {/* Tags */}
      <div className="org-card-tags">
        {org.tags.map((tag) => (
          <span key={tag} className="org-card-tag">{tag}</span>
        ))}
      </div>

      {/* Actions */}
      <div className="org-card-footer">
        <button className="org-card-btn org-card-btn-primary">
          View Profile
        </button>
        <button className="org-card-btn org-card-btn-ghost">
          Contact
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Page Component
───────────────────────────────────────────────────────────────────────────── */
export default function OrganizationPage({ setCurrentPage }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');

  const filtered = useMemo(() => {
    return ORGS.filter((org) => {
      const matchesSearch =
        search === '' ||
        org.name.toLowerCase().includes(search.toLowerCase()) ||
        org.location.toLowerCase().includes(search.toLowerCase()) ||
        org.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesType = typeFilter === 'all' || org.type === typeFilter;
      const matchesDistrict = districtFilter === 'all' || org.district === districtFilter;

      return matchesSearch && matchesType && matchesDistrict;
    });
  }, [search, typeFilter, districtFilter]);

  const totalMeals = ORGS.reduce((sum, o) => sum + o.mealsShared, 0);
  const totalRecipients = ORGS.reduce((sum, o) => sum + o.recipientCount, 0);
  const totalActive = ORGS.reduce((sum, o) => sum + o.activeDonations, 0);

  return (
    <main id="organizations">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="org-hero">
        <div className="fr-container">
          <div className="org-hero-inner">
            {/* Left: Copy */}
            <div>
              <div className="org-hero-badge">
                <Leaf size={11} /> Partner Network
              </div>
              <h1 className="org-hero-title">
                Organisations <br />
                <span className="highlight">Fighting Food Waste</span>
                <br /> Together
              </h1>
              <p className="org-hero-subtitle">
                Discover the hotels, restaurants, NGOs, farms, and corporations
                driving food rescue across Northern Sri Lanka — powered by smart
                surplus redistribution and automated IVR dispatch.
              </p>
              <div className="org-hero-actions">
                <button
                  className="fr-btn fr-btn-primary"
                  onClick={() => setCurrentPage && setCurrentPage('register')}
                  id="hero-join-org-btn"
                >
                  <Building2 size={17} /> Join as Organisation
                </button>
                <button
                  className="fr-btn fr-btn-secondary"
                  onClick={() => {
                    const el = document.getElementById('org-directory');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  id="hero-browse-btn"
                >
                  Browse Directory <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right: Stats Panel */}
            <div className="org-hero-stats-panel">
              <div className="org-stats-title">🌱 Network at a Glance</div>
              <div className="org-stats-grid">
                <div className="org-stat-item">
                  <div className="org-stat-value">{ORGS.length}<span>+</span></div>
                  <div className="org-stat-label">Partner Organisations</div>
                </div>
                <div className="org-stat-item">
                  <div className="org-stat-value">{(totalMeals / 1000).toFixed(1)}<span>k</span></div>
                  <div className="org-stat-label">Meals Shared</div>
                </div>
                <div className="org-stat-item">
                  <div className="org-stat-value">{totalActive}<span>+</span></div>
                  <div className="org-stat-label">Active Listings Now</div>
                </div>
                <div className="org-stat-item">
                  <div className="org-stat-value">5<span></span></div>
                  <div className="org-stat-label">Districts Covered</div>
                </div>
              </div>
              <div className="org-active-orgs-row">
                <div className="org-avatars-stack">
                  <div className="org-avatar-chip c1">GL</div>
                  <div className="org-avatar-chip c2">HH</div>
                  <div className="org-avatar-chip c3">SF</div>
                  <div className="org-avatar-chip c4">+6</div>
                </div>
                <div className="org-active-text">
                  <strong>{ORGS.filter(o => o.activeDonations > 0).length} organisations</strong> posted surplus today
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="org-section" style={{ background: 'var(--fr-bg-subtle)' }}>
        <div className="fr-container">
          <div className="org-section-header">
            <span className="org-section-eyebrow">For Organisations</span>
            <h2 className="org-section-title">Start Sharing in 3 Simple Steps</h2>
            <p className="org-section-desc">
              No complex onboarding. No tech expertise required. Join hundreds of
              organisations already redistributing food across Northern Sri Lanka.
            </p>
          </div>
          <div className="org-how-grid">
            {HOW_STEPS.map((step, i) => (
              <div className="org-how-step" key={i}>
                <div className="org-how-step-num">{i + 1}</div>
                <div className="org-how-step-icon">{step.icon}</div>
                <div className="org-how-step-title">{step.title}</div>
                <p className="org-how-step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIRECTORY ───────────────────────────────────────────────────── */}
      <section className="org-section" id="org-directory">
        <div className="fr-container">
          <div className="org-section-header">
            <span className="org-section-eyebrow">Partner Directory</span>
            <h2 className="org-section-title">Browse All Organisations</h2>
            <p className="org-section-desc">
              Filter by type or district to find donors, NGO partners, and
              recipient organisations active in your area.
            </p>
          </div>

          {/* Search + Type Filters */}
          <div className="org-filter-bar">
            <div className="org-search-wrap">
              <span className="org-search-icon"><Search size={16} /></span>
              <input
                id="org-search-input"
                className="org-search-input"
                type="text"
                placeholder="Search by name, location, or food type…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search organisations"
              />
            </div>
          </div>

          {/* Type Filter Chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.key}
                id={`type-filter-${f.key}`}
                className={`org-filter-chip ${typeFilter === f.key ? 'active' : ''}`}
                onClick={() => setTypeFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* District Filter Chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
            {DISTRICT_FILTERS.map((f) => (
              <button
                key={f.key}
                id={`district-filter-${f.key}`}
                className={`org-filter-chip ${districtFilter === f.key ? 'active' : ''}`}
                onClick={() => setDistrictFilter(f.key)}
                style={{ fontSize: '0.8rem', padding: '7px 16px' }}
              >
                <Globe size={11} style={{ display: 'inline', marginRight: 4 }} />
                {f.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div
            style={{
              fontSize: '0.84rem',
              color: 'var(--fr-text-muted)',
              marginBottom: 24,
            }}
          >
            Showing <strong style={{ color: 'var(--fr-text-heading)' }}>{filtered.length}</strong> of {ORGS.length} organisations
          </div>

          {/* Cards Grid */}
          <div className="org-cards-grid">
            {filtered.length === 0 ? (
              <div className="org-empty-state">
                <div className="org-empty-icon">🔍</div>
                <h3>No organisations found</h3>
                <p>Try adjusting your search or filter criteria.</p>
              </div>
            ) : (
              filtered.map((org) => <OrgCard key={org.id} org={org} />)
            )}
          </div>
        </div>
      </section>

      {/* ── IMPACT STATS ────────────────────────────────────────────────── */}
      <section className="org-impact-section">
        <div className="fr-container">
          <div className="org-section-header">
            <span className="org-section-eyebrow">Collective Impact</span>
            <h2 className="org-section-title">Numbers That Matter</h2>
            <p className="org-section-desc">
              Every partnership amplifies the reach of our network — here's what
              we've achieved together so far.
            </p>
          </div>
          <div className="org-impact-grid">
            <div className="org-impact-card">
              <div className="org-impact-icon-wrap"><Utensils size={24} /></div>
              <div className="org-impact-value">{(totalMeals / 1000).toFixed(0)}<em>k+</em></div>
              <div className="org-impact-label">Meals Redistributed</div>
            </div>
            <div className="org-impact-card">
              <div className="org-impact-icon-wrap"><Users size={24} /></div>
              <div className="org-impact-value">{totalRecipients.toLocaleString()}<em>+</em></div>
              <div className="org-impact-label">Beneficiaries Reached</div>
            </div>
            <div className="org-impact-card">
              <div className="org-impact-icon-wrap"><TrendingUp size={24} /></div>
              <div className="org-impact-value">5<em></em></div>
              <div className="org-impact-label">Districts Covered</div>
            </div>
            <div className="org-impact-card">
              <div className="org-impact-icon-wrap"><Heart size={24} /></div>
              <div className="org-impact-value">92<em>%</em></div>
              <div className="org-impact-label">Pickup Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────── */}
      <section className="org-section">
        <div className="fr-container">
          <div className="org-section-header">
            <span className="org-section-eyebrow">Voices from the Network</span>
            <h2 className="org-section-title">What Partner Organisations Say</h2>
          </div>
          <div className="org-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div className="org-testimonial-card" key={i}>
                <div className="org-stars">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={12} fill="#f59e0b" stroke="none" />
                  ))}
                </div>
                <div className="org-testimonial-quote">"</div>
                <p className="org-testimonial-text">{t.text}</p>
                <div className="org-testimonial-author">
                  <div
                    className="org-testimonial-avatar"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <div className="org-testimonial-name">{t.name}</div>
                    <div className="org-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────────────────── */}
      <section className="org-cta-section">
        <div className="fr-container">
          <div className="org-cta-card">
            <div className="org-cta-badge">
              <CheckCircle size={12} /> Open to All Organisations
            </div>
            <h2 className="org-cta-title">
              Ready to Join the <br />
              Food Rescue Network?
            </h2>
            <p className="org-cta-subtitle">
              Whether you're a hotel, restaurant, NGO, farm, school, or corporation —
              your surplus food can change lives. Registration is free, fast, and
              fully supported.
            </p>
            <div className="org-cta-actions">
              <button
                className="fr-btn fr-btn-primary"
                style={{ padding: '14px 32px', fontSize: '1rem' }}
                onClick={() => setCurrentPage && setCurrentPage('register')}
                id="cta-register-btn"
              >
                <Building2 size={18} /> Register Your Organisation
              </button>
              <button
                className="fr-btn fr-btn-secondary"
                style={{ padding: '14px 28px', fontSize: '1rem' }}
                onClick={() => setCurrentPage && setCurrentPage('home')}
                id="cta-learn-more-btn"
              >
                Learn More <ChevronRight size={16} />
              </button>
            </div>
            <div className="org-cta-features">
              <div className="org-cta-feature">
                <CheckCircle size={14} /> Free to join
              </div>
              <div className="org-cta-feature">
                <Clock size={14} /> Same-day verification
              </div>
              <div className="org-cta-feature">
                <Phone size={14} /> IVR dispatch included
              </div>
              <div className="org-cta-feature">
                <ShieldCheck size={14} /> Verified partner badge
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
