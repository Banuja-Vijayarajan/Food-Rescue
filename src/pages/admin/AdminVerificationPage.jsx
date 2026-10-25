import React, { useState } from 'react';
import { useDonations } from '../../context/DonationContext';
import { useToast } from '../../context/ToastContext';
import { 
  ShieldCheck, CheckCircle2, XCircle, FileText, Building, 
  MapPin, Phone, Mail, Clock, Eye, AlertCircle, HelpCircle 
} from 'lucide-react';

export const AdminVerificationPage = () => {
  const { users, verifyOrganization } = useDonations();
  const toast = useToast();

  const [filterRole, setFilterRole] = useState('ALL'); // 'ALL' | 'donor' | 'recipient'
  const [filterStatus, setFilterStatus] = useState('Pending'); // 'Pending' | 'Verified' | 'Rejected' | 'ALL'
  const [selectedOrgForReview, setSelectedOrgForReview] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  const orgs = users.filter((u) => u.role === 'donor' || u.role === 'recipient');

  const filteredOrgs = orgs.filter((u) => {
    const matchesRole = filterRole === 'ALL' || u.role === filterRole;
    const matchesStatus = filterStatus === 'ALL' || u.verificationStatus === filterStatus;
    return matchesRole && matchesStatus;
  });

  const handleApprove = (orgId) => {
    verifyOrganization(orgId, 'Verified', adminNotes || 'Approved by UOV Food Rescue Administration');
    toast.success('Organization Verified', 'The organization is now licensed for live food matching.');
    setSelectedOrgForReview(null);
    setAdminNotes('');
  };

  const handleReject = (orgId) => {
    verifyOrganization(orgId, 'Rejected', adminNotes || 'Documentation does not meet verification requirements.');
    toast.info('Verification Rejected', 'Organization status updated to Rejected.');
    setSelectedOrgForReview(null);
    setAdminNotes('');
  };

  const handleRequestInfo = (orgId) => {
    toast.info('Information Requested', 'An email request for updated business registration papers has been logged.');
    setSelectedOrgForReview(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-brand-emerald" />
          <span>Organization Verification Queue</span>
        </h1>
        <p className="text-xs text-brand-sage dark:text-brand-sage light:text-slate-500 mt-0.5">
          Review legal registration, food safety certifications, and welfare credentials before granting matching privileges
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="p-4 rounded-2xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200 flex flex-wrap items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex items-center gap-2">
          {['Pending', 'Verified', 'Rejected', 'ALL'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterStatus === st
                  ? 'bg-amber-400 text-forest-950 font-bold shadow-sm'
                  : 'bg-forest-900/60 text-brand-sage hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-brand-sage">Role:</span>
          {['ALL', 'donor', 'recipient'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterRole === r
                  ? 'bg-brand-emerald text-forest-950 font-bold'
                  : 'bg-forest-900/40 text-brand-sage hover:text-white'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r === 'donor' ? 'Donors' : 'Recipients'}
            </button>
          ))}
        </div>

      </div>

      {/* Grid of Pending Orgs */}
      {filteredOrgs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-forest-850 border border-forest-700/60 text-brand-sage">
          <CheckCircle2 className="w-10 h-10 text-brand-emerald/40 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white">Queue Empty</h3>
          <p className="text-xs text-brand-sage">No organizations currently in "{filterStatus}" verification status.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrgs.map((org) => (
            <div
              key={org.id}
              className="p-6 rounded-3xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={org.avatar}
                  alt={org.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-emerald/30 flex-shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
                      {org.name}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      org.verificationStatus === 'Verified' ? 'bg-emerald-500/20 text-brand-lime' :
                      org.verificationStatus === 'Rejected' ? 'bg-rose-500/20 text-rose-300' :
                      'bg-amber-500/20 text-amber-300 animate-pulse'
                    }`}>
                      {org.verificationStatus}
                    </span>
                  </div>

                  <p className="text-xs text-brand-sage">
                    {org.organizationType} • {org.city}, {org.district}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-brand-sage pt-1">
                    <span className="font-mono text-white text-[11px]">ID: {org.regNumber || 'PV-89211/VAV'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-brand-emerald" />
                      {org.phone}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-brand-emerald" />
                      {org.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2.5 self-end lg:self-center">
                <button
                  onClick={() => setSelectedOrgForReview(org)}
                  className="px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-750 text-white text-xs font-semibold border border-forest-700 transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-emerald" />
                  <span>Review Dossier</span>
                </button>

                {org.verificationStatus !== 'Verified' && (
                  <button
                    onClick={() => handleApprove(org.id)}
                    className="px-4 py-2 rounded-xl bg-brand-emerald hover:bg-brand-emeraldHover text-forest-950 text-xs font-bold shadow-glow-emerald transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                {org.verificationStatus !== 'Rejected' && (
                  <button
                    onClick={() => handleReject(org.id)}
                    className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold border border-rose-500/30 transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Dossier Modal */}
      {selectedOrgForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-brand-emerald/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-lg font-bold text-white dark:text-white light:text-slate-900 mb-1">
              Organization Verification Dossier
            </h3>
            <p className="text-xs text-brand-sage dark:text-brand-sage light:text-slate-500 mb-4">
              Submitted legal & operational credentials for {selectedOrgForReview.name}
            </p>

            <div className="p-4 rounded-2xl bg-forest-900/80 border border-forest-750 text-xs space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-brand-sage">Role:</span>
                <span className="font-bold text-white uppercase">{selectedOrgForReview.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-sage">Business Reg / NGO ID:</span>
                <span className="font-mono text-brand-lime font-bold">{selectedOrgForReview.regNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-sage">Contact Representative:</span>
                <span className="text-white">{selectedOrgForReview.contactPerson}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-sage">Premises Address:</span>
                <span className="text-slate-200">{selectedOrgForReview.address}, {selectedOrgForReview.city}</span>
              </div>
              <div>
                <span className="text-brand-sage block mb-0.5">Submitted Mission:</span>
                <p className="text-slate-300 italic">{selectedOrgForReview.description}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-brand-sage block mb-1">
                Admin Evaluation Notes
              </label>
              <textarea
                rows={2}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Audit notes or reasons for approval / clarification..."
                className="w-full px-3.5 py-2 rounded-xl bg-forest-900 border border-forest-700 text-white text-xs focus:outline-none focus:border-brand-emerald resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-forest-750">
              <button
                type="button"
                onClick={() => handleRequestInfo(selectedOrgForReview.id)}
                className="px-3 py-2 rounded-xl bg-forest-800 text-brand-sage hover:text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Request More Info</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrgForReview(null)}
                  className="px-3.5 py-2 rounded-xl bg-forest-800 text-white text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleApprove(selectedOrgForReview.id)}
                  className="px-4 py-2 rounded-xl bg-brand-emerald hover:bg-brand-emeraldHover text-forest-950 font-bold text-xs shadow-glow-emerald"
                >
                  Approve Organization
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
