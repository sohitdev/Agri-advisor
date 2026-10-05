import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import indiaStatesDistricts from '../../data/indiaStatesDistricts.json';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    season: 'Kharif'
  });
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);

  const stateDropdownRef = useRef(null);
  const districtDropdownRef = useRef(null);

  const statesData = useMemo(
    () => Object.keys(indiaStatesDistricts).sort((a, b) => a.localeCompare(b)),
    []
  );

  const districtsData = useMemo(() => {
    if (!selectedState) {
      return [];
    }
    return indiaStatesDistricts[selectedState] || [];
  }, [selectedState]);

  const filteredStateOptions = useMemo(() => {
    const query = formData.state.trim().toLowerCase();
    if (!query) {
      return statesData;
    }

    return statesData.filter((stateName) =>
      stateName.toLowerCase().includes(query)
    );
  }, [formData.state, statesData]);

  const filteredDistrictOptions = useMemo(() => {
    const query = formData.district.trim().toLowerCase();
    if (!query) {
      return districtsData;
    }

    return districtsData.filter((districtName) =>
      districtName.toLowerCase().includes(query)
    );
  }, [formData.district, districtsData]);

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

  const getExactStateMatch = (stateName) => {
    const normalized = stateName.trim().toLowerCase();
    if (!normalized) {
      return '';
    }

    return statesData.find((option) => option.toLowerCase() === normalized) || '';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
      ...(e.target.name === 'state' && { district: '' }) // Reset district when state changes
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.state) {
      toast.error('Please select a state');
      return;
    }
    
    if (!formData.district) {
      toast.error('Please select a district');
      return;
    }
    
    if (!formData.season) {
      toast.error('Please select a season');
      return;
    }

    setLoading(true);

    try {
      // Add delay for loading spinner effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const res = await api.post('/recommendations/generate', formData);
      const recommendationPayload = res.data.data || res.data;

      toast.success('Recommendations generated successfully!');
      
      // Navigate to recommendations page with data
      navigate('/recommendations', {
        state: {
          recommendations: recommendationPayload,
          environmentalSnapshot: recommendationPayload.environmentalSnapshot,
          locationInfo: {
            state: formData.state,
            district: formData.district,
            season: formData.season
          }
        }
      });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to get recommendations. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">{t('welcome')}</h1>
          <p className="dashboard-subtitle">
            {t('dashboardSubtitle')}
          </p>
        </div>
        
        <div className="recommendation-form-container">
          <div className="form-header">
            <div className="form-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h2>{t('selectLocation')}</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="recommendation-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="state">{t('state')} <span className="required">*</span></label>
                <div className="select-wrapper searchable-wrapper" ref={stateDropdownRef}>
                  <svg className="select-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    required
                    autoComplete="address-level1"
                    className="form-select searchable-input"
                    placeholder={t('selectState')}
                  />
                  <button
                    type="button"
                    className="search-dropdown-toggle"
                    onClick={() => setIsStateDropdownOpen((prev) => !prev)}
                    aria-label="Toggle state options"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {isStateDropdownOpen && filteredStateOptions.length > 0 && (
                    <ul className="search-dropdown-list" role="listbox" aria-label="State options">
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
                <label htmlFor="district">{t('district')} <span className="required">*</span></label>
                <div className="select-wrapper searchable-wrapper" ref={districtDropdownRef}>
                  <svg className="select-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    required
                    disabled={!selectedState}
                    autoComplete="address-level2"
                    className="form-select searchable-input"
                    placeholder={selectedState ? t('selectDistrict') : 'Select state first'}
                  />
                  <button
                    type="button"
                    className="search-dropdown-toggle"
                    onClick={() => selectedState && setIsDistrictDropdownOpen((prev) => !prev)}
                    aria-label="Toggle district options"
                    disabled={!selectedState}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {isDistrictDropdownOpen && filteredDistrictOptions.length > 0 && (
                    <ul className="search-dropdown-list" role="listbox" aria-label="District options">
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
                <label htmlFor="season">{t('season')} <span className="required">*</span></label>
                <div className="select-wrapper">
                  <svg className="select-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2v10m0 0L8 8m4 4 4-4"></path>
                  </svg>
                  <select
                    id="season"
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="Kharif">Kharif (Monsoon - Jun to Oct)</option>
                    <option value="Rabi">Rabi (Winter - Oct to Mar)</option>
                    <option value="Summer">Summer (Mar to Jun)</option>
                    <option value="Winter">Winter (Nov to Feb)</option>
                    <option value="Autumn">Autumn (Sep to Nov)</option>
                    <option value="Whole Year">Whole Year</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`btn-submit ${loading ? 'btn-loading' : ''}`}
              disabled={loading || !formData.state || !formData.district}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>{t('gettingRecommendations')}</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a10 10 0 1 0 10 10H12V2Z"></path>
                    <path d="M12 2v10h10"></path>
                  </svg>
                  <span>{t('getRecommendations')}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;