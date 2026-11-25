import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  ShieldAlert,
  Building2,
  HeartHandshake,
  Truck,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  FileText,
  AlertCircle
} from 'lucide-react';
import { INITIAL_ADMIN_USERS } from '../../data/adminMockData';

export default function AdminUsersPage() {
  const [users, setUsers] = useState(INITIAL_ADMIN_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    orgName: '',
    role: 'donor',
    roleLabel: 'Food Donor',
    email: '',
    phone: '',
    district: 'Vavuniya',
    address: '',
    regNumber: '',
    phiCertificate: '',
    status: 'Active',
    verified: true,
    category: 'Hotel & Catering',
    contactPerson: '',
  });

  const showToast = (msg, type = 'success') => {
    setFeedbackToast({ msg, type });
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.orgName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.regNumber || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesDistrict = districtFilter === 'all' || user.district === districtFilter;

      return matchesSearch && matchesRole && matchesStatus && matchesDistrict;
    });
  }, [users, searchQuery, roleFilter, statusFilter, districtFilter]);

  // Handle status toggle (e.g. Suspend or Activate)
  const handleToggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    showToast(`User status updated to ${newStatus}!`);
  };

  // Handle toggle verification badge
  const handleToggleVerification = (userId, currentVerified) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: !currentVerified } : u));
    showToast(`Verification status toggled for user!`);
  };

  // Handle update user
  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUsers(prev => prev.map(u => u.id === selectedUser.id ? selectedUser : u));
    setEditModalOpen(false);
    showToast(`User ${selectedUser.orgName || selectedUser.name} updated successfully!`);
  };

  // Handle create user
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      showToast('Please fill in required fields.', 'error');
      return;
    }
    const created = {
      ...newUser,
      id: `usr-${Date.now()}`,
      totalActivity: 0,
      joinedDate: 'Just now',
      rating: 5.0,
      roleLabel: newUser.role === 'donor' ? 'Food Donor' : newUser.role === 'recipient' ? 'Recipient Organization' : newUser.role === 'delivery' ? 'Delivery Partner' : 'System Administrator'
    };
    setUsers([created, ...users]);
    setCreateModalOpen(false);
    setNewUser({
      name: '',
      orgName: '',
      role: 'donor',
      roleLabel: 'Food Donor',
      email: '',
      phone: '',
      district: 'Vavuniya',
      address: '',
      regNumber: '',
      phiCertificate: '',
      status: 'Active',
      verified: true,
      category: 'Hotel & Catering',
      contactPerson: '',
    });
    showToast(`New user "${created.orgName || created.name}" registered successfully!`);
  };

  // Export users to CSV
  const handleExportCSV = () => {
    const headers = ['ID,Name,Organization,Role,Email,Phone,District,Status,Verified,JoinedDate,Rating\n'];
    const rows = filteredUsers.map(u =>
      `"${u.id}","${u.name}","${u.orgName}","${u.role}","${u.email}","${u.phone}","${u.district}","${u.status}","${u.verified}","${u.joinedDate}","${u.rating}"\n`
    );
    const blob = new Blob([headers.concat(rows).join('')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food_rescue_users_${Date.now()}.csv`;
    a.click();
    showToast('User directory exported to CSV.');
  };

  return (
    <div className="fr-admin-users-page">
      {/* Toast Notification */}
      {feedbackToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          background: feedbackToast.type === 'error' ? 'var(--fr-danger)' : 'var(--fr-primary)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          fontWeight: 700,
          fontSize: '0.86rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} /> {feedbackToast.msg}
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="fr-admin-card-header" style={{ marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--fr-text-heading)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Users size={24} color="var(--fr-primary)" />
            Platform User & Organization Management
          </h1>
          <p style={{ color: 'var(--fr-text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
            Manage registered food donors, recipient welfare shelters, volunteer riders, and administrator privileges
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            className="fr-table-btn"
            onClick={handleExportCSV}
          >
            <Download size={15} /> Export CSV
          </button>
          <button
            type="button"
            className="fr-table-btn primary"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus size={16} /> Add New Organization
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="fr-admin-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1 1 240px', minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--fr-text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name, organization, email or reg no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="fr-admin-search-input"
              style={{ width: '100%' }}
            />
          </div>

          {/* Role Filter */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="fr-form-select"
              style={{ padding: '8px 12px', fontSize: '0.84rem' }}
            >
              <option value="all">All Roles (All Users)</option>
              <option value="donor">Food Donors</option>
              <option value="recipient">Recipient Organizations</option>
              <option value="delivery">Delivery Partners</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ minWidth: '140px' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="fr-form-select"
              style={{ padding: '8px 12px', fontSize: '0.84rem' }}
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* District Filter */}
          <div style={{ minWidth: '140px' }}>
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="fr-form-select"
              style={{ padding: '8px 12px', fontSize: '0.84rem' }}
            >
              <option value="all">All Districts</option>
              <option value="Vavuniya">Vavuniya</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Kilinochchi">Kilinochchi</option>
              <option value="Mannar">Mannar</option>
              <option value="Anuradhapura">Anuradhapura</option>
            </select>
          </div>

          <div style={{ marginLeft: 'auto', fontSize: '0.82rem', color: 'var(--fr-text-muted)', fontWeight: 600 }}>
            Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> records
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="fr-admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="fr-admin-table-wrap" style={{ border: 'none' }}>
          <table className="fr-admin-table">
            <thead>
              <tr>
                <th>Organization / Name</th>
                <th>Role</th>
                <th>Contact Details</th>
                <th>District / Location</th>
                <th>Status</th>
                <th>Verification</th>
                <th>Activity</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => {
                const isDonor = user.role === 'donor';
                const isRecipient = user.role === 'recipient';
                const isDelivery = user.role === 'delivery';

                return (
                  <tr key={user.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '8px',
                          background: isDonor ? 'linear-gradient(135deg, #10b981, #047857)' :
                            isRecipient ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' :
                            isDelivery ? 'linear-gradient(135deg, #f59e0b, #d97706)' :
                            'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '0.85rem'
                        }}>
                          {user.orgName ? user.orgName.substring(0, 2).toUpperCase() : user.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--fr-text-heading)' }}>
                            {user.orgName || user.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>
                            {user.regNumber || 'Direct User'} • Joined {user.joinedDate}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`fr-role-pill fr-role-${user.role}`}>
                        {isDonor && <Building2 size={12} />}
                        {isRecipient && <HeartHandshake size={12} />}
                        {isDelivery && <Truck size={12} />}
                        {user.roleLabel}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--fr-text-heading)' }}>{user.email}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--fr-text-muted)' }}>{user.phone}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                        <MapPin size={12} color="var(--fr-primary)" />
                        <strong>{user.district}</strong>
                      </div>
                    </td>
                    <td>
                      <span className={`fr-status-badge fr-badge-${user.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>
                      {user.verified ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.76rem', fontWeight: 700 }}>
                          <ShieldCheck size={14} /> Verified
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--fr-warning)', fontSize: '0.76rem', fontWeight: 700 }}>
                          <ShieldAlert size={14} /> Unverified
                        </span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{user.totalActivity}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--fr-text-muted)' }}>
                        ★ {user.rating || '5.0'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="fr-table-btn"
                          title="View Full Profile"
                          onClick={() => {
                            setSelectedUser(user);
                            setViewModalOpen(true);
                          }}
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          type="button"
                          className="fr-table-btn"
                          title="Edit Details"
                          onClick={() => {
                            setSelectedUser(user);
                            setEditModalOpen(true);
                          }}
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          className={`fr-table-btn ${user.status === 'Active' ? 'danger' : 'primary'}`}
                          title={user.status === 'Active' ? 'Suspend Access' : 'Activate Access'}
                          onClick={() => handleToggleStatus(user.id, user.status)}
                        >
                          {user.status === 'Active' ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW USER DETAILS MODAL */}
      {viewModalOpen && selectedUser && (
        <div className="fr-admin-modal-overlay" onClick={() => setViewModalOpen(false)}>
          <div className="fr-admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="fr-admin-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '10px',
                  background: 'var(--fr-primary)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '1rem'
                }}>
                  {selectedUser.orgName ? selectedUser.orgName.substring(0, 2).toUpperCase() : 'UR'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--fr-text-heading)' }}>
                    {selectedUser.orgName || selectedUser.name}
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--fr-text-muted)' }}>
                    Registration No: {selectedUser.regNumber || 'N/A'} • {selectedUser.roleLabel}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="fr-admin-toggle-btn"
                onClick={() => setViewModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="fr-admin-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div className="fr-form-group">
                  <span className="fr-form-label">Contact Person</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{selectedUser.contactPerson || selectedUser.name}</div>
                </div>
                <div className="fr-form-group">
                  <span className="fr-form-label">Email Address</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{selectedUser.email}</div>
                </div>
                <div className="fr-form-group">
                  <span className="fr-form-label">Phone Hotline</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{selectedUser.phone}</div>
                </div>
                <div className="fr-form-group">
                  <span className="fr-form-label">District Hub</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{selectedUser.district}</div>
                </div>
                <div className="fr-form-group">
                  <span className="fr-form-label">Registered Address</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{selectedUser.address}</div>
                </div>
                <div className="fr-form-group">
                  <span className="fr-form-label">Public Health (PHI) Certificate</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#10b981' }}>
                    {selectedUser.phiCertificate || 'Verified on file'}
                  </div>
                </div>
              </div>

              {selectedUser.storageType && (
                <div style={{ background: 'var(--fr-bg-subtle)', padding: '12px 16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--fr-text-muted)' }}>Storage & Thermal Facilities</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>{selectedUser.storageType}</div>
                </div>
              )}

              {selectedUser.beneficiaries && (
                <div style={{ background: 'var(--fr-bg-subtle)', padding: '12px 16px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--fr-text-muted)' }}>Beneficiaries Under Direct Care</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--fr-primary)', marginTop: '2px' }}>
                    {selectedUser.beneficiaries} residents / individuals fed daily
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '10px' }}>
                <span className={`fr-status-badge fr-badge-${selectedUser.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  Status: {selectedUser.status}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--fr-text-muted)' }}>
                  Overall Platform Rating: <strong>★ {selectedUser.rating || '5.0'} / 5.0</strong>
                </span>
              </div>
            </div>

            <div className="fr-admin-modal-footer">
              <button
                type="button"
                className="fr-table-btn"
                onClick={() => handleToggleVerification(selectedUser.id, selectedUser.verified)}
              >
                <ShieldCheck size={14} /> Toggle Verified Badge
              </button>
              <button
                type="button"
                className="fr-table-btn primary"
                onClick={() => setViewModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER DETAILS MODAL */}
      {editModalOpen && selectedUser && (
        <div className="fr-admin-modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="fr-admin-modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleUpdateUser}>
              <div className="fr-admin-modal-header">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--fr-text-heading)' }}>
                  Edit Organization: {selectedUser.orgName || selectedUser.name}
                </h3>
                <button
                  type="button"
                  className="fr-admin-toggle-btn"
                  onClick={() => setEditModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="fr-admin-modal-body">
                <div className="fr-form-group">
                  <label className="fr-form-label">Organization Name</label>
                  <input
                    type="text"
                    value={selectedUser.orgName}
                    onChange={(e) => setSelectedUser({ ...selectedUser, orgName: e.target.value })}
                    className="fr-form-input"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="fr-form-group">
                    <label className="fr-form-label">Contact Person</label>
                    <input
                      type="text"
                      value={selectedUser.contactPerson}
                      onChange={(e) => setSelectedUser({ ...selectedUser, contactPerson: e.target.value })}
                      className="fr-form-input"
                    />
                  </div>
                  <div className="fr-form-group">
                    <label className="fr-form-label">District</label>
                    <select
                      value={selectedUser.district}
                      onChange={(e) => setSelectedUser({ ...selectedUser, district: e.target.value })}
                      className="fr-form-select"
                    >
                      <option value="Vavuniya">Vavuniya</option>
                      <option value="Jaffna">Jaffna</option>
                      <option value="Kilinochchi">Kilinochchi</option>
                      <option value="Mannar">Mannar</option>
                      <option value="Anuradhapura">Anuradhapura</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="fr-form-group">
                    <label className="fr-form-label">Email</label>
                    <input
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                      className="fr-form-input"
                      required
                    />
                  </div>
                  <div className="fr-form-group">
                    <label className="fr-form-label">Phone</label>
                    <input
                      type="text"
                      value={selectedUser.phone}
                      onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })}
                      className="fr-form-input"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="fr-form-group">
                    <label className="fr-form-label">Account Status</label>
                    <select
                      value={selectedUser.status}
                      onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                      className="fr-form-select"
                    >
                      <option value="Active">Active</option>
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="fr-form-group">
                    <label className="fr-form-label">Verification Badge</label>
                    <select
                      value={selectedUser.verified ? 'true' : 'false'}
                      onChange={(e) => setSelectedUser({ ...selectedUser, verified: e.target.value === 'true' })}
                      className="fr-form-select"
                    >
                      <option value="true">Verified Partner (Green Shield)</option>
                      <option value="false">Unverified</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="fr-admin-modal-footer">
                <button
                  type="button"
                  className="fr-table-btn"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="fr-table-btn primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW ORGANIZATION MODAL */}
      {createModalOpen && (
        <div className="fr-admin-modal-overlay" onClick={() => setCreateModalOpen(false)}>
          <div className="fr-admin-modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateUser}>
              <div className="fr-admin-modal-header">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--fr-text-heading)' }}>
                  Register New Organization / User
                </h3>
                <button
                  type="button"
                  className="fr-admin-toggle-btn"
                  onClick={() => setCreateModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="fr-admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="fr-form-group">
                    <label className="fr-form-label">Role Category *</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="fr-form-select"
                    >
                      <option value="donor">Food Donor (Hotel / Restaurant)</option>
                      <option value="recipient">Recipient Organization (Shelter / NGO)</option>
                      <option value="delivery">Delivery Partner (Logistics / Van)</option>
                      <option value="admin">System Administrator</option>
                    </select>
                  </div>
                  <div className="fr-form-group">
                    <label className="fr-form-label">District Hub *</label>
                    <select
                      value={newUser.district}
                      onChange={(e) => setNewUser({ ...newUser, district: e.target.value })}
                      className="fr-form-select"
                    >
                      <option value="Vavuniya">Vavuniya</option>
                      <option value="Jaffna">Jaffna</option>
                      <option value="Kilinochchi">Kilinochchi</option>
                      <option value="Mannar">Mannar</option>
                      <option value="Anuradhapura">Anuradhapura</option>
                    </select>
                  </div>
                </div>

                <div className="fr-form-group">
                  <label className="fr-form-label">Organization / Business Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Vavuniya Grand Heritage Hotel"
                    value={newUser.orgName}
                    onChange={(e) => setNewUser({ ...newUser, orgName: e.target.value, name: e.target.value })}
                    className="fr-form-input"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="fr-form-group">
                    <label className="fr-form-label">Contact Person Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Mr. K. Rajaratnam"
                      value={newUser.contactPerson}
                      onChange={(e) => setNewUser({ ...newUser, contactPerson: e.target.value })}
                      className="fr-form-input"
                      required
                    />
                  </div>
                  <div className="fr-form-group">
                    <label className="fr-form-label">Business Reg / NGO Number</label>
                    <input
                      type="text"
                      placeholder="e.g. BR/VAV/2026/011"
                      value={newUser.regNumber}
                      onChange={(e) => setNewUser({ ...newUser, regNumber: e.target.value })}
                      className="fr-form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div className="fr-form-group">
                    <label className="fr-form-label">Official Email *</label>
                    <input
                      type="email"
                      placeholder="contact@org.lk"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="fr-form-input"
                      required
                    />
                  </div>
                  <div className="fr-form-group">
                    <label className="fr-form-label">Phone Hotline *</label>
                    <input
                      type="text"
                      placeholder="+94 77 123 4567"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      className="fr-form-input"
                      required
                    />
                  </div>
                </div>

                <div className="fr-form-group">
                  <label className="fr-form-label">Address Location</label>
                  <input
                    type="text"
                    placeholder="Street, Town, District"
                    value={newUser.address}
                    onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    className="fr-form-input"
                  />
                </div>
              </div>

              <div className="fr-admin-modal-footer">
                <button
                  type="button"
                  className="fr-table-btn"
                  onClick={() => setCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="fr-table-btn primary"
                >
                  Create & Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
