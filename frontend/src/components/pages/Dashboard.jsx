import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import indiaStatesDistricts from '../../data/indiaStatesDistricts.json';

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
    <div className="min-h-[calc(100vh-80px)] p-4 sm:p-8 bg-slate-50 relative">
      <div className="max-w-[1200px] mx-auto animate-[fadeInUp_0.6s_ease]">
        <div className="text-center mb-12 animate-[slideInDown_0.6s_ease]">
          <h1 className="text-slate-900 mb-3 text-3xl sm:text-4xl md:text-[2.5rem] font-bold tracking-tight text-slate-900">
            {t('welcome')}
          </h1>
          <p className="text-slate-600 text-base sm:text-lg font-normal">
            {t('dashboardSubtitle')}
          </p>
        </div>
        
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-[0_10px_40px_rgba(52,152,219,0.15)] mb-8 transition-all duration-300 ease-in-out hover:shadow-[0_15px_50px_rgba(52,152,219,0.25)] hover:-translate-y-0.5">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4 mb-8 pb-6 border-b-2 border-slate-200">
            <div className="w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-white shadow-[0_4px_12px_rgba(52,152,219,0.3)] transition-all duration-300 hover:scale-105 hover:rotate-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <h2 className="m-0 text-slate-900 text-xl sm:text-2xl font-bold">{t('selectLocation')}</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5 sm:gap-6 items-start">
              <div className="flex flex-col gap-2 animate-[slideInUp_0.6s_ease] min-w-0">
                <label htmlFor="state" className="text-slate-900 font-semibold text-[0.95rem] flex items-center gap-1">
                  {t('state')} <span className="text-[#e74c3c] font-bold">*</span>
                </label>
                <div className="relative flex items-center w-full group focus-within:text-emerald-600" ref={stateDropdownRef}>
                  <svg className="absolute left-3 text-[#95a5a6] pointer-events-none z-10 transition-colors duration-300 group-focus-within:text-emerald-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    className="w-full py-3.5 pl-11 pr-11 border-2 border-slate-200 rounded-xl text-base text-slate-900 bg-white cursor-text transition-all duration-300 appearance-none hover:not(:disabled):border-slate-300 hover:not(:disabled):bg-[#f8f9fa] focus:outline-none focus:border-emerald-600 focus:bg-emerald-50 focus:ring-4 focus:ring-emerald-600/10 focus-visible:outline-2 focus-visible:outline-[#3498db] focus-visible:outline-offset-2"
                    placeholder={t('selectState')}
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 border-none bg-transparent text-[#95a5a6] inline-flex items-center justify-center cursor-pointer p-1.5 rounded-lg transition-all duration-300 z-20 hover:not(:disabled):text-slate-900 hover:not(:disabled):bg-[#f8f9fa] disabled:cursor-not-allowed disabled:text-[#c7cfd3]"
                    onClick={() => setIsStateDropdownOpen((prev) => !prev)}
                    aria-label="Toggle state options"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {isStateDropdownOpen && filteredStateOptions.length > 0 && (
                    <ul className="absolute left-0 right-0 top-[calc(100%+0.35rem)] list-none m-0 p-1.5 bg-white border border-slate-200 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] max-h-[220px] overflow-y-auto z-30" role="listbox" aria-label="State options">
                      {filteredStateOptions.map((stateName) => (
                        <li
                          key={stateName}
                          className="px-3 py-2 rounded-lg text-slate-900 text-[0.95rem] cursor-pointer transition-all duration-200 hover:bg-emerald-600/10 hover:text-[#1f5e8e]"
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

              <div className="flex flex-col gap-2 animate-[slideInUp_0.6s_ease] min-w-0">
                <label htmlFor="district" className="text-slate-900 font-semibold text-[0.95rem] flex items-center gap-1">
                  {t('district')} <span className="text-[#e74c3c] font-bold">*</span>
                </label>
                <div className="relative flex items-center w-full group focus-within:text-emerald-600" ref={districtDropdownRef}>
                  <svg className="absolute left-3 text-[#95a5a6] pointer-events-none z-10 transition-colors duration-300 group-focus-within:text-emerald-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
                    className="w-full py-3.5 pl-11 pr-11 border-2 border-slate-200 rounded-xl text-base text-slate-900 bg-white cursor-text transition-all duration-300 appearance-none hover:not(:disabled):border-slate-300 hover:not(:disabled):bg-[#f8f9fa] focus:outline-none focus:border-emerald-600 focus:bg-emerald-50 focus:ring-4 focus:ring-emerald-600/10 disabled:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-60 disabled:border-[#e0e0e0]"
                    placeholder={selectedState ? t('selectDistrict') : 'Select state first'}
                  />
                  <button
                    type="button"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 border-none bg-transparent text-[#95a5a6] inline-flex items-center justify-center cursor-pointer p-1.5 rounded-lg transition-all duration-300 z-20 hover:not(:disabled):text-slate-900 hover:not(:disabled):bg-[#f8f9fa] disabled:cursor-not-allowed disabled:text-[#c7cfd3]"
                    onClick={() => selectedState && setIsDistrictDropdownOpen((prev) => !prev)}
                    aria-label="Toggle district options"
                    disabled={!selectedState}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  {isDistrictDropdownOpen && filteredDistrictOptions.length > 0 && (
                    <ul className="absolute left-0 right-0 top-[calc(100%+0.35rem)] list-none m-0 p-1.5 bg-white border border-slate-200 rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.12)] max-h-[220px] overflow-y-auto z-30" role="listbox" aria-label="District options">
                      {filteredDistrictOptions.map((districtName) => (
                        <li
                          key={districtName}
                          className="px-3 py-2 rounded-lg text-slate-900 text-[0.95rem] cursor-pointer transition-all duration-200 hover:bg-emerald-600/10 hover:text-[#1f5e8e]"
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

              <div className="flex flex-col gap-2 animate-[slideInUp_0.6s_ease] min-w-0">
                <label htmlFor="season" className="text-slate-900 font-semibold text-[0.95rem] flex items-center gap-1">
                  {t('season')} <span className="text-[#e74c3c] font-bold">*</span>
                </label>
                <div className="relative flex items-center w-full group focus-within:text-emerald-600">
                  <svg className="absolute left-3 text-[#95a5a6] pointer-events-none z-10 transition-colors duration-300 group-focus-within:text-emerald-600" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2v10m0 0L8 8m4 4 4-4"></path>
                  </svg>
                  <select
                    id="season"
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    required
                    className="w-full py-3.5 pl-11 pr-11 border-2 border-slate-200 rounded-xl text-base text-slate-900 bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg_xmlns=%22http://www.w3.org/2000/svg%22_viewBox=%220_0_24_24%22_fill=%22none%22_stroke=%22%232c3e50%22_stroke-width=%222%22_stroke-linecap=%22round%22_stroke-linejoin=%22round%22%3e%3cpolyline_points=%226_9_12_15_18_9%22%3e%3c/polyline%3e%3c/svg%3e')] bg-no-repeat bg-[position:right_0.85rem_center] bg-[size:1.25rem] cursor-pointer transition-all duration-300 appearance-none hover:not(:disabled):border-slate-300 hover:not(:disabled):bg-[#f8f9fa] focus:outline-none focus:border-emerald-600 focus:bg-emerald-50 focus:ring-4 focus:ring-emerald-600/10"
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
              className={`w-full py-3.5 sm:py-4 px-5 sm:px-6 mt-4 bg-gradient-to-br from-[#27ae60] to-[#2ecc71] text-white border-none rounded-xl text-[0.95rem] sm:text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_16px_rgba(39,174,96,0.3)] flex items-center justify-center gap-3 uppercase tracking-wide hover:not(:disabled):-translate-y-0.5 hover:not(:disabled):shadow-[0_6px_24px_rgba(39,174,96,0.4)] hover:not(:disabled):from-[#229954] hover:not(:disabled):to-[#27ae60] active:not(:disabled):translate-y-0 disabled:from-[#95a5a6] disabled:to-[#7f8c8d] disabled:cursor-not-allowed disabled:opacity-70 disabled:shadow-none focus-visible:outline-2 focus-visible:outline-[#3498db] focus-visible:outline-offset-2 ${loading ? 'pointer-events-none from-[#95a5a6] to-[#7f8c8d]' : ''}`}
              disabled={loading || !formData.state || !formData.district}
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>{t('gettingRecommendations')}</span>
                </>
              ) : (
                <>
                  <svg className="shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }
      `}} />
    </div>
  );
};

export default Dashboard;
