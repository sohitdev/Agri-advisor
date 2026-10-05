import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './Auth.css';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateEmail = () => {
    if (!email) {
      toast.error('Email is required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) return;

    setLoading(true);
    
    try {
      // Add delay for loading spinner effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await api.post('/auth/forgot-password', { email });
      
      if (res.data.success) {
        setEmailSent(true);
        toast.success('Password reset link sent to your email!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container login-container">
      <div className="auth-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className={`auth-card ${isVisible ? 'visible' : ''}`}>
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path>
            </svg>
          </div>
          <h1 className="auth-title">{t('forgot_password') || 'Forgot Password'}</h1>
          <p className="auth-subtitle">
            {emailSent 
              ? 'Check your email for reset instructions' 
              : 'Enter your email to reset your password'}
          </p>
        </div>

        {!emailSent ? (
          /* Form */
          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Input */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">{t('email')}</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="Enter your registered email"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`btn-submit ${loading ? 'btn-loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Sending...</span>
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          /* Success Message */
          <div className="success-message-container">
            <div className="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <p className="success-text">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="success-subtext">
              Please check your inbox and follow the instructions to reset your password. 
              The link will expire in 10 minutes.
            </p>
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail('');
              }}
              className="btn-secondary"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              Send Again
            </button>
          </div>
        )}

        {/* Back to Login Link */}
        <p className="auth-footer" style={{ marginTop: '1.5rem' }}>
          Remember your password?{' '}
          <Link to="/login" className="auth-link">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
