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
    <div className="min-h-screen bg-[#0f1419] overflow-x-hidden w-full">
      {/* Hero Section */}
      <section className="flex items-center justify-center py-[clamp(2rem,4vw,4rem)] px-[clamp(1rem,5vw,5%)] w-full gap-12 min-h-[calc(100vh-70px)] overflow-hidden max-[968px]:p-[2rem_1rem] max-[968px]:min-h-auto max-[600px]:p-[1.5rem_1rem]">
        <div className="flex items-center justify-between max-w-[1200px] w-full gap-12 max-[968px]:flex-col max-[968px]:text-center max-[968px]:gap-8">
          <div className="flex-1 flex-wrap max-w-[600px] max-[968px]:max-w-full">
            <div className="inline-block py-2 px-4 flex-wrap bg-[rgba(46,125,50,0.15)] rounded-[50px] text-[0.9rem] text-[#4CAF50] font-semibold mb-6 border border-[rgba(46,125,50,0.3)] max-[600px]:text-[0.8rem] max-[600px]:py-[0.4rem] max-[600px]:px-[0.8rem]">
              <span>{t('landing_badge')}</span>
            </div>
            <h1 className="text-[3rem] font-[800] text-white leading-[1.2] mb-6 max-[968px]:text-[2rem] max-[600px]:text-[1.75rem]">
              {t('landing_title')}
              <span className="bg-[linear-gradient(135deg,#4CAF50,#81C784,#A5D6A7)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent]"> {t('landing_title_highlight')}</span>
            </h1>
            <p className="text-[1.2rem] text-[rgba(255,255,255,0.7)] leading-[1.7] mb-8 max-[600px]:text-[0.95rem]">
              {t('landing_description')}
            </p>
            <div className="flex gap-4 mb-12 max-[968px]:justify-center max-[968px]:flex-wrap max-[600px]:flex-col max-[600px]:w-full max-[600px]:gap-3">
              <Link to="/register" className="flex items-center gap-3 py-4 px-8 bg-[linear-gradient(135deg,#2E7D32,#388E3C)] text-white no-underline rounded-xl font-semibold text-[1rem] transition-all duration-300 shadow-[0_4px_15px_rgba(46,125,50,0.3)] hover:-translate-y-[3px] hover:shadow-[0_8px_25px_rgba(46,125,50,0.4)] max-[600px]:py-3 max-[600px]:px-5 max-[600px]:text-[0.85rem] max-[600px]:w-full max-[600px]:justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                {t('create_account')}
              </Link>
              <Link to="/login" className="flex items-center gap-3 py-4 px-8 bg-transparent text-[#4CAF50] no-underline rounded-xl font-semibold text-[1rem] border-2 border-[#4CAF50] transition-all duration-300 hover:bg-[rgba(46,125,50,0.1)] hover:-translate-y-[3px] max-[600px]:py-3 max-[600px]:px-5 max-[600px]:text-[0.85rem] max-[600px]:w-full max-[600px]:justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                {t('sign_in')}
              </Link>
            </div>
            <div className="flex items-center gap-8 py-6 border-t border-[rgba(255,255,255,0.1)] max-[968px]:justify-center max-[968px]:flex-wrap max-[600px]:flex-col max-[600px]:gap-3">
              <div className="flex flex-col">
                <span className="text-[2rem] font-[800] text-[#4CAF50] max-[600px]:text-[1.5rem]">500+</span>
                <span className="text-[0.9rem] text-[rgba(255,255,255,0.6)]">{t('districts_covered')}</span>
              </div>
              <div className="w-[1px] h-[40px] bg-[rgba(255,255,255,0.2)] max-[600px]:hidden"></div>
              <div className="flex flex-col">
                <span className="text-[2rem] font-[800] text-[#4CAF50] max-[600px]:text-[1.5rem]">50+</span>
                <span className="text-[0.9rem] text-[rgba(255,255,255,0.6)]">{t('crop_types')}</span>
              </div>
              <div className="w-[1px] h-[40px] bg-[rgba(255,255,255,0.2)] max-[600px]:hidden"></div>
              <div className="flex flex-col">
                <span className="text-[2rem] font-[800] text-[#4CAF50] max-[600px]:text-[1.5rem]">96%</span>
                <span className="text-[0.9rem] text-[rgba(255,255,255,0.6)]">{t('accuracy_rate')}</span>
              </div>
            </div>
          </div>
          <div className="flex-[0_0_auto] flex flex-col gap-4 w-[340px] max-w-full max-[968px]:w-full max-[968px]:max-w-[320px]">
            {[
              { icon: '🌾', title: t('crop_rice'), val: '94%', delay: '0.1s' },
              { icon: '🌽', title: t('crop_maize'), val: '87%', delay: '0.3s' },
              { icon: '🌿', title: t('crop_soybean'), val: '82%', delay: '0.5s' }
            ].map((item, idx) => (
              <div key={idx} className={`flex items-center gap-4 py-[1.25rem] px-[1.5rem] bg-[rgba(255,255,255,0.05)] backdrop-blur-[10px] rounded-[16px] shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 border border-[rgba(255,255,255,0.1)] hover:-translate-x-[5px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:bg-[rgba(255,255,255,0.08)] max-[600px]:p-4 animate-[slideInRight_0.6s_ease_forwards] opacity-0`} style={{ animationDelay: item.delay }}>
                <div className="text-[2.5rem] max-[600px]:text-[2rem]">{item.icon}</div>
                <div className="flex-1 text-left">
                  <h3 className="m-0 mb-1 text-[1.1rem] text-white max-[600px]:text-[1rem]">{item.title}</h3>
                  <p className="m-0 mb-2 text-[0.85rem] text-[rgba(255,255,255,0.6)]">{t('suitability_label')}: {item.val}</p>
                  <div className="h-[8px] bg-[rgba(255,255,255,0.1)] rounded-[10px] overflow-hidden">
                    <div className="h-full bg-[linear-gradient(90deg,#4CAF50,#81C784)] rounded-[10px] transition-[width] duration-1000 ease-in-out" style={{ width: item.val }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-[5rem] px-[5%] bg-[#1a252f] overflow-hidden max-[968px]:py-[3rem] max-[968px]:px-[1rem]">
        <div className="text-center mb-12">
          <h2 className="text-[2rem] font-[700] text-white mb-2 max-[968px]:text-[1.6rem] max-[600px]:text-[1.4rem]">{t('why_choose')}</h2>
          <p className="text-[1rem] text-[rgba(255,255,255,0.6)] max-[600px]:text-[0.9rem]">{t('empowering_farmers')}</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 max-w-[1100px] mx-auto px-4 max-[600px]:grid-cols-1 max-[600px]:gap-4 max-[600px]:px-0">
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
              iconBg: 'bg-[linear-gradient(135deg,rgba(21,101,192,0.2),rgba(21,101,192,0.1))] text-[#64B5F6]'
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
              iconBg: 'bg-[linear-gradient(135deg,rgba(230,81,0,0.2),rgba(230,81,0,0.1))] text-[#FFB74D]'
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
              iconBg: 'bg-[linear-gradient(135deg,rgba(93,64,55,0.2),rgba(93,64,55,0.1))] text-[#A1887F]'
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
              iconBg: 'bg-[linear-gradient(135deg,rgba(46,125,50,0.2),rgba(46,125,50,0.1))] text-[#81C784]'
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
              iconBg: 'bg-[linear-gradient(135deg,rgba(123,31,162,0.2),rgba(123,31,162,0.1))] text-[#BA68C8]'
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
              iconBg: 'bg-[linear-gradient(135deg,rgba(0,131,143,0.2),rgba(0,131,143,0.1))] text-[#4DD0E1]'
            }
          ].map((feat, idx) => (
            <div key={idx} className="p-6 bg-[rgba(255,255,255,0.05)] rounded-[16px] transition-all duration-300 border border-[rgba(255,255,255,0.1)] hover:-translate-y-[3px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-[rgba(76,175,80,0.3)] hover:bg-[rgba(255,255,255,0.08)] max-[600px]:p-6">
              <div className={`w-[50px] h-[50px] rounded-xl flex items-center justify-center mb-4 ${feat.iconBg}`}>
                {React.cloneElement(feat.icon, { className: 'w-6 h-6' })}
              </div>
              <h3 className="text-[1.1rem] font-semibold text-white mb-2 max-[600px]:text-[1.1rem]">{feat.title}</h3>
              <p className="text-[0.9rem] text-[rgba(255,255,255,0.6)] leading-[1.5] m-0 max-[600px]:text-[0.85rem]">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-[4rem] px-[5%] bg-[#0f1419] overflow-hidden max-[968px]:py-[3rem] max-[968px]:px-[1rem]">
        <div className="text-center mb-12">
          <h2 className="text-[2rem] font-[700] text-white mb-2 max-[968px]:text-[1.6rem] max-[600px]:text-[1.4rem]">{t('how_it_works')}</h2>
          <p className="text-[1rem] text-[rgba(255,255,255,0.6)] max-[600px]:text-[0.9rem]">{t('three_steps')}</p>
        </div>
        <div className="flex items-stretch justify-center gap-4 max-w-[1000px] mx-auto flex-wrap px-4 max-[968px]:flex-col max-[968px]:items-center max-[968px]:gap-6">
          {[
            {
              num: 1,
              title: t('select_location'),
              desc: t('select_location_desc'),
              icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="max-[600px]:w-[36px] max-[600px]:h-[36px]">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              )
            },
            {
              arrow: true
            },
            {
              num: 2,
              title: t('pick_season'),
              desc: t('pick_season_desc'),
              icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="max-[600px]:w-[36px] max-[600px]:h-[36px]">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              )
            },
            {
              arrow: true
            },
            {
              num: 3,
              title: t('get_recommendations'),
              desc: t('get_recommendations_desc'),
              icon: (
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="max-[600px]:w-[36px] max-[600px]:h-[36px]">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              )
            }
          ].map((item, idx) => item.arrow ? (
            <div key={idx} className="text-[2rem] text-[#4CAF50] font-bold self-center max-[968px]:hidden">→</div>
          ) : (
            <div key={idx} className="flex-[1_1_240px] min-w-[220px] max-w-[280px] bg-[rgba(255,255,255,0.05)] py-8 px-6 rounded-[16px] text-center relative shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] max-[968px]:w-full max-[968px]:max-w-[300px] max-[600px]:py-6 max-[600px]:px-4 max-[600px]:min-w-[auto]">
              <div className="absolute top-[-15px] left-1/2 -translate-x-1/2 w-[40px] h-[40px] bg-[linear-gradient(135deg,#2E7D32,#4CAF50)] text-white rounded-full flex items-center justify-center font-bold text-[1.1rem] shadow-[0_4px_15px_rgba(46,125,50,0.3)]">{item.num}</div>
              <div className="text-[#4CAF50] mb-4 flex justify-center">
                {item.icon}
              </div>
              <h3 className="text-[1.2rem] font-semibold text-white mb-3 max-[600px]:text-[1rem]">{item.title}</h3>
              <p className="text-[0.9rem] text-[rgba(255,255,255,0.6)] leading-[1.5] max-[600px]:text-[0.85rem]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-[4rem] px-[5%] bg-[linear-gradient(135deg,#2E7D32,#1B5E20)] text-center overflow-hidden max-[968px]:py-[3rem] max-[968px]:px-[1rem]">
        <div className="text-center">
          <h2 className="text-[2rem] font-[700] text-white mb-4 max-[968px]:text-[1.6rem] max-[600px]:text-[1.4rem]">{t('ready_to_grow')}</h2>
          <p className="text-[1.2rem] text-[rgba(255,255,255,0.9)] mb-8 max-[600px]:text-[0.95rem]">{t('join_farmers')}</p>
          <Link to="/register" className="inline-flex items-center gap-3 py-4 px-10 bg-white text-[#2E7D32] no-underline rounded-xl font-bold text-[1.1rem] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-[3px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] max-[600px]:py-[0.875rem] max-[600px]:px-[1.5rem] max-[600px]:text-[0.95rem]">
            {t('get_started_free')}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0e12] py-12 px-[5%] text-white border-t border-[rgba(255,255,255,0.1)] max-[600px]:py-[2rem] max-[600px]:px-[1rem]">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-6 max-[600px]:gap-4">
          <div className="text-center">
            <h3 className="text-[1.5rem] m-0 mb-2 max-[600px]:text-[1.25rem]">🌱 Agri-Advisor</h3>
            <p className="text-[rgba(255,255,255,0.7)] m-0">{t('footer_tagline')}</p>
          </div>
          <div className="flex gap-8 max-[600px]:flex-wrap max-[600px]:justify-center max-[600px]:gap-y-3 max-[600px]:gap-x-6 max-[600px]:text-[0.9rem]">
            <Link to="/about" className="text-[rgba(255,255,255,0.8)] no-underline transition-colors duration-300 hover:text-[#81C784]">{t('about')}</Link>
            <Link to="/terms-of-service" className="text-[rgba(255,255,255,0.8)] no-underline transition-colors duration-300 hover:text-[#81C784]">{t('terms_of_service')}</Link>
            <Link to="/login" className="text-[rgba(255,255,255,0.8)] no-underline transition-colors duration-300 hover:text-[#81C784]">{t('login')}</Link>
            <Link to="/register" className="text-[rgba(255,255,255,0.8)] no-underline transition-colors duration-300 hover:text-[#81C784]">{t('register')}</Link>
          </div>
          <div className="pt-6 border-t border-[rgba(255,255,255,0.1)] w-full text-center">
            <p className="text-[rgba(255,255,255,0.6)] m-0 text-[0.9rem]">© 2026 Agri-Advisor. {t('made_with_love')}</p>
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
