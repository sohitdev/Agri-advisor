import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-24 lg:pt-32">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Hero Content (Left) */}
          <div className="flex-1 max-w-2xl text-center md:text-left z-10">
            <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold bg-emerald-100 text-emerald-800 mb-8 border border-emerald-200">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {t('landing_badge')}
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15] mb-6">
              {t('landing_title')} <span className="text-emerald-600 block mt-2">{t('landing_title_highlight')}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed mb-10 mx-auto md:mx-0">
              {t('landing_description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-12">
              <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-emerald-700 hover:-translate-y-1 shadow-lg shadow-emerald-600/20">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                {t('create_account')}
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-200 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-emerald-50 hover:-translate-y-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                {t('sign_in')}
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 pt-8 border-t border-slate-200">
              <div>
                <p className="text-3xl font-bold text-slate-900 mb-1">500+</p>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Districts Covered</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 mb-1">50+</p>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Crop Types</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-emerald-600 mb-1">96%</p>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Accuracy Rate</p>
              </div>
            </div>
          </div>
          
          {/* Hero Visual (Right) */}
          <div className="flex-1 w-full max-w-lg relative z-0 mt-12 md:mt-0">
            <div className="absolute inset-0 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-transform hover:-translate-y-1">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🌾</div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Rice</p>
                    <p className="text-sm text-slate-500">Suitability: 94%</p>
                  </div>
                </div>
                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[94%] h-full bg-emerald-500"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-transform hover:-translate-y-1 ml-4 sm:ml-8">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🌽</div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Maize</p>
                    <p className="text-sm text-slate-500">Suitability: 87%</p>
                  </div>
                </div>
                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[87%] h-full bg-emerald-500"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-transform hover:-translate-y-1 ml-8 sm:ml-16">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">🌿</div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Soybean</p>
                    <p className="text-sm text-slate-500">Suitability: 82%</p>
                  </div>
                </div>
                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[82%] h-full bg-emerald-500"></div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 2. Features Grid */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-4">{t('why_agri_advisor')}</h2>
            <p className="text-xl text-slate-600 leading-relaxed">{t('features_subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"></path><circle cx="12" cy="12" r="5"></circle></svg>,
                title: t('weather_intelligence'),
                desc: t('weather_desc')
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 22h20M12 6V2M6 14v4M12 14v6M18 14v2"></path><circle cx="12" cy="9" r="3"></circle></svg>,
                title: t('soil_analysis_title'),
                desc: t('soil_desc')
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 17l10 5 10-5"></path><path d="M2 12l10 5 10-5"></path></svg>,
                title: t('ml_predictions'),
                desc: t('ml_desc')
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
                title: t('season_specific'),
                desc: t('season_desc')
              },
              {
                icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><line x1="2" y1="12" x2="22" y2="12"></line></svg>,
                title: t('multi_language'),
                desc: t('multi_lang_desc')
              }
            ].map((feat, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feat.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works - Dark Mode Block */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('how_it_works')}</h2>
            <p className="text-xl text-slate-400">{t('three_simple_steps')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-px bg-slate-800" aria-hidden="true" />
            {[
              { step: '1', title: t('step1_title'), desc: t('step1_desc') },
              { step: '2', title: t('step2_title'), desc: t('step2_desc') },
              { step: '3', title: t('step3_title'), desc: t('step3_desc') }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-900 flex items-center justify-center text-3xl font-bold mb-6 text-emerald-400 shadow-xl">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA Footer Banner */}
      <section className="py-20 bg-emerald-600 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">{t('ready_to_grow')}</h2>
          <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto">{t('join_farmers')}</p>
          <Link to="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:-translate-y-1 hover:shadow-2xl">
            {t('get_started_free')}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </section>

      {/* 5. Minimal Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-xl font-bold text-slate-900">Agri-Advisor</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 font-medium text-slate-600">
            <Link to="/about" className="hover:text-emerald-600 transition-colors">{t('about')}</Link>
            <Link to="/terms-of-service" className="hover:text-emerald-600 transition-colors">{t('terms_of_service')}</Link>
          </div>
          <div className="text-slate-500 text-sm">
            © 2026 Agri-Advisor. {t('made_with_love')}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
