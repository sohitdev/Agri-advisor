import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  // If user is logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden w-full">
      {/* Hero Section */}
      <section className="flex items-center justify-center w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between max-w-[1200px] w-full gap-12 flex-col md:flex-row text-center md:text-left gap-12">
          <div className="flex-1 max-w-2xl mx-auto md:mx-0">
            <div className="inline-block py-2 px-4 flex-wrap inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-emerald-100 text-emerald-800 mb-6">
              <span>{t('landing_badge')}</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] mb-6">
              {t('landing_title')}
              <span className="text-emerald-600"> {t('landing_title_highlight')}</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-[65ch] leading-relaxed mb-8">
              {t('landing_description')}
            </p>
            <div className="flex gap-4 mb-12 flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link to="/register" className="flex items-center gap-3 py-4 px-8 bg-emerald-600 text-white no-underline rounded-xl font-semibold text-[1rem] transition-all duration-300  hover:-translate-y-[3px] hover:shadow-md max-sm:py-3 max-sm:px-5 max-sm:text-[0.85rem] max-sm:w-full max-sm:justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                {t('create_account')}
              </Link>
              <Link to="/login" className="flex items-center gap-3 py-4 px-8 bg-transparent text-emerald-600 no-underline rounded-xl font-semibold text-[1rem] border-2 border-emerald-600 transition-all duration-300 hover:bg-emerald-50 hover:-translate-y-[3px] max-sm:py-3 max-sm:px-5 max-sm:text-[0.85rem] max-sm:w-full max-sm:justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                {t('sign_in')}
              </Link>
            </div>
            <div className="flex items-center gap-8 py-6 border-t border-slate-200 max-md:justify-center max-md:flex-wrap max-sm:flex-col max-sm:gap-3">
              <div className="flex flex-col">
                <span className="text-[2rem] font-[800] text-emerald-600 max-sm:text-[1.5rem]">500+</span>
                <span className="text-[0.9rem] text-slate-500">{t('districts_covered')}</span>
              </div>
              <div className="w-[1px] h-[40px] bg-[rgba(255,255,255,0.2)] max-sm:hidden"></div>
              <div className="flex flex-col">
                <span className="text-[2rem] font-[800] text-emerald-600 max-sm:text-[1.5rem]">50+</span>
                <span className="text-[0.9rem] text-slate-500">{t('crop_types')}</span>
              </div>
              <div className="w-[1px] h-[40px] bg-[rgba(255,255,255,0.2)] max-sm:hidden"></div>
              <div className="flex flex-col">
                <span className="text-[2rem] font-[800] text-emerald-600 max-sm:text-[1.5rem]">96%</span>
                <span className="text-[0.9rem] text-slate-500">{t('accuracy_rate')}</span>
              </div>
            </div>
          </div>
          <div className="flex-[0_0_auto] flex flex-col gap-4 w-[340px] max-w-full max-md:w-full max-md:max-w-[320px]">
            {[
              { icon: '🌾', title: t('crop_rice'), val: '94%', delay: '0.1s' },
              { icon: '🌽', title: t('crop_maize'), val: '87%', delay: '0.3s' },
              { icon: '🌿', title: t('crop_soybean'), val: '82%', delay: '0.5s' }
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center gap-4 py-[1.25rem] px-[1.5rem] bg-[rgba(255,255,255,0.05)] backdrop-blur-[10px] rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 border border-slate-200 hover:-translate-x-[5px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:bg-[rgba(255,255,255,0.08)] max-sm:p-4 animate-[slideInRight_0.6s_ease_forwards] opacity-0`} style={{ animationDelay: item.delay }}>
                <div className="text-[2.5rem] max-sm:text-[2rem]">{item.icon}</div>
                <div className="flex-1 text-left">
                  <h3 className="m-0 mb-1 text-[1.1rem] text-slate-900 max-sm:text-[1rem]">{item.title}</h3>
                  <p className="m-0 mb-2 text-[0.85rem] text-slate-500">{t('suitability_label')}: {item.val}</p>
                  <div className="h-[8px] bg-[rgba(255,255,255,0.1)] rounded-[10px] overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-[10px] transition-[width] duration-1000 ease-in-out" style={{ width: item.val }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-[5rem] px-[5%] bg-[#1a252f] overflow-hidden max-md:py-[3rem] max-md:px-[1rem]">
        <div className="text-center mb-12">
          <h2 className="text-[2rem] font-[700] text-slate-900 mb-2 max-md:text-[1.6rem] max-sm:text-[1.4rem]">{t('why_choose')}</h2>
          <p className="text-[1rem] text-slate-500 max-sm:text-[0.9rem]">{t('empowering_farmers')}</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 max-w-[1100px] mx-auto px-4 max-sm:grid-cols-1 max-sm:gap-4 max-sm:px-0">
          {[
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              ),
              title: t('location_analysis'),
              desc: t('location_desc'),
              iconBg: 'bg-emerald-600 text-[#64B5F6]'
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"></path>
                  <circle cx="12" cy="12" r="5"></circle>
                </svg>
              ),
              title: t('weather_intelligence'),
              desc: t('weather_desc'),
              iconBg: 'bg-emerald-600 text-[#FFB74D]'
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 22h20M12 6V2M6 14v4M12 14v6M18 14v2"></path>
                  <circle cx="12" cy="9" r="3"></circle>
                </svg>
              ),
              title: t('soil_analysis_title'),
              desc: t('soil_desc'),
              iconBg: 'bg-emerald-600 text-[#A1887F]'
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              ),
              title: t('ml_predictions'),
              desc: t('ml_desc'),
              iconBg: 'bg-emerald-600 text-[#81C784]'
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              ),
              title: t('season_specific'),
              desc: t('season_desc'),
              iconBg: 'bg-emerald-600 text-[#BA68C8]'
            },
            {
              icon: (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                </svg>
              ),
              title: t('multi_language'),
              desc: t('multi_lang_desc'),
              iconBg: 'bg-emerald-600 text-[#4DD0E1]'
            }
          ].map((feat, idx) => (
            <div key={idx} className="p-6 bg-[rgba(255,255,255,0.05)] rounded-[16px] transition-all duration-300 border border-slate-200 hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[rgba(76,175,80,0.3)] hover:bg-[rgba(255,255,255,0.08)] max-sm:p-6">
              <div className={`w-[50px] h-[50px] rounded-xl flex items-center justify-center mb-4 ${feat.iconBg}`}>
                {React.cloneElement(feat.icon, { className: 'w-6 h-6' })}
              </div>
              <h3 className="text-[1.1rem] font-semibold text-slate-900 mb-2 max-sm:text-[1.1rem]">{feat.title}</h3>
              <p className="text-[0.9rem] text-slate-500 leading-[1.5] m-0 max-sm:text-[0.85rem]">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      
      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('why_agri_advisor')}</h2>
          <p className="text-lg text-slate-600">{t('features_subtitle')}</p>
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
            <div key={idx} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 mb-4">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-emerald-900 text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('how_it_works')}</h2>
            <p className="text-emerald-100/80 max-w-2xl mx-auto text-lg">{t('three_simple_steps')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-emerald-800" aria-hidden="true" />
            {[
              { step: '1', title: t('step1_title'), desc: t('step1_desc') },
              { step: '2', title: t('step2_title'), desc: t('step2_desc') },
              { step: '3', title: t('step3_title'), desc: t('step3_desc') }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-emerald-800 border-4 border-emerald-900 flex items-center justify-center text-3xl font-bold mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-emerald-100/80">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-[4rem] px-[5%] bg-emerald-600 text-center overflow-hidden max-md:py-[3rem] max-md:px-[1rem]">
        <div className="text-center">
          <h2 className="text-[2rem] font-bold text-white mb-4 max-md:text-[1.6rem] max-sm:text-[1.4rem]">{t('ready_to_grow')}</h2>
          <p className="text-lg text-emerald-50 max-w-[65ch] leading-relaxed mb-8">{t('join_farmers')}</p>
          <Link to="/register" className="inline-flex items-center gap-3 py-4 px-10 bg-white text-emerald-700 no-underline rounded-xl font-bold text-[1.1rem] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-[3px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] max-sm:py-[0.875rem] max-sm:px-[1.5rem] max-sm:text-[0.95rem]">
            {t('get_started_free')}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0e12] py-12 px-[5%] text-slate-900 border-t border-slate-200 max-sm:py-[2rem] max-sm:px-[1rem]">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-6 max-sm:gap-4">
          <div className="text-center">
            <h3 className="text-[1.5rem] m-0 mb-2 max-sm:text-[1.25rem]">🌱 Agri-Advisor</h3>
            <p className="text-slate-600 m-0">{t('footer_tagline')}</p>
          </div>
          <div className="flex gap-8 max-sm:flex-wrap max-sm:justify-center max-sm:gap-y-3 max-sm:gap-x-6 max-sm:text-[0.9rem]">
            <Link to="/about" className="text-slate-600 no-underline transition-colors duration-300 hover:text-emerald-600">{t('about')}</Link>
            <Link to="/terms-of-service" className="text-slate-600 no-underline transition-colors duration-300 hover:text-emerald-600">{t('terms_of_service')}</Link>
            <Link to="/login" className="text-slate-600 no-underline transition-colors duration-300 hover:text-emerald-600">{t('login')}</Link>
            <Link to="/register" className="text-slate-600 no-underline transition-colors duration-300 hover:text-emerald-600">{t('register')}</Link>
          </div>
          <div className="pt-6 border-t border-slate-200 w-full text-center">
            <p className="text-slate-500 m-0 text-[0.9rem]">© 2026 Agri-Advisor. {t('made_with_love')}</p>
          </div>
        </div>
      </footer>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
