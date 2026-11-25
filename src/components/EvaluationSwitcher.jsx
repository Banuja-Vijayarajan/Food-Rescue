import React, { useState } from 'react';
import '../styles/components.css';
import { ChevronUp, ChevronDown, User, HeartHandshake, ShieldCheck, Eye } from 'lucide-react';

export default function EvaluationSwitcher({ currentRole, setCurrentRole, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    {
      id: 'visitor',
      name: 'Visitor / Guest',
      icon: Eye,
      description: 'Public discovery & marketplace view'
    },
    {
      id: 'donor',
      name: 'Food Donor',
      subtitle: 'Hotel Green Leaf & Banquets',
      icon: HeartHandshake,
      description: 'Post surplus & view calls'
    },
    {
      id: 'recipient',
      name: 'Recipient Organization',
      subtitle: 'Child Care & Welfare Center',
      icon: User,
      description: 'Browse & request portions'
    },
    {
      id: 'admin',
      name: 'Administrator',
      subtitle: 'Operations Central Desk',
      icon: ShieldCheck,
      description: 'Verify partners & platform logs'
    }
  ];

  const currentRoleObj = roles.find(r => r.id === currentRole) || roles[0];

  return (
    <div className="fr-eval-switcher-wrap">
      {isOpen && (
        <div className="fr-eval-menu">
          <div className="fr-eval-menu-title">
            Switch Active Role View
          </div>
          {roles.map(r => {
            const Icon = r.icon;
            const isSelected = currentRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                className={`fr-eval-option ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setCurrentRole(r.id);
                  setIsOpen(false);
                }}
              >
                <Icon size={16} color={isSelected ? 'var(--fr-primary)' : 'inherit'} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{r.name}</span>
                  {r.subtitle && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--fr-text-muted)' }}>
                      {r.subtitle}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Floating Pill Trigger */}
      <div 
        className="fr-eval-pill-trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Role Switcher"
      >
        <span className="fr-eval-dot"></span>
        <span>Role: <strong style={{ color: 'var(--fr-primary)' }}>{currentRoleObj.name}</strong></span>
        {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </div>
    </div>
  );
}
