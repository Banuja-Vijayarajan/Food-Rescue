import React from 'react';
import { CheckCircle2, Clock, Truck } from 'lucide-react';

// Shared StatusBadge used across all donor pages
export function StatusBadge({ status }) {
  const map = {
    Available:  { cls: 'badge-available', Icon: CheckCircle2, label: 'Available' },
    Requested:  { cls: 'badge-requested', Icon: Clock,         label: 'Requested' },
    Accepted:   { cls: 'badge-accepted',  Icon: Truck,         label: 'Accepted' },
    Collected:  { cls: 'badge-collected', Icon: CheckCircle2, label: 'Collected' },
    completed:  { cls: 'badge-collected', Icon: CheckCircle2, label: 'Completed' },
    confirmed:  { cls: 'badge-accepted',  Icon: Truck,         label: 'Confirmed' },
    pending:    { cls: 'badge-requested', Icon: Clock,         label: 'Pending' },
    accepted:   { cls: 'badge-accepted',  Icon: CheckCircle2, label: 'Accepted' },
  };
  const s = map[status] || map['Available'];
  const Icon = s.Icon;
  return (
    <span className={`fr-status-badge ${s.cls}`}>
      <Icon size={11} />
      {s.label}
    </span>
  );
}
