import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDonations } from '../../context/DonationContext';
import { 
  ShieldCheck, Users, Hotel, HeartHandshake, Package, 
  CheckCircle2, Inbox, Scale, Leaf, ArrowRight, BarChart3, 
  TrendingUp, AlertCircle, FileCheck 
} from 'lucide-react';

export const AdminDashboardPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const { users, donations, requests, stats } = useDonations();

  const donors = users.filter((u) => u.role === 'donor');
  const recipients = users.filter((u) => u.role === 'recipient');
  const pendingVerifications = users.filter((u) => u.verificationStatus === 'Pending');
  const activeDonations = donations.filter((d) => ['Available', 'Partially Claimed', 'Requested', 'Accepted', 'Pickup Scheduled', 'Collected'].includes(d.status));
  const completedDonations = donations.filter((d) => d.status === 'Completed');

  // Categories breakdown
  const categoryCounts = donations.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Admin Banner */}
      <div className="p-6 sm:p-8 rounded-3xl dark:bg-gradient-to-r dark:from-forest-850 dark:via-forest-800 dark:to-forest-850 light:bg-gradient-to-r light:from-white light:via-slate-50 light:to-white border border-amber-500/30 dark:border-amber-500/30 light:border-slate-200 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 dark:text-amber-300 light:text-amber-700 text-xs font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Administration & Compliance Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              Food Rescue Central Operations
            </h1>
            <p className="text-sm text-brand-sage dark:text-brand-sage light:text-slate-600 mt-1 max-w-xl">
              Supervising hygiene certification, organization authenticity, and equitable food distribution in Northern Province.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('#/admin/verification')}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-forest-950 font-bold text-xs shadow-lg transition-all flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Verification Queue ({pendingVerifications.length})</span>
            </button>
            <button
              onClick={() => onNavigate('#/admin/reports')}
              className="px-4 py-3 rounded-xl dark:bg-forest-800/80 light:bg-slate-100 hover:dark:bg-forest-750 hover:light:bg-slate-200 dark:text-white light:text-slate-900 border border-forest-700 dark:border-forest-700 light:border-slate-200 font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4 text-brand-lime dark:text-brand-lime light:text-emerald-700" />
              <span>Impact Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="p-4 rounded-2xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200">
          <span className="text-[11px] text-brand-sage block">Total Accounts</span>
          <span className="text-2xl font-black text-white dark:text-white light:text-slate-900 mt-1 block">
            {users.length}
          </span>
          <span className="text-[10px] text-brand-emerald">Registered</span>
        </div>

        <div className="p-4 rounded-2xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200">
          <span className="text-[11px] text-brand-sage block">Verified Donors</span>
          <span className="text-2xl font-black text-brand-emerald mt-1 block">
            {donors.filter((d) => d.isVerified).length}
          </span>
          <span className="text-[10px] text-brand-sage">Hotels & Caterers</span>
        </div>

        <div className="p-4 rounded-2xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200">
          <span className="text-[11px] text-brand-sage block">Verified Shelters</span>
          <span className="text-2xl font-black text-cyan-400 mt-1 block">
            {recipients.filter((r) => r.isVerified).length}
          </span>
          <span className="text-[10px] text-brand-sage">NGOs & Orphanages</span>
        </div>

        <div className="p-4 rounded-2xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200">
          <span className="text-[11px] text-brand-sage block">Active Surplus</span>
          <span className="text-2xl font-black text-brand-lime mt-1 block">
            {activeDonations.length}
          </span>
          <span className="text-[10px] text-brand-lime">Live in market</span>
        </div>

        <div className="p-4 rounded-2xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200">
          <span className="text-[11px] text-brand-sage block">Completed Missions</span>
          <span className="text-2xl font-black text-white dark:text-white light:text-slate-900 mt-1 block">
            {stats.completedCount}
          </span>
          <span className="text-[10px] text-brand-emerald">Zero Waste</span>
        </div>

        <div className="p-4 rounded-2xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200">
          <span className="text-[11px] text-brand-sage block">Pending Approvals</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block">
            {pendingVerifications.length}
          </span>
          <span className="text-[10px] text-amber-300">Action Required</span>
        </div>

      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Chart: Weekly Redistribution Volume */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-emerald" />
                Redistributed Portions Over Time
              </h3>
              <p className="text-xs text-brand-sage">Portions rescued weekly across Vavuniya & Northern Province</p>
            </div>
            <span className="text-xs font-mono font-bold text-brand-lime">+24% vs Last Month</span>
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="h-56 w-full flex items-end justify-between gap-3 pt-6 px-2 border-b border-forest-750 dark:border-forest-750 light:border-slate-200">
            {[
              { day: 'Mon', count: 180, height: '45%' },
              { day: 'Tue', count: 240, height: '60%' },
              { day: 'Wed', count: 210, height: '52%' },
              { day: 'Thu', count: 320, height: '78%' },
              { day: 'Fri', count: 390, height: '90%' },
              { day: 'Sat', count: 420, height: '100%', highlight: true },
              { day: 'Sun', count: 360, height: '84%' },
            ].map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-mono text-brand-sage group-hover:text-brand-lime mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.count}
                </span>
                <div 
                  className={`w-full rounded-t-xl transition-all duration-500 ${
                    bar.highlight ? 'bg-gradient-to-t from-brand-emerald to-brand-lime shadow-glow-lime' : 'dark:bg-forest-750 light:bg-slate-200 hover:bg-brand-emerald/70'
                  }`}
                  style={{ height: bar.height }}
                />
                <span className="text-xs text-brand-sage mt-2 font-medium">{bar.day}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-brand-sage pt-1">
            <span>Peak Day: Saturday Banquet Surplus (420 Portions)</span>
            <span className="text-brand-lime dark:text-brand-lime light:text-emerald-700 font-bold">1,480 Total Portions Rescued</span>
          </div>
        </div>

        {/* Right Chart: Food Category Distribution */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900 mb-1">
              Surplus Categories
            </h3>
            <p className="text-xs text-brand-sage">Proportion of donated items by food group</p>
          </div>

          <div className="space-y-3 py-2 text-xs">
            {[
              { label: 'Prepared meals / Rice & Curry', pct: 54, color: 'bg-brand-emerald' },
              { label: 'Bakery items & Buns', pct: 22, color: 'bg-brand-lime' },
              { label: 'Fresh Fruits & Produce', pct: 14, color: 'bg-cyan-400' },
              { label: 'Vegetables & Dry Rations', pct: 10, color: 'bg-amber-400' },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-slate-200 dark:text-slate-200 light:text-slate-700">
                  <span className="truncate">{item.label}</span>
                  <span className="font-bold text-white dark:text-white light:text-slate-900">{item.pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full dark:bg-forest-900 light:bg-slate-200 overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl dark:bg-forest-900/80 light:bg-slate-50 border border-forest-750 dark:border-forest-750 light:border-slate-200 text-xs">
            <span className="font-semibold text-brand-lime dark:text-brand-lime light:text-emerald-700 block mb-1">Environmental Benefit</span>
            <p className="text-brand-sage dark:text-brand-sage light:text-slate-600 text-[11px] leading-relaxed">
              Redirecting 1,480 meals averted ~1,390 kg of CO₂ equivalent emissions in municipal landfill sectors.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
