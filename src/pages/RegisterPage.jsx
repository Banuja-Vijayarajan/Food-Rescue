import React, { useState } from 'react';
import '../styles/auth.css';
import { 
  Building2, 
  Heart, 
  ShieldAlert, 
  Building, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2,
  Check
} from 'lucide-react';

export default function RegisterPage({ setCurrentPage, setCurrentRole }) {
  // 'donor' | 'recipient'
  const [selectedRole, setSelectedRole] = useState('donor');

  const [formData, setFormData] = useState({
    orgName: '',
    category: 'Hotel & Banquets',
    contactPerson: '',
    phone: '',
    email: '',
    regNumber: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: 'Vavuniya',
    mission: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  // When role changes, set default category and clear specific placeholders
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setFormData(prev => ({
      ...prev,
      category: role === 'donor' ? 'Hotel & Banquets' : 'Community Welfare & Soup Kitchen'
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      if (setCurrentRole) setCurrentRole(selectedRole);
      setCurrentPage('home');
    }, 1500);
  };

  return (
    <div className="fr-auth-page-wrap">
      <div className="fr-register-card">
        <div className="fr-register-top-header">
          <div className="fr-register-brand-mark" aria-hidden="true">
            <img src="/food-rescue-logo.png" alt="" />
          </div>
          <h1 className="fr-register-main-heading">Register Organization</h1>
          <div className="fr-register-brand-badge">Food Rescue • Every Meal Counts</div>
          <p className="fr-register-sub-heading">
            Join the certified surplus redistribution network in Northern Sri Lanka.
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="fr-register-success-alert">
            <CheckCircle2 size={20} />
            Registration & verification details submitted successfully! Redirecting...
          </div>
        )}

        {/* Section: I AM REGISTERING AS */}
        <div className="fr-role-section-wrapper">
          <label className="fr-role-section-label">I AM REGISTERING AS:</label>
          <div className="fr-role-cards-grid">
            {/* Food Donor Card */}
            <div 
              className={`fr-role-choice-card ${selectedRole === 'donor' ? 'active-donor' : ''}`}
              onClick={() => handleRoleChange('donor')}
            >
              <div className="fr-role-choice-icon donor-icon">
                <Building2 size={22} />
              </div>
              <div className="fr-role-choice-text">
                <div className="fr-role-choice-title">Food Donor</div>
                <div className="fr-role-choice-desc">Hotels, restaurants, bakeries, event halls</div>
              </div>
            </div>

            {/* Recipient Org Card */}
            <div 
              className={`fr-role-choice-card ${selectedRole === 'recipient' ? 'active-recipient' : ''}`}
              onClick={() => handleRoleChange('recipient')}
            >
              <div className="fr-role-choice-icon recipient-icon">
                <Heart size={22} />
              </div>
              <div className="fr-role-choice-text">
                <div className="fr-role-choice-title">Recipient Org</div>
                <div className="fr-role-choice-desc">Shelters, orphanages, charity kitchens</div>
              </div>
            </div>
          </div>
        </div>

        {/* Note Banner: System Administrator */}
        <div className="fr-admin-notice-box">
          <ShieldAlert size={18} className="fr-admin-notice-icon" />
          <span>
            <strong>Note:</strong> System Administrator accounts cannot be self-registered and are governed by central platform governance authorities.
          </span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="fr-register-form">
          {/* Row 1: Org Name & Category */}
          <div className="fr-form-row">
            <div className="fr-form-field">
              <label className="fr-field-label">Organization Name *</label>
              <div className="fr-input-with-icon">
                <Building size={16} className="fr-field-icon" />
                <input 
                  type="text" 
                  name="orgName"
                  required
                  placeholder={selectedRole === 'donor' ? 'e.g. Royal Grand Banquets' : 'e.g. Hope Child Shelter'}
                  value={formData.orgName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="fr-form-field">
              <label className="fr-field-label">Category / Type *</label>
              <div className="fr-select-wrapper">
                {selectedRole === 'donor' ? (
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Hotel & Banquets">Hotel & Banquets</option>
                    <option value="Restaurant & Cafe">Restaurant & Cafe</option>
                    <option value="Bakery & Pastry Shop">Bakery & Pastry Shop</option>
                    <option value="Catering Service">Catering Service</option>
                    <option value="Event Organizer">Event Organizer</option>
                  </select>
                ) : (
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="Community Welfare & Soup Kitchen">Community Welfare & Soup Kitchen</option>
                    <option value="Orphanage & Child Home">Orphanage & Child Home</option>
                    <option value="Elderly Care Home">Elderly Care Home</option>
                    <option value="Disaster Relief Center">Disaster Relief Center</option>
                    <option value="Religious Charity Kitchen">Religious Charity Kitchen</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Row 2: Contact Person & Phone */}
          <div className="fr-form-row">
            <div className="fr-form-field">
              <label className="fr-field-label">Contact Person / Coordinator *</label>
              <div className="fr-input-with-icon">
                <User size={16} className="fr-field-icon" />
                <input 
                  type="text" 
                  name="contactPerson"
                  required
                  placeholder="Full Name"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="fr-form-field">
              <label className="fr-field-label">Direct Contact Phone *</label>
              <div className="fr-input-with-icon">
                <Phone size={16} className="fr-field-icon" />
                <input 
                  type="tel" 
                  name="phone"
                  required
                  placeholder="+94 24 222 3456"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Row 3: Official Email & Business Reg / NGO ID */}
          <div className="fr-form-row">
            <div className="fr-form-field">
              <label className="fr-field-label">Official Email Address *</label>
              <div className="fr-input-with-icon">
                <Mail size={16} className="fr-field-icon" />
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="contact@org.lk"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="fr-form-field">
              <label className="fr-field-label">Business Reg / NGO ID *</label>
              <div className="fr-input-with-icon">
                <FileText size={16} className="fr-field-icon" />
                <input 
                  type="text" 
                  name="regNumber"
                  required
                  placeholder="e.g. PV-12345 or NGO-VAV-001"
                  value={formData.regNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Row 4: Password & Confirm Password */}
          <div className="fr-form-row">
            <div className="fr-form-field">
              <label className="fr-field-label">Password *</label>
              <div className="fr-input-with-icon">
                <Lock size={16} className="fr-field-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password"
                  required
                  placeholder="At least 6 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button 
                  type="button" 
                  className="fr-pwd-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="fr-form-field">
              <label className="fr-field-label">Confirm Password *</label>
              <div className="fr-input-with-icon">
                <Lock size={16} className="fr-field-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="confirmPassword"
                  required
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Row 5: Premises Address & City / Region */}
          <div className="fr-form-row">
            <div className="fr-form-field">
              <label className="fr-field-label">Premises Address / Street *</label>
              <div className="fr-input-plain">
                <input 
                  type="text" 
                  name="address"
                  required
                  placeholder="Station Road, Town Center"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="fr-form-field">
              <label className="fr-field-label">City / Region *</label>
              <div className="fr-select-wrapper">
                <select 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                >
                  <option value="Vavuniya">Vavuniya</option>
                  <option value="Jaffna">Jaffna</option>
                  <option value="Kilinochchi">Kilinochchi</option>
                  <option value="Mannar">Mannar</option>
                  <option value="Anuradhapura">Anuradhapura</option>
                  <option value="Colombo">Colombo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 6: Organization Mission & Description */}
          <div className="fr-form-field full-width">
            <label className="fr-field-label">Organization Mission & Description</label>
            <textarea 
              name="mission"
              rows="3"
              className="fr-textarea"
              placeholder="Brief description of your daily catering surplus or beneficiaries served..."
              value={formData.mission}
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* Submit Button */}
          <button type="submit" className="fr-register-submit-btn">
            <Check size={18} /> Submit Registration & Verification
          </button>
        </form>

        {/* Footer Link */}
        <div className="fr-register-footer">
          Already registered?{' '}
          <button 
            type="button" 
            className="fr-signin-link"
            onClick={() => setCurrentPage('login')}
          >
            Sign in to your account
          </button>
        </div>
      </div>
    </div>
  );
}
