import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Thermometer, CloudRain, Wind, Leaf, Search, X, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const SEASONS = ['Kharif', 'Rabi', 'Zaid', 'Summer', 'Winter', 'Autumn', 'Whole Year'];

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    season: ''
  });
  
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Handlers
  const handleStateSelect = async (state) => {
    setFormData(prev => ({ ...prev, state, district: '' }));
    setLoading(true);
    try {
      const response = await api.get(`/locations/districts/${encodeURIComponent(state)}`);
      setDistricts(response.data.districts || []);
    } catch (error) {
      toast.error('Failed to load districts for selected state');
      setDistricts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictSelect = (district) => {
    setFormData(prev => ({ ...prev, district }));
  };

  const handleSeasonSelect = (season) => {
    setFormData(prev => ({ ...prev, season }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.state || !formData.district || !formData.season) {
      toast.error('Please fill all fields');
      return;
    }
    
    setLoading(true);
    toast.info('Analyzing data...', { autoClose: 1500 });
    
    try {
      const response = await api.post('/recommendations/generate', formData);
      setLoading(false);
      navigate('/recommendations', { state: response.data.data });
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Failed to generate recommendations');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-900 mb-4"
          >
            {t('welcome')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-zinc-600"
          >
            {t('dashboardSubtitle')}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
              <MapPin size={24} strokeWidth={2} />
            </div>
            <h2 className="text-2xl font-semibold text-zinc-900">{t('selectLocation')}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* State Field */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-700">{t('state')} <span className="text-emerald-500">*</span></label>
                <div className="relative">
                  <select 
                    value={formData.state}
                    onChange={(e) => handleStateSelect(e.target.value)}
                    className="w-full appearance-none bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  >
                    <option value="" disabled>{t('selectState')}</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={20} />
                </div>
              </div>

              {/* District Field */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-700">{t('district')} <span className="text-emerald-500">*</span></label>
                <div className="relative">
                  <select 
                    value={formData.district}
                    onChange={(e) => handleDistrictSelect(e.target.value)}
                    disabled={!formData.state || loading}
                    className="w-full appearance-none bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>{loading ? t('loadingDistricts') : t('selectDistrict')}</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {loading ? (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-spin" size={20} />
                  ) : (
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={20} />
                  )}
                </div>
              </div>
            </div>

            {/* Season Field */}
            <div className="space-y-4 pt-4">
              <label className="text-sm font-medium text-zinc-700">{t('season')} <span className="text-emerald-500">*</span></label>
              <div className="flex flex-wrap gap-3">
                {SEASONS.map((season) => (
                  <button
                    key={season}
                    type="button"
                    onClick={() => handleSeasonSelect(season)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                      formData.season === season 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20' 
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    {t(season.toLowerCase()) || season}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white rounded-xl font-medium text-lg transition-transform hover:-translate-y-0.5 shadow-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('getRecommendations')}
              </button>
            </div>
            
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
