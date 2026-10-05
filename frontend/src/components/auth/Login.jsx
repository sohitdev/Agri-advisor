import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { t } = useTranslation();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    if (!formData.email) {
      toast.error('Email is required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }
    
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Show redirecting toast immediately when spinner starts
    const toastId = toast.info('Redirecting...', { autoClose: false });
    
    try {
      // Add delay for loading spinner effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Dismiss redirecting toast and navigate
        toast.dismiss(toastId);
        navigate('/dashboard');
        // Show success toast after landing on dashboard
        setTimeout(() => {
          toast.success('Login successful!');
        }, 100);
      } else {
        toast.dismiss(toastId);
        toast.error(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error('An error occurred. Please try again.');
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
          <h1 className="text-[2rem] text-slate-900 mb-[0.5rem] font-bold tracking-[-0.5px] max-sm:text-[1.5rem]">{t('login')}</h1>
          <p className="text-[#555] text-[0.95rem] font-medium max-sm:text-[0.9rem]">Welcome back to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[1.5rem]">
          {/* Email Input */}
          <div className="flex flex-col gap-[0.5rem] [animation:slideInUp_0.6s_ease]">
            <label htmlFor="email" className="block text-[0.95rem] font-semibold text-slate-900 transition-all duration-300 ease-in-out focus-within:text-emerald-600">{t('email')}</label>
            <div className="relative flex items-center">
              <svg className="absolute left-[12px] text-[#95a5a6] stroke-current pointer-events-none transition-all duration-300 ease-in-out z-[1]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-3 pr-4 pl-11 border-2 border-slate-200 rounded-[10px] text-[1rem] text-slate-900 bg-white transition-all duration-300 ease-in-out appearance-none hover:border-[#d5dbdb] hover:bg-[#f8f9fa] focus:outline-none focus:border-emerald-600 focus:bg-[rgba(52,152,219,0.05)] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] disabled:bg-[#f8f9fa] disabled:border-slate-200 disabled:text-[#95a5a6] disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-[0.5rem] [animation:slideInUp_0.6s_ease]">
            <label htmlFor="password" className="block text-[0.95rem] font-semibold text-slate-900 transition-all duration-300 ease-in-out focus-within:text-emerald-600">{t('password')}</label>
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
                className="w-full py-3 pr-4 pl-11 border-2 border-slate-200 rounded-[10px] text-[1rem] text-slate-900 bg-white transition-all duration-300 ease-in-out appearance-none hover:border-[#d5dbdb] hover:bg-[#f8f9fa] focus:outline-none focus:border-emerald-600 focus:bg-[rgba(52,152,219,0.05)] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] disabled:bg-[#f8f9fa] disabled:border-slate-200 disabled:text-[#95a5a6] disabled:cursor-not-allowed"
                placeholder="Enter your password"
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

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center gap-[1rem] text-[0.9rem] flex-wrap">
            <label className="flex items-center cursor-pointer text-[#555] font-medium transition-all duration-300 ease-in-out select-none hover:text-slate-900">
              <input type="checkbox" className="w-[18px] h-[18px] cursor-pointer mr-[0.5rem] accent-[#3498db] transition-all duration-300 ease-in-out hover:scale-110" />
              <span>{t('remember_me')}</span>
            </label>
            <Link to="/forgot-password" className="text-emerald-600 no-underline font-semibold transition-all duration-300 ease-in-out hover:text-[#2980b9] hover:underline">{t('forgot_password')}</Link>
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
                <span>{t('logging_in')}</span>
              </>
            ) : (
              t('login')
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative text-center my-[1.5rem] text-[#95a5a6] text-[0.9rem] font-medium before:absolute before:top-1/2 before:left-0 before:right-0 before:h-[1px] before:bg-[#ecf0f1]">
          <span className="bg-white px-[1rem] relative">OR</span>
        </div>

        {/* Register Link */}
        <p className="text-center text-[#555] text-[0.9rem] mt-[1.5rem]">
          {t('no_account')}{' '}
          <Link to="/register" className="text-emerald-600 no-underline font-semibold transition-all duration-300 ease-in-out border-b-2 border-transparent hover:text-[#2980b9] hover:border-emerald-600">
            {t('register')}
          </Link>
        </p>
      </div>

      <p className="absolute bottom-[1rem] left-1/2 -translate-x-1/2 text-center text-[0.75rem] text-[#95a5a6] max-w-[90%]">
        By logging in, you agree to our <Link to="/terms-of-service" className="text-emerald-600 no-underline font-semibold transition-all duration-300 ease-in-out border-b-2 border-transparent hover:text-[#2980b9] hover:border-emerald-600">Terms of Service</Link>
      </p>
    </div>
  );
};

export default Login;