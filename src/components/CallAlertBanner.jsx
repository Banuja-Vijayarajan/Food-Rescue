import React from 'react';
import { PhoneCall, Sparkles, Volume2 } from 'lucide-react';

export default function CallAlertBanner({ onOpenCallSim }) {
  return (
    <div className="fr-call-alert-banner">
      <div className="fr-container">
        <div className="fr-call-alert-banner-inner">
          <div className="fr-call-alert-content">
            <span className="fr-call-alert-badge">
              <Sparkles size={12} /> New Feature
            </span>
            <span>
              <strong>Automated Instant Emergency Call & SMS Dispatch:</strong> When donors publish high-perishability surplus food, nearby verified organizations receive instant telephone ring alerts!
            </span>
          </div>
          <button 
            className="fr-call-alert-sim-btn"
            onClick={onOpenCallSim}
          >
            <PhoneCall size={14} /> Test Live Call Dispatch
          </button>
        </div>
      </div>
    </div>
  );
}
