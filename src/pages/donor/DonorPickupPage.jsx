import React from 'react';
import { CalendarClock, MapPin, Phone, CheckCircle2, Truck } from 'lucide-react';
import { StatusBadge } from '../../components/donor/DonorShared';
import { DONOR_PICKUP_SCHEDULE } from '../../data/donorMockData';

export default function DonorPickupPage() {
  return (
    <div className="fr-dash-view">
      <div className="fr-page-header">
        <div>
          <h1 className="fr-page-title">Pickup Schedule</h1>
          <p className="fr-page-sub">Confirmed food collection appointments and logistics coordination</p>
        </div>
      </div>

      {DONOR_PICKUP_SCHEDULE.length === 0 ? (
        <div className="fr-section-card">
          <div className="fr-empty-state" style={{ padding:'60px' }}>
            <CalendarClock size={40} />
            <p>No upcoming pickups scheduled</p>
          </div>
        </div>
      ) : (
        <div className="fr-pickups-list">
          {DONOR_PICKUP_SCHEDULE.map(ps => (
            <div key={ps.id} className="fr-pickup-card">
              <div className="fr-pickup-header">
                <CalendarClock size={18} color="var(--fr-primary)" />
                <div>
                  <div className="fr-pickup-time">{ps.pickupTime}</div>
                  <div className="fr-pickup-portions">{ps.portions}</div>
                </div>
                <StatusBadge status={ps.status} />
              </div>
              <div className="fr-pickup-body">
                <div className="fr-pickup-meal">{ps.meal}</div>
                <div className="fr-pickup-details-grid">
                  <div className="fr-pickup-detail">
                    <span className="fr-detail-label">Recipient Organization</span>
                    <div className="fr-pickup-org">
                      <div className="fr-req-avatar small">{ps.avatar}</div>
                      {ps.recipient}
                    </div>
                  </div>
                  <div className="fr-pickup-detail">
                    <span className="fr-detail-label">Driver / Logistics</span>
                    <div>{ps.driver}</div>
                    <div className="fr-detail-phone"><Phone size={12} /> {ps.driverPhone}</div>
                  </div>
                  <div className="fr-pickup-detail">
                    <span className="fr-detail-label">Distance</span>
                    <div><MapPin size={13} color="var(--fr-primary)" /> {ps.distance} away</div>
                  </div>
                </div>
              </div>
              <div className="fr-pickup-footer">
                <button className="fr-btn fr-btn-secondary fr-btn-sm"><Phone size={14} /> Call Driver</button>
                <button className="fr-btn fr-btn-primary fr-btn-sm"><CheckCircle2 size={14} /> Mark as Collected</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
