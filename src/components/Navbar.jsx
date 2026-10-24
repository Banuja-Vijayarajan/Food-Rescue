import React, { useState, useEffect } from 'react';
import '../styles/navbar.css';
import { Sun, Moon, Utensils, LogIn, UserPlus, LogOut, PlusCircle, HeartHandshake } from 'lucide-react';

export default function Navbar({ 
  currentPage, 
  setCurrentPage, 
  theme, 
  toggleTheme, 
  currentRole, 
  setCurrentRole,
  onOpenCallSim 
}) {
  const [activeSection, setActiveSection] = useState('home');

  const getRoleDisplayName = () => {
    switch (currentRole) {
      case 'donor':
        return 'Hotel Green Leaf (Donor)';
      case 'recipient':
        return 'Child Care (Recipient)';
      case 'admin':
        return 'Central Administrator';
      default:
        return null;
    }
  };

  // Track active section on scroll
  useEffect(() => {
    if (currentPage !== 'home') return;

    const sections = ['home', 'how-it-works', 'available-food', 'impact', 'about'];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  // Handle smooth scroll navigation
  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="fr-navbar">
      <div className="fr-container">
        <div className="fr-navbar-inner">
          {/* Brand Logo */}
          <div className="fr-brand" onClick={() => handleNavClick('home')}>
            <div className="fr-brand-logo-icon">
              <Utensils size={22} strokeWidth={2.4} />
            </div>
            <div className="fr-brand-titles">
              <span className="fr-brand-title">
                Food Rescue <span className="fr-brand-pulse-dot" title="Live System Online"></span>
              </span>
              <span className="fr-brand-subtitle">Smart Surplus Redistribution</span>
            </div>
          </div>

          {/* Navigation Links in exact order */}
          <nav>
            <ul className="fr-nav-menu">
              <li>
                <button 
                  type="button"
                  className={`fr-nav-link ${currentPage === 'home' && activeSection === 'home' ? 'active' : ''}`}
                  onClick={() => handleNavClick('home')}
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  className={`fr-nav-link ${currentPage === 'home' && activeSection === 'how-it-works' ? 'active' : ''}`}
                  onClick={() => handleNavClick('how-it-works')}
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  className={`fr-nav-link ${currentPage === 'home' && activeSection === 'available-food' ? 'active' : ''}`}
                  onClick={() => handleNavClick('available-food')}
                >
                  Available Food
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  className={`fr-nav-link ${currentPage === 'home' && activeSection === 'impact' ? 'active' : ''}`}
                  onClick={() => handleNavClick('impact')}
                >
                  Impact
                </button>
              </li>
              <li>
                <button 
                  type="button"
                  className={`fr-nav-link ${currentPage === 'home' && activeSection === 'about' ? 'active' : ''}`}
                  onClick={() => handleNavClick('about')}
                >
                  About
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`fr-nav-link ${currentPage === 'organizations' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('organizations')}
                >
                  Organisations
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`fr-nav-link ${currentRole === 'recipient' ? 'active' : ''}`}
                  style={{ color: 'var(--fr-primary)', fontWeight: 700 }}
                  onClick={() => setCurrentRole('recipient')}
                  title="Open Recipient Welfare Organization Portal"
                >
                  Recipient Portal
                </button>
              </li>
            </ul>
          </nav>

          {/* Right Actions: Theme Toggle, Auth Buttons */}
          <div className="fr-navbar-actions">
            {/* Theme Toggle Button */}
            <button 
              type="button"
              className="fr-theme-toggle" 
              onClick={toggleTheme} 
              title={theme === 'dark' ? 'Switch to Eco Sage Light Mode' : 'Switch to Deep Forest Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* If logged in with an active demo role */}
            {currentRole !== 'visitor' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ 
                  fontSize: '0.82rem', 
                  fontWeight: '700', 
                  color: 'var(--fr-primary)',
                  background: 'var(--fr-bg-subtle)',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  border: '1px solid var(--fr-border-card)'
                }}>
                  {getRoleDisplayName()}
                </span>
                {currentRole === 'donor' && (
                  <button 
                    type="button"
                    className="fr-btn fr-btn-accent"
                    onClick={onOpenCallSim}
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  >
                    <PlusCircle size={15} /> Post Surplus
                  </button>
                )}
                {currentRole === 'recipient' && (
                  <button 
                    type="button"
                    className="fr-btn fr-btn-primary"
                    onClick={() => setCurrentRole('recipient')}
                    style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                  >
                    <Utensils size={15} /> Recipient Portal
                  </button>
                )}
                <button 
                  type="button"
                  className="fr-btn fr-btn-secondary" 
                  onClick={() => setCurrentRole('visitor')}
                  style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  title="Sign out to Visitor"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <>
                <button 
                  type="button"
                  className={`fr-btn fr-btn-ghost ${currentPage === 'login' ? 'active' : ''}`}
                  onClick={() => setCurrentPage('login')}
                >
                  <LogIn size={16} /> Login
                </button>
                <button 
                  type="button"
                  className="fr-btn fr-btn-primary"
                  onClick={() => setCurrentPage('register')}
                >
                  <UserPlus size={16} /> Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
