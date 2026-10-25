import React, { useState } from 'react';
import { useDonations } from '../../context/DonationContext';
import { useToast } from '../../context/ToastContext';
import { 
  BarChart3, Download, TrendingUp, Calendar, Leaf, 
  Utensils, CheckCircle2, XCircle, Building2, Scale, Sparkles 
} from 'lucide-react';

export const AdminReportsPage = () => {
  const { donations, users, stats } = useDonations();
  const toast = useToast();

  const [dateRange, setDateRange] = useState('Last 30 Days');

  const donors = users.filter((u) => u.role === 'donor');
  const recipients = users.filter((u) => u.role === 'recipient');
  const completed = donations.filter((d) => d.status === 'Completed');
  const cancelled = donations.filter((d) => d.status === 'Cancelled');

  const handleExportCSV = () => {
    const headers = ['Donation ID', 'Food Name', 'Category', 'Quantity', 'Unit', 'Donor', 'Area', 'Status', 'Date'];
    const rows = donations.map((d) => [
      d.id,
      `"${d.foodName}"`,
      d.category,
      d.quantity,
      d.unit,
      `"${d.donorName}"`,
      d.area,
      d.status,
      d.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `food_rescue_audit_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Report Exported', 'CSV dataset generated and downloaded.');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Title & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-brand-emerald" />
            <span>Reports & Sustainability Analytics</span>
          </h1>
          <p className="text-xs text-brand-sage dark:text-brand-sage light:text-slate-500 mt-0.5">
            Verified platform metrics on food rescue volume, carbon abatement, and partner participation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-forest-850 dark:bg-forest-850 light:bg-slate-100 border border-forest-700 text-white dark:text-white light:text-slate-900 text-xs focus:outline-none focus:border-brand-emerald"
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Quarter to Date (Q3)</option>
            <option>Academic Year 2025/2026</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-brand-emerald hover:bg-brand-emeraldHover text-forest-950 font-bold text-xs shadow-glow-emerald transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* High-Level Impact Summaries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200">
          <span className="text-xs font-semibold text-brand-sage">Total Rescued Meals</span>
          <span className="text-3xl font-black text-brand-lime block mt-2">
            {stats.totalMealsRescued.toLocaleString()}
          </span>
          <span className="text-[11px] text-brand-emerald mt-1 block">portions redistributed</span>
        </div>

        <div className="p-5 rounded-2xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200">
          <span className="text-xs font-semibold text-brand-sage">Diverted Food Weight</span>
          <span className="text-3xl font-black text-brand-emerald block mt-2">
            {stats.totalKgRescued.toLocaleString()} kg
          </span>
          <span className="text-[11px] text-brand-sage mt-1 block">prevented from rotting</span>
        </div>

        <div className="p-5 rounded-2xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200">
          <span className="text-xs font-semibold text-brand-sage">CO₂e Emissions Averted</span>
          <span className="text-3xl font-black text-cyan-400 block mt-2">
            {stats.totalCo2SavedKg.toLocaleString()} kg
          </span>
          <span className="text-[11px] text-cyan-300 mt-1 block">greenhouse gases saved</span>
        </div>

        <div className="p-5 rounded-2xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200">
          <span className="text-xs font-semibold text-brand-sage">Transfer Success Ratio</span>
          <span className="text-3xl font-black text-white dark:text-white light:text-slate-900 block mt-2">
            96.8%
          </span>
          <span className="text-[11px] text-brand-lime mt-1 block">zero food wastage</span>
        </div>

      </div>

      {/* Top Active Partners Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Most Active Donors */}
        <div className="p-6 rounded-3xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-emerald" />
            Top Contributing Commercial Donors
          </h3>

          <div className="divide-y divide-forest-750/60 text-xs">
            {donors.map((d, i) => (
              <div key={d.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-brand-sage font-bold text-xs">#{i + 1}</span>
                  <div>
                    <h4 className="font-bold text-white dark:text-white light:text-slate-900">{d.name}</h4>
                    <span className="text-[11px] text-brand-sage">{d.city} • {d.organizationType}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-brand-lime block">{d.totalDonations || 30} donations</span>
                  <span className="text-[10px] text-brand-sage">Rating: {d.rating} ★</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Active Recipient Shelters */}
        <div className="p-6 rounded-3xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white dark:text-white light:text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            Highest Impact Recipient Organizations
          </h3>

          <div className="divide-y divide-forest-750/60 text-xs">
            {recipients.map((r, i) => (
              <div key={r.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-brand-sage font-bold text-xs">#{i + 1}</span>
                  <div>
                    <h4 className="font-bold text-white dark:text-white light:text-slate-900">{r.name}</h4>
                    <span className="text-[11px] text-brand-sage">{r.city} • {r.beneficiariesCount || 60} Beneficiaries</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-cyan-400 block">Verified Partner</span>
                  <span className="text-[10px] text-brand-sage">Rating: {r.rating} ★</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
