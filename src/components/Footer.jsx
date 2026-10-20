import React from 'react';
import '../styles/components.css';
import { Leaf, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer({ setCurrentPage }) {
  const handleScrollTo = (sectionId) => {
    setCurrentPage('home');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <footer className="fr-footer">
      <div className="fr-container">
        <div className="fr-footer-custom-grid">
          {/* Column 1: Brand & Regional Hub */}
          <div className="fr-footer-brand-col">
            <div className="fr-footer-logo-row" onClick={() => setCurrentPage('home')}>
              <div className="fr-footer-leaf-icon">
                <Leaf size={18} />
              </div>
              <span className="fr-footer-brand-title">Food Rescue</span>
            </div>

            <p className="fr-footer-brand-desc">
              A Smart Food Surplus Redistribution System connecting commercial food donors with verified community organizations. Bridging food surplus with genuine hunger while slashing carbon emissions.
            </p>

            <div className="fr-footer-tagline">
              Smart Food Surplus Redistribution System
            </div>

            {/* Regional Hub Info */}
            <div className="fr-footer-hub-section">
              <h5 className="fr-footer-section-title">REGIONAL HUB</h5>
              <div className="fr-footer-hub-list">
                <div className="fr-footer-hub-item">
                  <MapPin size={14} className="fr-hub-icon" />
                  <span>Northern Province, Vavuniya, Sri Lanka</span>
                </div>
                <div className="fr-footer-hub-item">
                  <Phone size={14} className="fr-hub-icon" />
                  <span>+94 24 222 0100 (Hotline)</span>
                </div>
                <div className="fr-footer-hub-item">
                  <Mail size={14} className="fr-hub-icon" />
                  <span>rescue@foodrescue.org</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="fr-footer-links-col">
            <h5 className="fr-footer-section-title">PLATFORM</h5>
            <ul className="fr-footer-links-list">
              <li>
                <button type="button" onClick={() => setCurrentPage('home')}>
                  Home
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleScrollTo('how-it-works')}>
                  How It Works
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleScrollTo('available-food')}>
                  Browse Available Food
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleScrollTo('impact')}>
                  Impact & Analytics
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleScrollTo('about')}>
                  About
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Stakeholders Links */}
          <div className="fr-footer-links-col">
            <h5 className="fr-footer-section-title">STAKEHOLDERS</h5>
            <ul className="fr-footer-links-list">
              <li>
                <button type="button" onClick={() => setCurrentPage('register')}>
                  Register as Food Donor
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setCurrentPage('register')}>
                  Register as Recipient Org
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setCurrentPage('login')}>
                  Partner Login
                </button>
              </li>
              <li>
                <button type="button" onClick={() => setCurrentPage('register')}>
                  Admin Governance
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleScrollTo('how-it-works')}>
                  Food Hygiene Guidelines
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="fr-footer-bottom-bar">
          <div>
            © {new Date().getFullYear()} Food Rescue System. All rights reserved.
          </div>
          <div>
            Zero Edible Waste • Rapid Surplus Redistribution
          </div>
        </div>
      </div>
    </footer>
  );
}
