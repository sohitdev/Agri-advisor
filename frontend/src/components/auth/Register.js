import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify'; // Use react-toastify
import indiaStatesDistricts from '../../data/indiaStatesDistricts.json';
import './Auth.css';

const API_HOST = (process.env.REACT_APP_API_URL || 'http://localhost:5000').replace(/\/$/, '');

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
    <div className="auth-container register-container">
      <div className="auth-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className={`auth-card register-card ${isVisible ? 'visible' : ''}`}>
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h1 className="auth-title">{t('register')}</h1>
          <p className="auth-subtitle">Create your account</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className={`progress-bar ${currentStep >= 1 ? 'active' : ''}`}></div>
          <div className={`progress-bar ${currentStep >= 2 ? 'active' : ''}`}></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Step 1: Personal Info */}
          <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                {t('name')} <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Full Name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {t('email')} <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Email Address"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                {t('password')} <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  className="password-toggle"
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
          <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
            <button
              type="button"
              className="btn-location"
              onClick={handleUseCurrentLocation}
              disabled={geoLoading}
            >
              {geoLoading ? 'Detecting location...' : 'Use Current Location'}
            </button>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="+91 (optional)"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="state" className="form-label">{t('state')}</label>
              <div className="input-wrapper dropdown-wrapper" ref={stateDropdownRef}>
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                  className="form-input"
                  autoComplete="address-level1"
                  placeholder="e.g., Uttar Pradesh"
                />
                <button
                  type="button"
                  className="auth-dropdown-toggle"
                  onClick={() => setIsStateDropdownOpen((prev) => !prev)}
                  aria-label="Toggle state options"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {isStateDropdownOpen && filteredStateOptions.length > 0 && (
                  <ul className="search-dropdown" role="listbox" aria-label="State options">
                    {filteredStateOptions.map((stateName) => (
                      <li
                        key={stateName}
                        className="search-dropdown-item"
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

            <div className="form-group">
              <label htmlFor="district" className="form-label">{t('district')}</label>
              <div className="input-wrapper dropdown-wrapper" ref={districtDropdownRef}>
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                  className="form-input"
                  disabled={!selectedState}
                  autoComplete="address-level2"
                  placeholder={selectedState ? 'Select District' : 'Select state first'}
                />
                <button
                  type="button"
                  className="auth-dropdown-toggle"
                  onClick={() => selectedState && setIsDistrictDropdownOpen((prev) => !prev)}
                  aria-label="Toggle district options"
                  disabled={!selectedState}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                {isDistrictDropdownOpen && filteredDistrictOptions.length > 0 && (
                  <ul className="search-dropdown" role="listbox" aria-label="District options">
                    {filteredDistrictOptions.map((districtName) => (
                      <li
                        key={districtName}
                        className="search-dropdown-item"
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

            <div className="form-group">
              <label htmlFor="language" className="form-label">Preferred Language</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
                <select
                  id="language"
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="form-input form-select"
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
          <div className="form-buttons">
            {currentStep === 2 && (
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn-secondary"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`btn-submit ${loading ? 'btn-loading' : ''}`}
              style={{ flex: currentStep === 1 ? 1 : 'auto' }}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
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
        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            {t('login')}
          </Link>
        </p>
      </div>

      <p className="auth-terms">
        By logging in, you agree to our <Link to="/terms-of-service" className="auth-link">Terms of Service</Link>
      </p>
    </div>
  );
};
export default Register;