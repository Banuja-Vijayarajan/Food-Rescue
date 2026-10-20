import React, { useState } from 'react';
import '../styles/auth.css';
import {
  LogIn,
  Building2,
  Heart,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage({ setCurrentPage, setCurrentRole }) {
  const [selectedRole, setSelectedRole] = useState('donor');
  const [email, setEmail] = useState('donor@greenleaf.lk');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // 1-Click Demo Accounts
  const demoAccounts = {
    donor: {
      email: 'donor@greenleaf.lk',
      pass: 'donor123456',
      label: 'Donor (Green Leaf)'
    },
    recipient: {
      email: 'contact@hopeshelter.org',
      pass: 'shelter123456',
      label: 'Recipient (Hope Shelter)'
    },
    admin: {
      email: 'supervisor@foodrescue.org',
      pass: 'admin123456',
      label: 'Admin (Supervisor)'
    }
  };

  const handleDemoSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setEmail(demoAccounts[roleKey].email);
    setPassword(demoAccounts[roleKey].pass);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage(`Authenticated successfully as ${selectedRole}!`);
    if (setCurrentRole) setCurrentRole(selectedRole);
    setTimeout(() => {
      setCurrentPage('home');
    }, 1000);
  };

  return (
    <div className="fr-auth-page-wrap">
      <div className="fr-login-card">
        {/* Top Center Green Icon */}
        <div className="fr-login-top-icon-wrap">
          <div className="fr-login-top-icon">
            <LogIn size={26} strokeWidth={2.4} />
          </div>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="fr-login-heading">Sign In to Food Rescue</h1>
        <p className="fr-login-subtitle">
          Access your food donation management portal
        </p>

        {/* Success Alert */}
        {successMessage && (
          <div className="fr-login-success-box">
            <CheckCircle2 size={18} /> {successMessage}
          </div>
        )}

        {/* 1-CLICK DEMO ACCOUNTS BOX */}
        <div className="fr-demo-accounts-box">
          <div className="fr-demo-accounts-header">
            <span className="fr-demo-accounts-tag">
              <Sparkles size={14} /> 1-CLICK DEMO ACCOUNTS
            </span>
            <span className="fr-demo-accounts-subtag">instant evaluation</span>
          </div>

          <div className="fr-demo-cards-row">
            {/* Donor */}
            <button
              type="button"
              className={`fr-demo-account-card ${selectedRole === 'donor' ? 'active-demo-donor' : ''}`}
              onClick={() => handleDemoSelect('donor')}
            >
              <div className="fr-demo-card-title">
                <Building2 size={16} className="fr-demo-donor-icon" />
                <span>Donor</span>
              </div>
              <div className="fr-demo-card-sub">Green Leaf</div>
            </button>

            {/* Recipient */}
            <button
              type="button"
              className={`fr-demo-account-card ${selectedRole === 'recipient' ? 'active-demo-recipient' : ''}`}
              onClick={() => handleDemoSelect('recipient')}
            >
              <div className="fr-demo-card-title">
                <Heart size={16} className="fr-demo-recipient-icon" />
                <span>Recipient</span>
              </div>
              <div className="fr-demo-card-sub">Hope Shelter</div>
            </button>

            {/* Admin */}
            <button
              type="button"
              className={`fr-demo-account-card ${selectedRole === 'admin' ? 'active-demo-admin' : ''}`}
              onClick={() => handleDemoSelect('admin')}
            >
              <div className="fr-demo-card-title">
                <ShieldCheck size={16} className="fr-demo-admin-icon" />
                <span>Admin</span>
              </div>
              <div className="fr-demo-card-sub">Supervisor</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="fr-login-form">
          {/* Email Address */}
          <div className="fr-form-field">
            <label className="fr-field-label">Email Address</label>
            <div className="fr-input-with-icon">
              <Mail size={16} className="fr-field-icon" />
              <input
                type="email"
                required
                placeholder="name@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="fr-form-field">
            <label className="fr-field-label">Password</label>
            <div className="fr-input-with-icon">
              <Lock size={16} className="fr-field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Remember me & Forgot Password */}
          <div className="fr-login-options-row">
            <label className="fr-remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="fr-checkbox"
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              className="fr-forgot-pwd-btn"
              onClick={() => alert("Password reset link has been sent to your registered email.")}
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button type="submit" className="fr-login-submit-btn">
            <LogIn size={18} /> Sign In to Dashboard
          </button>
        </form>

        {/* Footer Link */}
        <div className="fr-login-bottom-link">
          Don't have an account?{' '}
          <button
            type="button"
            className="fr-register-link-btn"
            onClick={() => setCurrentPage('register')}
          >
            Register here
          </button>
        </div>
      </div>
    </div>
  );
}
