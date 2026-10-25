import React, { useState } from 'react';
import { useDonations } from '../../context/DonationContext';
import { useToast } from '../../context/ToastContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { 
  Package, Search, Filter, Clock, MapPin, Eye, 
  AlertTriangle, XCircle, ShieldCheck 
} from 'lucide-react';

export const AdminDonationsPage = ({ onNavigate }) => {
  const { donations, updateDonationStatus } = useDonations();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedDonationForCancel, setSelectedDonationForCancel] = useState(null);

  const filtered = donations.filter((d) => {
    const matchesStatus = selectedStatus === 'ALL' || d.status === selectedStatus;
    const matchesSearch = d.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.area.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleConfirmCancel = () => {
    if (!selectedDonationForCancel) return;
    updateDonationStatus(selectedDonationForCancel.id, 'Cancelled');
    toast.info('Donation Cancelled', `Donation ${selectedDonationForCancel.id} has been discontinued.`);
    setSelectedDonationForCancel(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight flex items-center gap-2.5">
          <Package className="w-6 h-6 text-brand-emerald" />
          <span>Platform Donation Monitoring</span>
        </h1>
        <p className="text-xs text-brand-sage dark:text-brand-sage light:text-slate-500 mt-0.5">
          Global audit and hygiene compliance oversight of all active and completed food postings
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-sage absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by food name, donor, or area..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-forest-900 dark:bg-forest-900 light:bg-slate-50 border border-forest-700 dark:border-forest-700 light:border-slate-300 text-white dark:text-white light:text-slate-900 text-xs focus:outline-none focus:border-brand-emerald"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'Available', 'Requested', 'Accepted', 'Pickup Scheduled', 'Collected', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedStatus === st
                  ? 'bg-brand-emerald dark:bg-brand-emerald light:bg-[#225235] text-forest-950 dark:text-forest-950 light:text-white font-bold shadow-sm'
                  : 'bg-forest-900/60 dark:bg-forest-900/60 light:bg-slate-100 text-brand-sage hover:text-white dark:hover:text-white light:hover:text-[#225235]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-forest-900/80 dark:bg-forest-900/80 light:bg-slate-50 border-b border-forest-750 dark:border-forest-750 light:border-slate-200 text-brand-sage dark:text-brand-sage light:text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">ID & Item</th>
                <th className="py-3.5 px-4">Donor Org</th>
                <th className="py-3.5 px-4">Quantity</th>
                <th className="py-3.5 px-4">Region</th>
                <th className="py-3.5 px-4">Expiry Window</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-750/50 dark:divide-forest-750/50 light:divide-slate-200 text-slate-200 dark:text-slate-200 light:text-slate-800">
              {filtered.map((food) => (
                <tr key={food.id} className="hover:bg-forest-800/40 dark:hover:bg-forest-800/40 light:hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={food.image} alt={food.foodName} className="w-9 h-9 rounded-xl object-cover ring-1 ring-brand-emerald/30" />
                      <div>
                        <span className="font-bold text-white dark:text-white light:text-slate-900 block truncate max-w-[180px]">{food.foodName}</span>
                        <span className="text-[10px] text-brand-sage font-mono">{food.id} • {food.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-semibold text-white dark:text-white light:text-slate-900">
                    {food.donorName}
                  </td>
                  <td className="py-4 px-4 font-bold text-brand-lime dark:text-brand-lime light:text-[#366816]">
                    {food.quantity} {food.unit}
                  </td>
                  <td className="py-4 px-4 text-brand-sage">
                    {food.area}
                  </td>
                  <td className="py-4 px-4 text-brand-sage">
                    <span className="flex items-center gap-1 text-[11px] text-brand-lime">
                      <Clock className="w-3.5 h-3.5" />
                      {food.availableUntil}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={food.status} size="sm" />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onNavigate(`#/donation/${food.id}`)}
                        className="px-3 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-750 text-brand-emerald font-semibold text-xs border border-forest-700"
                      >
                        Inspect
                      </button>

                      {food.status !== 'Completed' && food.status !== 'Cancelled' && (
                        <button
                          onClick={() => setSelectedDonationForCancel(food)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-semibold text-xs border border-rose-500/30"
                          title="Cancel posting due to safety concern"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!selectedDonationForCancel}
        onClose={() => setSelectedDonationForCancel(null)}
        onConfirm={handleConfirmCancel}
        title="Admin Intervention: Cancel Donation"
        message={`Are you sure you want to cancel ${selectedDonationForCancel?.foodName}? Both donor and matching organizations will be notified of administrative cancellation.`}
        confirmText="Cancel Donation"
        isDestructive={true}
      />

    </div>
  );
};
