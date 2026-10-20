import React, { useState, useEffect } from 'react';
import '../styles/components.css';
import { PhoneCall, PhoneForwarded, PhoneOff, CheckCircle2, Volume2, Clock, X } from 'lucide-react';

export default function CallAlertSimulationModal({ isOpen, onClose, onMealPosted }) {
  const [simState, setSimState] = useState('idle'); // 'idle', 'posting', 'calling', 'answered', 'confirmed'
  const [targetOrg] = useState('Child Care & Welfare Center');
  const [targetPhone] = useState('+94 71 987 6543');
  const [foodTitle] = useState('Hot Chicken Biryani & Curries (45 portions)');
  const [callTimer, setCallTimer] = useState(0);

  useEffect(() => {
    let timer;
    if (simState === 'calling' || simState === 'answered') {
      timer = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(timer);
  }, [simState]);

  if (!isOpen) return null;

  const handleStartSim = () => {
    setSimState('posting');
    setTimeout(() => {
      setSimState('calling');
    }, 1200);
  };

  const handleAnswerCall = () => {
    setSimState('answered');
  };

  const handleConfirmOrder = () => {
    setSimState('confirmed');
    if (onMealPosted) {
      onMealPosted({
        title: foodTitle,
        donorName: 'Green Leaf Hotel & Banquets',
        portions: '45 portions',
        recipient: targetOrg
      });
    }
  };

  const handleReset = () => {
    setSimState('idle');
  };

  return (
    <div className="fr-modal-backdrop" onClick={onClose}>
      <div className="fr-call-sim-modal" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            color: '#A7C4BA',
            cursor: 'pointer'
          }}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {simState === 'idle' && (
          <div>
            <div className="fr-sim-radar">
              <PhoneCall size={36} color="#19C37D" />
            </div>
            <h3 style={{ fontSize: '1.4rem', color: '#F5FAF7', marginBottom: '8px' }}>
              Donor Post → Auto Call Dispatch
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#A7C4BA', marginBottom: '20px', lineHeight: 1.5 }}>
              This simulates the automated voice call triggered to nearby recipient shelters when a donor submits emergency surplus food.
            </p>

            <div style={{ 
              background: '#14463C', 
              padding: '16px', 
              borderRadius: '12px', 
              textAlign: 'left',
              fontSize: '0.84rem',
              marginBottom: '22px',
              border: '1px solid rgba(25, 195, 125, 0.2)'
            }}>
              <div style={{ marginBottom: '8px', color: '#A3E635', fontWeight: '700' }}>
                Simulated Event:
              </div>
              <div style={{ color: '#F5FAF7', marginBottom: '4px' }}>
                <strong>Donor:</strong> Green Leaf Hotel & Banquets
              </div>
              <div style={{ color: '#F5FAF7', marginBottom: '4px' }}>
                <strong>Surplus:</strong> {foodTitle}
              </div>
              <div style={{ color: '#A7C4BA' }}>
                <strong>Nearest Recipient to Call:</strong> {targetOrg} ({targetPhone})
              </div>
            </div>

            <button 
              type="button"
              className="fr-btn fr-btn-primary" 
              style={{ width: '100%', padding: '12px' }}
              onClick={handleStartSim}
            >
              <PhoneCall size={16} /> Publish Food & Trigger Automated Call
            </button>
          </div>
        )}

        {simState === 'posting' && (
          <div style={{ padding: '30px 0' }}>
            <div className="fr-sim-radar">
              <Clock size={36} color="#A3E635" />
            </div>
            <h3 style={{ color: '#F5FAF7', marginBottom: '8px' }}>
              Publishing Surplus Food...
            </h3>
            <p style={{ color: '#A7C4BA', fontSize: '0.88rem' }}>
              Locating verified organizations within 5 km radius...
            </p>
          </div>
        )}

        {simState === 'calling' && (
          <div>
            <div className="fr-phone-ringing-animation">
              <PhoneCall size={28} />
            </div>
            <span style={{ 
              background: 'rgba(163, 230, 53, 0.2)', 
              color: '#A3E635', 
              padding: '3px 10px', 
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: '800'
            }}>
              OUTGOING AUTOMATED IVR CALL
            </span>
            <h3 style={{ color: '#F5FAF7', marginTop: '10px', marginBottom: '4px', fontSize: '1.3rem' }}>
              Ringing {targetOrg}...
            </h3>
            <p style={{ color: '#A7C4BA', fontSize: '0.84rem', marginBottom: '18px' }}>
              Number: {targetPhone} • Ringing ({callTimer}s)
            </p>

            <div style={{ 
              background: '#0e382f', 
              padding: '14px', 
              borderRadius: '10px', 
              fontSize: '0.8rem',
              color: '#E0EFEA',
              marginBottom: '20px'
            }}>
              <Volume2 size={16} style={{ display: 'inline', marginRight: '6px', color: '#19C37D' }} />
              <em>Simulating phone ringing at recipient shelter manager's phone...</em>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button 
                type="button"
                className="fr-btn fr-btn-primary" 
                onClick={handleAnswerCall}
              >
                <PhoneForwarded size={16} /> Simulate Answer
              </button>
              <button 
                type="button"
                className="fr-btn fr-btn-secondary" 
                onClick={handleReset}
              >
                <PhoneOff size={16} /> Cancel
              </button>
            </div>
          </div>
        )}

        {simState === 'answered' && (
          <div>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#19C37D',
              color: '#0B2E26',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto',
              fontWeight: '800'
            }}>
              <Volume2 size={30} />
            </div>
            <span style={{ 
              background: 'rgba(25, 195, 125, 0.2)', 
              color: '#19C37D', 
              padding: '3px 10px', 
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: '800'
            }}>
              CALL CONNECTED • {Math.floor(callTimer / 60)}:{callTimer % 60 < 10 ? '0' : ''}{callTimer % 60}
            </span>
            <h3 style={{ color: '#F5FAF7', marginTop: '8px', marginBottom: '12px' }}>
              Automated Voice Message Playing
            </h3>

            {/* Voice Transcription */}
            <div style={{
              background: '#14463C',
              border: '1px solid rgba(25, 195, 125, 0.4)',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '0.84rem',
              textAlign: 'left',
              color: '#F5FAF7',
              lineHeight: 1.5,
              marginBottom: '20px'
            }}>
              <p style={{ fontStyle: 'italic', color: '#A3E635', marginBottom: '8px', fontWeight: '600' }}>
                "Hello, this is the Food Rescue automated emergency alert. Green Leaf Hotel has just published 45 portions of hot chicken biryani and curries. Safe consumption window is 2 hours. Press 1 to claim portions, or 2 to decline."
              </p>
              <div style={{ fontSize: '0.75rem', color: '#A7C4BA', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px' }}>
                Automated IVR Phone Dispatch Engine
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '10px' }}>
              <button 
                type="button"
                className="fr-btn fr-btn-accent"
                onClick={handleConfirmOrder}
              >
                <CheckCircle2 size={16} /> Press 1: Claim Food
              </button>
              <button 
                type="button"
                className="fr-btn fr-btn-secondary"
                onClick={handleReset}
              >
                Press 2: Pass
              </button>
            </div>
          </div>
        )}

        {simState === 'confirmed' && (
          <div>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#A3E635',
              color: '#0B2E26',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ color: '#F5FAF7', marginBottom: '8px', fontSize: '1.4rem' }}>
              Call Accepted & Portions Claimed!
            </h3>
            <p style={{ color: '#A7C4BA', fontSize: '0.88rem', marginBottom: '20px' }}>
              {targetOrg} acknowledged the call alert. Pickup route dispatched to logistics coordinator.
            </p>

            <div style={{
              background: '#14463C',
              padding: '14px',
              borderRadius: '10px',
              textAlign: 'left',
              fontSize: '0.82rem',
              color: '#E0EFEA',
              marginBottom: '22px'
            }}>
              <div>✓ SMS confirmation sent with pickup QR verification code</div>
              <div>✓ Safe consumption countdown locked: 1 hr 55 mins left</div>
              <div>✓ Zero edible food wasted tonight!</div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button"
                className="fr-btn fr-btn-primary" 
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Done / Return to Platform
              </button>
              <button 
                type="button"
                className="fr-btn fr-btn-secondary" 
                onClick={handleReset}
              >
                Test Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
