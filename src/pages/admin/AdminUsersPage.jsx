import React, { useState } from 'react';
import { useDonations } from '../../context/DonationContext';
import { useToast } from '../../context/ToastContext';
import { 
  Users, Search, ShieldCheck, UserX, UserCheck, 
  Mail, Phone, MapPin, Building, Star 
} from 'lucide-react';

export const AdminUsersPage = () => {
  const { users, toggleUserSuspension, verifyOrganization } = useDonations();
  const toast = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const filteredUsers = users.filter((u) => {
    const matchesRole = selectedRole === 'ALL' || u.role === selectedRole;
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.city && u.city.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  const handleToggleSuspend = (u) => {
    toggleUserSuspension(u.id);
    toast.info(
      u.isSuspended ? 'Account Reactivated' : 'Account Suspended',
      `${u.name} status updated.`
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight flex items-center gap-2.5">
          <Users className="w-6 h-6 text-brand-emerald" />
          <span>User & Partner Directory</span>
        </h1>
        <p className="text-xs text-brand-sage dark:text-brand-sage light:text-slate-500 mt-0.5">
          Governance of registered food donors, community welfare recipients, and system operators
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-brand-sage absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by organization name, email, or city..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-forest-900 dark:bg-forest-900 light:bg-slate-50 border border-forest-700 dark:border-forest-700 light:border-slate-300 text-white dark:text-white light:text-slate-900 text-xs focus:outline-none focus:border-brand-emerald"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['ALL', 'donor', 'recipient', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedRole === r
                  ? 'bg-brand-emerald dark:bg-brand-emerald light:bg-[#225235] text-forest-950 dark:text-forest-950 light:text-white font-bold shadow-sm'
                  : 'bg-forest-900/60 dark:bg-forest-900/60 light:bg-slate-100 text-brand-sage hover:text-white dark:hover:text-white light:hover:text-[#225235]'
              }`}
            >
              {r === 'ALL' ? 'All Roles' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-forest-850 dark:bg-forest-850 light:bg-white border border-forest-700/60 dark:border-forest-700/60 light:border-slate-200 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-forest-900/80 dark:bg-forest-900/80 light:bg-slate-50 border-b border-forest-700/60 dark:border-forest-700/60 light:border-slate-200 text-brand-sage dark:text-brand-sage light:text-slate-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6">Entity</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-750/50 dark:divide-forest-750/50 light:divide-slate-200 text-slate-200 dark:text-slate-200 light:text-slate-800">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-forest-800/40 dark:hover:bg-forest-800/40 light:hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-brand-emerald/30" />
                      <div>
                        <span className="font-bold text-white dark:text-white light:text-slate-900 block">{u.name}</span>
                        <span className="text-[10px] text-brand-sage dark:text-brand-sage light:text-slate-500">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      u.role === 'donor' ? 'bg-emerald-500/15 text-brand-emerald border border-emerald-500/30' :
                      u.role === 'recipient' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' :
                      'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-brand-sage">
                    {u.city || 'Vavuniya'}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`text-[11px] font-semibold flex items-center gap-1 ${u.isVerified ? 'text-brand-lime' : 'text-amber-300'}`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {u.verificationStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {u.rating || 5.0}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.isSuspended ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-brand-lime'
                    }`}>
                      {u.isSuspended ? 'Suspended' : 'Active'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleSuspend(u)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          u.isSuspended
                            ? 'bg-emerald-500/20 text-brand-lime border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25'
                        }`}
                      >
                        {u.isSuspended ? 'Reactivate' : 'Suspend'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
