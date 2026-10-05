import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { token } = useParams();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Add delay for loading spinner effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await api.post(`/auth/reset-password/${token}`, {
        password: formData.password
      });
      
      if (res.data.success) {
        setResetSuccess(true);
        toast.success('Password reset successful!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-[clamp(1rem,2vw,2rem)_1rem] relative overflow-hidden bg-[linear-gradient(135deg,rgba(245,247,250,0.95),rgba(195,207,226,0.95))] max-md:min-h-auto max-md:p-[1.5rem_1rem]">
<style>
{`
@keyframes slideInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes blob { 0%, 100% { transform: translate(0, 0) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } }
@keyframes slideFromLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
`}
</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute rounded-full blur-[60px] opacity-20 mix-blend-multiply w-[300px] h-[300px] bg-[linear-gradient(135deg,#3498db,#5dade2)] -top-[50px] -right-[50px] animate-[blob_8s_infinite]"></div>
        <div className="absolute rounded-full blur-[60px] opacity-20 mix-blend-multiply w-[300px] h-[300px] bg-[linear-gradient(135deg,#2980b9,#3498db)] -bottom-[50px] -left-[50px] animate-[blob_8s_infinite_reverse_2s]"></div>
      </div>

      <div className={`bg-white rounded-[16px] shadow-[0_10px_40px_rgba(52,152,219,0.2)] p-[2.5rem] w-[min(100%,420px)] relative z-10 opacity-0 translate-y-[30px] transition-all duration-[600ms] ease-in-out max-sm:p-[2rem_1.5rem] max-sm:m-[1rem] max-sm:max-w-full  ${isVisible ? 'opacity-100 !translate-y-0' : ''}`}>
        {/* Header */}
        <div className="text-center mb-[2rem] [animation:slideInDown_0.6s_ease]">
          <div className="w-[60px] h-[60px] bg-[linear-gradient(135deg,#3498db,#5dade2)] rounded-full flex items-center justify-center text-white mx-auto mb-[1rem] shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-[5deg]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h1 className="text-[2rem] text-[#2c3e50] mb-[0.5rem] font-bold tracking-[-0.5px] max-sm:text-[1.5rem]">Reset Password</h1>
          <p className="text-[#555] text-[0.95rem] font-medium max-sm:text-[0.9rem]">
            {resetSuccess 
              ? 'Your password has been reset successfully' 
              : 'Enter your new password below'}
          </p>
        </div>

        {!resetSuccess ? (
          /* Form */
          <form onSubmit={handleSubmit} className="flex flex-col gap-[1.5rem]">
            {/* Password Input */}
            <div className="flex flex-col gap-[0.5rem] [animation:slideInUp_0.6s_ease]">
              <label htmlFor="password" className="block text-[0.95rem] font-semibold text-[#2c3e50] transition-all duration-300 ease-in-out focus-within:text-[#3498db]">New Password</label>
              <div className="relative flex items-center">
                <svg className="absolute left-[12px] text-[#95a5a6] stroke-current pointer-events-none transition-all duration-300 ease-in-out z-[1]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-[0.875rem_0.75rem_0.875rem_2.75rem] border-2 border-[#ecf0f1] rounded-[10px] text-[1rem] text-[#2c3e50] bg-white transition-all duration-300 ease-in-out appearance-none hover:border-[#d5dbdb] hover:bg-[#f8f9fa] focus:outline-none focus:border-[#3498db] focus:bg-[rgba(52,152,219,0.05)] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] disabled:bg-[#f8f9fa] disabled:border-[#ecf0f1] disabled:text-[#95a5a6] disabled:cursor-not-allowed"
                  placeholder="At least 6 characters"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-[12px] bg-transparent border-none text-[#95a5a6] cursor-pointer p-[0.5rem] flex items-center justify-center transition-all duration-300 ease-in-out z-[2] hover:text-[#555] active:scale-95"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-[0.5rem] [animation:slideInUp_0.6s_ease]">
              <label htmlFor="confirmPassword" className="block text-[0.95rem] font-semibold text-[#2c3e50] transition-all duration-300 ease-in-out focus-within:text-[#3498db]">Confirm Password</label>
              <div className="relative flex items-center">
                <svg className="absolute left-[12px] text-[#95a5a6] stroke-current pointer-events-none transition-all duration-300 ease-in-out z-[1]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-[0.875rem_0.75rem_0.875rem_2.75rem] border-2 border-[#ecf0f1] rounded-[10px] text-[1rem] text-[#2c3e50] bg-white transition-all duration-300 ease-in-out appearance-none hover:border-[#d5dbdb] hover:bg-[#f8f9fa] focus:outline-none focus:border-[#3498db] focus:bg-[rgba(52,152,219,0.05)] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] disabled:bg-[#f8f9fa] disabled:border-[#ecf0f1] disabled:text-[#95a5a6] disabled:cursor-not-allowed"
                  placeholder="Re-enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-[12px] bg-transparent border-none text-[#95a5a6] cursor-pointer p-[0.5rem] flex items-center justify-center transition-all duration-300 ease-in-out z-[2] hover:text-[#555] active:scale-95"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`p-[0.875rem_1.5rem] border-none rounded-[10px] text-[1rem] font-semibold cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center gap-[0.5rem] uppercase tracking-[0.5px] bg-[linear-gradient(135deg,#3498db,#5dade2)] text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] w-full hover:not(:disabled):-translate-y-[2px] hover:not(:disabled):shadow-[0_10px_40px_rgba(52,152,219,0.2)] active:not(:disabled):translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[#95a5a6]  ${loading ? '!bg-[#95a5a6]' : ''}`}
            >
              {loading ? (
                <>
                  <span className="w-[18px] h-[18px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-[spin_1s_linear_infinite]"></span>
                  <span>Resetting...</span>
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        ) : (
          /* Success Message */
          <div className="flex flex-col items-center justify-center text-center py-[2rem]">
            <div className="w-[80px] h-[80px] bg-[rgba(39,174,96,0.1)] text-[#27ae60] rounded-full flex items-center justify-center mb-[1.5rem] [animation:slideInDown_0.5s_ease]">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <p className="text-[#2c3e50] text-[1.25rem] font-bold mb-[0.5rem]">
              Your password has been reset successfully!
            </p>
            <p className="text-[#555] text-[0.95rem] max-w-[300px] mx-auto leading-relaxed">
              You can now login with your new password.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="p-[0.875rem_1.5rem] border-none rounded-[10px] text-[1rem] font-semibold cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center gap-[0.5rem] uppercase tracking-[0.5px] bg-[linear-gradient(135deg,#3498db,#5dade2)] text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] w-full hover:not(:disabled):-translate-y-[2px] hover:not(:disabled):shadow-[0_10px_40px_rgba(52,152,219,0.2)] active:not(:disabled):translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[#95a5a6]"
              style={{ marginTop: '1rem' }}
            >
              Go to Login
            </button>
          </div>
        )}

        {/* Back to Login Link */}
        {!resetSuccess && (
          <p className="text-center text-[#555] text-[0.9rem] mt-[1.5rem]" style={{ marginTop: '1.5rem' }}>
            Remember your password?{' '}
            <Link to="/login" className="text-[#3498db] no-underline font-semibold transition-all duration-300 ease-in-out border-b-2 border-transparent hover:text-[#2980b9] hover:border-[#3498db]">
              {t('login')}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
