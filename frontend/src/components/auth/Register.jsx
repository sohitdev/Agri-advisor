import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify'; // Use react-toastify
import indiaStatesDistricts from '../../data/indiaStatesDistricts.json';

const API_HOST = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const Register = () => {
  const { t } = useTranslation();
  const { register, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    state: '',
    district: '',
    preferredLanguage: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedState, setSelectedState] = useState('');
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);

  const stateDropdownRef = useRef(null);
  const districtDropdownRef = useRef(null);

  const stateOptions = useMemo(
    () => Object.keys(indiaStatesDistricts).sort((a, b) => a.localeCompare(b)),
    []
  );

  const filteredStateOptions = useMemo(() => {
    const query = formData.state.trim().toLowerCase();
    if (!query) {
      return stateOptions;
    }

    return stateOptions.filter((stateName) =>
      stateName.toLowerCase().includes(query)
    );
  }, [formData.state, stateOptions]);

  const selectedStateDistricts = useMemo(() => {
    if (!selectedState) {
      return [];
    }
    return indiaStatesDistricts[selectedState] || [];
  }, [selectedState]);

  const filteredDistrictOptions = useMemo(() => {
    const query = formData.district.trim().toLowerCase();
    if (!query) {
      return selectedStateDistricts;
    }

    return selectedStateDistricts.filter((districtName) =>
      districtName.toLowerCase().includes(query)
    );
  }, [formData.district, selectedStateDistricts]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
        setIsStateDropdownOpen(false);
      }
      if (districtDropdownRef.current && !districtDropdownRef.current.contains(event.target)) {
        setIsDistrictDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const validateStep1 = () => {
    // Check if name is empty
    if (!formData.name) {
      toast.error('Name is required');
      return false;
    }
    
    // Check if email is empty
    if (!formData.email) {
      toast.error('Email is required');
      return false;
    }
    
    // Check if email is valid
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    // Check if password is empty
    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }
    
    // Check password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
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

  const getExactStateMatch = (stateName) => {
    const normalized = stateName.trim().toLowerCase();
    if (!normalized) {
      return '';
    }

    return stateOptions.find((option) => option.toLowerCase() === normalized) || '';
  };

  const normalizeLocationName = (value) =>
    value
      .toLowerCase()
      .replace(/[.,'()/-]/g, ' ')
      .replace(/\b(district|division|state|union territory|ut)\b/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const stateAliasMap = {
    'nct of delhi': 'Delhi',
    'national capital territory of delhi': 'Delhi',
    orissa: 'Odisha',
    pondicherry: 'Puducherry',
    'jammu kashmir': 'Jammu and Kashmir',
    'dadra and nagar haveli and daman diu': 'Dadra and Nagar Haveli and Daman and Diu',
    'dadra and nagar haveli daman and diu': 'Dadra and Nagar Haveli and Daman and Diu'
  };

  const findBestStateMatch = (rawStateName) => {
    if (!rawStateName) {
      return '';
    }

    const normalized = normalizeLocationName(rawStateName);
    if (!normalized) {
      return '';
    }

    const aliasMatch = stateAliasMap[normalized];
    if (aliasMatch && stateOptions.includes(aliasMatch)) {
      return aliasMatch;
    }

    const exactNormalizedMatch = stateOptions.find(
      (option) => normalizeLocationName(option) === normalized
    );
    if (exactNormalizedMatch) {
      return exactNormalizedMatch;
    }

    return (
      stateOptions.find((option) => {
        const normalizedOption = normalizeLocationName(option);
        return normalizedOption.includes(normalized) || normalized.includes(normalizedOption);
      }) || ''
    );
  };

  const findBestDistrictMatch = (rawDistrictName, districts) => {
    if (!rawDistrictName || !districts.length) {
      return '';
    }

    const normalized = normalizeLocationName(rawDistrictName);
    if (!normalized) {
      return '';
    }

    const exactNormalizedMatch = districts.find(
      (district) => normalizeLocationName(district) === normalized
    );
    if (exactNormalizedMatch) {
      return exactNormalizedMatch;
    }

    return (
      districts.find((district) => {
        const normalizedDistrict = normalizeLocationName(district);
        return normalizedDistrict.includes(normalized) || normalized.includes(normalizedDistrict);
      }) || ''
    );
  };

  const handleStateInputChange = (e) => {
    const { value } = e.target;
    const matchedState = getExactStateMatch(value);

    setFormData((prev) => ({
      ...prev,
      state: value,
      district: ''
    }));

    setSelectedState(matchedState);
    setIsStateDropdownOpen(true);
    setIsDistrictDropdownOpen(false);
  };

  const handleStateSelect = (stateName) => {
    setFormData((prev) => ({
      ...prev,
      state: stateName,
      district: ''
    }));
    setSelectedState(stateName);
    setIsStateDropdownOpen(false);
    setIsDistrictDropdownOpen(false);
  };

  const handleDistrictInputChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      district: value
    }));

    if (selectedState) {
      setIsDistrictDropdownOpen(true);
    }
  };

  const handleDistrictSelect = (districtName) => {
    setFormData((prev) => ({
      ...prev,
      district: districtName
    }));
    setIsDistrictDropdownOpen(false);
  };

  const getCurrentPosition = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000
      });
    });

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported in this browser.');
      return;
    }

    setGeoLoading(true);
    setIsStateDropdownOpen(false);
    setIsDistrictDropdownOpen(false);

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `${API_HOST}/api/auth/reverse-geocode?latitude=${latitude}&longitude=${longitude}`
      );

      if (!response.ok) {
        throw new Error('reverse-geocode-failed');
      }

      const geoData = await response.json();
      const administrative = Array.isArray(geoData?.localityInfo?.administrative)
        ? geoData.localityInfo.administrative
        : [];

      const rawState =
        geoData?.principalSubdivision ||
        administrative.find((entry) => {
          const text = `${entry?.name || ''} ${entry?.description || ''}`.toLowerCase();
          return /state|union territory|territory/.test(text);
        })?.name ||
        '';

      const matchedState = findBestStateMatch(rawState);
      if (!matchedState) {
        toast.error('Could not map your location to a supported state. Please select manually.');
        return;
      }

      const districtCandidateFromAdmin = administrative.find((entry) => {
        const text = `${entry?.name || ''} ${entry?.description || ''}`.toLowerCase();
        return /district/.test(text);
      })?.name;

      const rawDistrict =
        districtCandidateFromAdmin ||
        geoData?.locality ||
        geoData?.city ||
        geoData?.localityName ||
        '';

      const stateDistricts = indiaStatesDistricts[matchedState] || [];
      const matchedDistrict = findBestDistrictMatch(rawDistrict, stateDistricts);

      setSelectedState(matchedState);
      setFormData((prev) => ({
        ...prev,
        state: matchedState,
        district: matchedDistrict || ''
      }));

      if (matchedDistrict) {
        toast.success('Location detected successfully. State and district were auto-filled.');
      } else {
        toast.info('State detected successfully. Please select your district.');
      }
    } catch (error) {
      if (error?.code === 1) {
        toast.error('Location access was denied. Please allow permission or fill manually.');
      } else if (error?.code === 2) {
        toast.error('Could not determine your location. Please try again.');
      } else if (error?.code === 3) {
        toast.error('Location request timed out. Please try again.');
      } else {
        toast.error('Unable to auto-detect location right now. Please fill manually.');
      }
    } finally {
      setGeoLoading(false);
    }
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If on step 1, validate and move to step 2 instead of submitting
    if (currentStep === 1) {
      handleNext();
      return;
    }
    
    setLoading(true);
    try {
      // Add delay for loading spinner effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result = await register(formData);
      
      if (result.success) {
        toast.success('Registration successful! Welcome aboard!');
        setTimeout(() => navigate('/dashboard'), 1000);
      } else {
        toast.error(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
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

      <div className={`bg-white rounded-[16px] shadow-[0_10px_40px_rgba(52,152,219,0.2)] p-[2.5rem] w-[min(100%,480px)] relative z-10 opacity-0 translate-y-[30px] transition-all duration-[600ms] ease-in-out max-sm:p-[2rem_1.5rem] max-sm:m-[1rem] max-sm:max-w-full  ${isVisible ? 'opacity-100 !translate-y-0' : ''}`}>
        {/* Header */}
        <div className="text-center mb-[2rem] [animation:slideInDown_0.6s_ease]">
          <div className="w-[60px] h-[60px] bg-[linear-gradient(135deg,#3498db,#5dade2)] rounded-full flex items-center justify-center text-white mx-auto mb-[1rem] shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-[5deg]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h1 className="text-[2rem] text-[#2c3e50] mb-[0.5rem] font-bold tracking-[-0.5px] max-sm:text-[1.5rem]">{t('register')}</h1>
          <p className="text-[#555] text-[0.95rem] font-medium max-sm:text-[0.9rem]">Create your account</p>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-[0.5rem] mb-[2rem]">
          <div className={`flex-1 h-[3px] bg-[#ecf0f1] rounded-[10px] transition-all duration-300 ease-in-out  ${currentStep >= 1 ? 'bg-[linear-gradient(90deg,#3498db,#5dade2)] [animation:slideFromLeft_0.5s_ease]' : ''}`}></div>
          <div className={`flex-1 h-[3px] bg-[#ecf0f1] rounded-[10px] transition-all duration-300 ease-in-out  ${currentStep >= 2 ? 'bg-[linear-gradient(90deg,#3498db,#5dade2)] [animation:slideFromLeft_0.5s_ease]' : ''}`}></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[1.5rem]">
          {/* Step 1: Personal Info */}
          <div className={`hidden opacity-0 translate-x-[20px] transition-all duration-500 ease-in-out  ${currentStep === 1 ? '!flex flex-col gap-[1.5rem] !opacity-100 !translate-x-0' : ''}`}>
            <div className="flex flex-col gap-[0.5rem] [animation:slideInUp_0.6s_ease]">
              <label htmlFor="name" className="block text-[0.95rem] font-semibold text-[#2c3e50] transition-all duration-300 ease-in-out focus-within:text-[#3498db]">
                {t('name')} <span className="text-[#e74c3c] ml-[0.25rem]">*</span>
              </label>
              <div className="relative flex items-center">
                <svg className="absolute left-[12px] text-[#95a5a6] stroke-current pointer-events-none transition-all duration-300 ease-in-out z-[1]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-[0.875rem_0.75rem_0.875rem_2.75rem] border-2 border-[#ecf0f1] rounded-[10px] text-[1rem] text-[#2c3e50] bg-white transition-all duration-300 ease-in-out appearance-none hover:border-[#d5dbdb] hover:bg-[#f8f9fa] focus:outline-none focus:border-[#3498db] focus:bg-[rgba(52,152,219,0.05)] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] disabled:bg-[#f8f9fa] disabled:border-[#ecf0f1] disabled:text-[#95a5a6] disabled:cursor-not-allowed"
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[0.5rem] [animation:slideInUp_0.6s_ease]">
              <label htmlFor="email" className="block text-[0.95rem] font-semibold text-[#2c3e50] transition-all duration-300 ease-in-out focus-within:text-[#3498db]">
                {t('email')} <span className="text-[#e74c3c] ml-[0.25rem]">*</span>
              </label>
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
                  className="w-full p-[0.875rem_0.75rem_0.875rem_2.75rem] border-2 border-[#ecf0f1] rounded-[10px] text-[1rem] text-[#2c3e50] bg-white transition-all duration-300 ease-in-out appearance-none hover:border-[#d5dbdb] hover:bg-[#f8f9fa] focus:outline-none focus:border-[#3498db] focus:bg-[rgba(52,152,219,0.05)] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] disabled:bg-[#f8f9fa] disabled:border-[#ecf0f1] disabled:text-[#95a5a6] disabled:cursor-not-allowed"
                  placeholder="Email Address"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[0.5rem] [animation:slideInUp_0.6s_ease]">
              <label htmlFor="password" className="block text-[0.95rem] font-semibold text-[#2c3e50] transition-all duration-300 ease-in-out focus-within:text-[#3498db]">
                {t('password')} <span className="text-[#e74c3c] ml-[0.25rem]">*</span>
              </label>
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
          </div>

          {/* Step 2: Location & Preferences */}
          <div className={`hidden opacity-0 translate-x-[20px] transition-all duration-500 ease-in-out  ${currentStep === 2 ? '!flex flex-col gap-[1.5rem] !opacity-100 !translate-x-0' : ''}`}>
            <button
              type="button"
              className="w-full border border-dashed border-[#5dade2] bg-[rgba(52,152,219,0.08)] text-[#2980b9] rounded-[10px] p-[0.75rem_1rem] text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 ease-in-out hover:not(:disabled):bg-[rgba(52,152,219,0.14)] hover:not(:disabled):border-[#3498db] disabled:opacity-70 disabled:cursor-wait"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
            >
              {geoLoading ? 'Detecting location...' : 'Use Current Location'}
            </button>

            <div className="flex flex-col gap-[0.5rem] [animation:slideInUp_0.6s_ease]">
              <label htmlFor="phone" className="block text-[0.95rem] font-semibold text-[#2c3e50] transition-all duration-300 ease-in-out focus-within:text-[#3498db]">Phone</label>
              <div className="relative flex items-center">
                <svg className="absolute left-[12px] text-[#95a5a6] stroke-current pointer-events-none transition-all duration-300 ease-in-out z-[1]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-[0.875rem_0.75rem_0.875rem_2.75rem] border-2 border-[#ecf0f1] rounded-[10px] text-[1rem] text-[#2c3e50] bg-white transition-all duration-300 ease-in-out appearance-none hover:border-[#d5dbdb] hover:bg-[#f8f9fa] focus:outline-none focus:border-[#3498db] focus:bg-[rgba(52,152,219,0.05)] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] disabled:bg-[#f8f9fa] disabled:border-[#ecf0f1] disabled:text-[#95a5a6] disabled:cursor-not-allowed"
                  placeholder="+91 (optional)"
                />
              </div>
            </div>

            <div className="flex flex-col gap-[0.5rem] [animation:slideInUp_0.6s_ease]">
              <label htmlFor="state" className="block text-[0.95rem] font-semibold text-[#2c3e50] transition-all duration-300 ease-in-out focus-within:text-[#3498db]">{t('state')}</label>
              <div className="relative flex items-center" ref={stateDropdownRef}>
                <svg className="absolute left-[12px] text-[#95a5a6] stroke-current pointer-events-none transition-all duration-300 ease-in-out z-[1]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <input
                  id="state"
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleStateInputChange}
                  onFocus={() => setIsStateDropdownOpen(true)}
                  className="w-full p-[0.875rem_0.75rem_0.875rem_2.75rem] border-2 border-[#ecf0f1] rounded-[10px] text-[1rem] text-[#2c3e50] bg-white transition-all duration-300 ease-in-out appearance-none hover:border-[#d5dbdb] hover:bg-[#f8f9fa] focus:outline-none focus:border-[#3498db] focus:bg-[rgba(52,152,219,0.05)] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] disabled:bg-[#f8f9fa] disabled:border-[#ecf0f1] disabled:text-[#95a5a6] disabled:cursor-not-allowed"
                  autoComplete="address-level1"
                  placeholder="e.g., Uttar Pradesh"
                />
                <button
                  type="button"
                  className="absolute right-[10px] top-1/2 -translate-y-1/2 border-none bg-transparent text-[#95a5a6] inline-flex items-center justify-center cursor-pointer p-[0.35rem] rounded-[8px] transition-all duration-300 ease-in-out z-[2] hover:not(:disabled):text-[#555] hover:not(:disabled):bg-[#f8f9fa] disabled:cursor-not-allowed disabled:text-[#d5dbdb]"
                  onClick={() => setIsStateDropdownOpen((prev) => !prev)}
                  aria-label="Toggle state options"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {isStateDropdownOpen && filteredStateOptions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-[calc(100%+0.35rem)] list-none m-0 p-[0.35rem] bg-white border border-[#ecf0f1] rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] max-h-[210px] overflow-y-auto z-[30] [animation:slideInDown_0.2s_ease]" role="listbox" aria-label="State options">
                    {filteredStateOptions.map((stateName) => (
                      <li
                        key={stateName}
                        className="p-[0.55rem_0.75rem] rounded-[8px] text-[#2c3e50] text-[0.95rem] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[rgba(52,152,219,0.1)] hover:text-[#2980b9]"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleStateSelect(stateName)}
                        role="option"
                        aria-selected={formData.state === stateName}
                      >
                        {stateName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-[0.5rem] [animation:slideInUp_0.6s_ease]">
              <label htmlFor="district" className="block text-[0.95rem] font-semibold text-[#2c3e50] transition-all duration-300 ease-in-out focus-within:text-[#3498db]">{t('district')}</label>
              <div className="relative flex items-center" ref={districtDropdownRef}>
                <svg className="absolute left-[12px] text-[#95a5a6] stroke-current pointer-events-none transition-all duration-300 ease-in-out z-[1]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
                <input
                  id="district"
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleDistrictInputChange}
                  onFocus={() => selectedState && setIsDistrictDropdownOpen(true)}
                  className="w-full p-[0.875rem_0.75rem_0.875rem_2.75rem] border-2 border-[#ecf0f1] rounded-[10px] text-[1rem] text-[#2c3e50] bg-white transition-all duration-300 ease-in-out appearance-none hover:border-[#d5dbdb] hover:bg-[#f8f9fa] focus:outline-none focus:border-[#3498db] focus:bg-[rgba(52,152,219,0.05)] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] disabled:bg-[#f8f9fa] disabled:border-[#ecf0f1] disabled:text-[#95a5a6] disabled:cursor-not-allowed"
                  disabled={!selectedState}
                  autoComplete="address-level2"
                  placeholder={selectedState ? 'Select District' : 'Select state first'}
                />
                <button
                  type="button"
                  className="absolute right-[10px] top-1/2 -translate-y-1/2 border-none bg-transparent text-[#95a5a6] inline-flex items-center justify-center cursor-pointer p-[0.35rem] rounded-[8px] transition-all duration-300 ease-in-out z-[2] hover:not(:disabled):text-[#555] hover:not(:disabled):bg-[#f8f9fa] disabled:cursor-not-allowed disabled:text-[#d5dbdb]"
                  onClick={() => selectedState && setIsDistrictDropdownOpen((prev) => !prev)}
                  aria-label="Toggle district options"
                  disabled={!selectedState}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {isDistrictDropdownOpen && filteredDistrictOptions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-[calc(100%+0.35rem)] list-none m-0 p-[0.35rem] bg-white border border-[#ecf0f1] rounded-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.12)] max-h-[210px] overflow-y-auto z-[30] [animation:slideInDown_0.2s_ease]" role="listbox" aria-label="District options">
                    {filteredDistrictOptions.map((districtName) => (
                      <li
                        key={districtName}
                        className="p-[0.55rem_0.75rem] rounded-[8px] text-[#2c3e50] text-[0.95rem] cursor-pointer transition-all duration-300 ease-in-out hover:bg-[rgba(52,152,219,0.1)] hover:text-[#2980b9]"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleDistrictSelect(districtName)}
                        role="option"
                        aria-selected={formData.district === districtName}
                      >
                        {districtName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-[0.5rem] [animation:slideInUp_0.6s_ease]">
              <label htmlFor="language" className="block text-[0.95rem] font-semibold text-[#2c3e50] transition-all duration-300 ease-in-out focus-within:text-[#3498db]">Preferred Language</label>
              <div className="relative flex items-center">
                <svg className="absolute left-[12px] text-[#95a5a6] stroke-current pointer-events-none transition-all duration-300 ease-in-out z-[1]" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <select
                  id="language"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="w-full p-[0.875rem_0.75rem_0.875rem_2.75rem] border-2 border-[#ecf0f1] rounded-[10px] text-[1rem] text-[#2c3e50] bg-white transition-all duration-300 ease-in-out appearance-none hover:border-[#d5dbdb] hover:bg-[#f8f9fa] focus:outline-none focus:border-[#3498db] focus:bg-[rgba(52,152,219,0.05)] focus:shadow-[0_0_0_3px_rgba(52,152,219,0.1)] disabled:bg-[#f8f9fa] disabled:border-[#ecf0f1] disabled:text-[#95a5a6] disabled:cursor-not-allowed !pl-[2.75rem] !pr-[2.75rem]  bg-no-repeat bg-[right_0.85rem_center] bg-[length:1.25rem] cursor-pointer indent-[0.25rem]"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="ml">മലയാളം (Malayalam)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-[1rem] mt-[1.5rem]">
            {currentStep === 2 && (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="p-[0.875rem_1.5rem] border-none rounded-[10px] text-[1rem] font-semibold cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center gap-[0.5rem] uppercase tracking-[0.5px] bg-[#ecf0f1] text-[#2c3e50] flex-1 hover:bg-[#d5dbdb] hover:-translate-y-[2px] active:translate-y-0"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`p-[0.875rem_1.5rem] border-none rounded-[10px] text-[1rem] font-semibold cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center gap-[0.5rem] uppercase tracking-[0.5px] bg-[linear-gradient(135deg,#3498db,#5dade2)] text-white shadow-[0_4px_16px_rgba(0,0,0,0.12)] w-full hover:not(:disabled):-translate-y-[2px] hover:not(:disabled):shadow-[0_10px_40px_rgba(52,152,219,0.2)] active:not(:disabled):translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-[#95a5a6]  ${loading ? '!bg-[#95a5a6]' : ''}`}
              style={{ flex: currentStep === 1 ? 1 : 'auto' }}
            >
              {loading ? (
                <>
                  <span className="w-[18px] h-[18px] border-2 border-[rgba(255,255,255,0.3)] border-t-white rounded-full animate-[spin_1s_linear_infinite]"></span>
                  <span>Registering...</span>
                </>
              ) : currentStep === 2 ? (
                t('register')
              ) : (
                'Next'
              )}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className="text-center text-[#555] text-[0.9rem] mt-[1.5rem]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#3498db] no-underline font-semibold transition-all duration-300 ease-in-out border-b-2 border-transparent hover:text-[#2980b9] hover:border-[#3498db]">
            {t('login')}
          </Link>
        </p>
      </div>

      <p className="absolute bottom-[1rem] left-1/2 -translate-x-1/2 text-center text-[0.75rem] text-[#95a5a6] max-w-[90%]">
        By logging in, you agree to our <Link to="/terms-of-service" className="text-[#3498db] no-underline font-semibold transition-all duration-300 ease-in-out border-b-2 border-transparent hover:text-[#2980b9] hover:border-[#3498db]">Terms of Service</Link>
      </p>
    </div>
  );
};
export default Register;