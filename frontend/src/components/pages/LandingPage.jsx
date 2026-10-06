import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CloudSun, Droplets, BrainCircuit, CalendarClock, Globe2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-zinc-50 w-full font-sans selection:bg-emerald-200">
      
      {/* 1. Hero Section - Asymmetric Premium Layout */}
      <section className="relative w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-32 md:pt-40 lg:pt-48 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          <motion.div 
            className="lg:col-span-7 z-10"
            initial="hidden"
            animate="show"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-zinc-100 text-zinc-600 mb-8 border border-zinc-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2.5"></span>
              {t('landing_badge').replace('🌱 ', '')}
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-zinc-900 leading-[1.05] mb-8">
              {t('landing_title')} <br />
              <span className="text-emerald-600 block mt-2">{t('landing_title_highlight')}</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-zinc-600 max-w-xl leading-relaxed mb-12">
              {t('landing_description')}
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white rounded-lg font-medium text-lg transition-transform hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.1)] hover:bg-zinc-800">
                {t('create_account')}
              </Link>
              <Link to="/login" className="inline-flex items-center justify-center px-8 py-4 bg-white text-zinc-900 border border-zinc-200 rounded-lg font-medium text-lg transition-transform hover:-translate-y-0.5 hover:bg-zinc-50">
                {t('sign_in')}
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Abstract UI representation */}
            <div className="relative bg-white rounded-3xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-zinc-100/80 aspect-[4/5] flex flex-col overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent pointer-events-none" />
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Globe2 size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">Pune, Maharashtra</h3>
                    <p className="text-xs text-zinc-500">Live Analysis</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                {[
                  { name: t('crop_rice', 'Rice'), score: 94, color: 'bg-emerald-500' },
                  { name: t('crop_maize', 'Maize'), score: 87, color: 'bg-emerald-400' },
                  { name: t('crop_soybean', 'Soybean'), score: 82, color: 'bg-emerald-300' }
                ].map((crop, i) => (
                  <div key={i} className={`p-4 bg-zinc-50 rounded-2xl border border-zinc-100 transition-transform duration-500 hover:translate-x-2`} style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-zinc-900">{crop.name}</p>
                      <p className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-md">{crop.score}% Match</p>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div className={`h-full ${crop.color}`} style={{ width: `${crop.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 1.5 Trust Section - Brutalist/Minimal */}
      <section className="py-12 border-y border-zinc-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-200 text-center md:text-left">
            <div className="py-8 md:py-4 md:pr-12">
              <p className="text-5xl font-semibold tracking-tighter text-zinc-900 mb-2">500+</p>
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">{t('districts_covered')}</p>
            </div>
            <div className="py-8 md:py-4 md:px-12">
              <p className="text-5xl font-semibold tracking-tighter text-zinc-900 mb-2">50+</p>
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">{t('crop_types')}</p>
            </div>
            <div className="py-8 md:py-4 md:pl-12">
              <p className="text-5xl font-semibold tracking-tighter text-emerald-600 mb-2">96%</p>
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">{t('accuracy_rate')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Grid - Bento Box Style */}
      <section className="py-32 bg-zinc-50">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-20">
            <h2 className="text-4xl md:text-5xl font-semibold text-zinc-900 tracking-tighter mb-6">{t('why_choose')}</h2>
            <p className="text-xl text-zinc-600 leading-relaxed">{t('features_subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[320px] gap-6">
            {/* Large Card 1 */}
            <div className="md:col-span-8 bg-zinc-900 text-white p-10 rounded-3xl relative overflow-hidden group">
              <div className="relative z-10 max-w-sm h-full flex flex-col justify-between">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                  <CloudSun size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-3">{t('weather_intelligence')}</h3>
                  <p className="text-zinc-400 leading-relaxed text-lg">{t('weather_desc')}</p>
                </div>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-emerald-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>

            {/* Square Card 1 */}
            <div className="md:col-span-4 bg-white p-10 rounded-3xl border border-zinc-200 flex flex-col justify-between hover:border-zinc-300 transition-colors">
              <div className="w-12 h-12 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center">
                <Droplets size={24} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-zinc-900 mb-3">{t('soil_analysis_title')}</h3>
                <p className="text-zinc-500 leading-relaxed">{t('soil_desc')}</p>
              </div>
            </div>

            {/* Square Card 2 */}
            <div className="md:col-span-4 bg-white p-10 rounded-3xl border border-zinc-200 flex flex-col justify-between hover:border-zinc-300 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <BrainCircuit size={24} strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-zinc-900 mb-3">{t('ml_predictions')}</h3>
                <p className="text-zinc-500 leading-relaxed">{t('ml_desc')}</p>
              </div>
            </div>

            {/* Large Card 2 */}
            <div className="md:col-span-8 bg-emerald-50 p-10 rounded-3xl border border-emerald-100 flex flex-col justify-between overflow-hidden relative group">
              <div className="relative z-10 max-w-sm">
                <div className="w-12 h-12 bg-emerald-200/50 text-emerald-800 rounded-full flex items-center justify-center mb-12">
                  <CalendarClock size={24} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-zinc-900 mb-3">{t('season_specific')}</h3>
                  <p className="text-emerald-800/80 leading-relaxed text-lg">{t('season_desc')}</p>
                </div>
              </div>
              <div className="absolute right-0 -bottom-20 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works - Staggered List */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
            <div>
              <h2 className="text-4xl md:text-5xl font-semibold text-zinc-900 tracking-tighter mb-6 sticky top-32">{t('how_it_works')}</h2>
            </div>
            
            <div className="space-y-16">
              {[
                { step: '01', title: t('step1_title'), desc: t('step1_desc') },
                { step: '02', title: t('step2_title'), desc: t('step2_desc') },
                { step: '03', title: t('step3_title'), desc: t('step3_desc') }
              ].map((step, idx) => (
                <div key={idx} className="relative pl-10 border-l border-zinc-200 pb-16 last:pb-0">
                  <div className="absolute left-[-16px] top-0 w-8 h-8 rounded-full bg-white border border-zinc-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-sm font-bold text-zinc-400 tracking-widest mb-4">{step.step}</p>
                  <h3 className="text-3xl font-semibold text-zinc-900 mb-4">{step.title}</h3>
                  <p className="text-xl text-zinc-500 leading-relaxed max-w-md">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CTA Footer Banner */}
      <section className="py-32 bg-zinc-900 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-zinc-900" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter text-white mb-8">{t('ready_to_grow')}</h2>
          <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light">{t('join_farmers')}</p>
          <Link to="/register" className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 text-white rounded-full font-medium text-lg transition-transform hover:-translate-y-1 hover:bg-emerald-400">
            {t('get_started_free')}
            <ArrowRight size={20} strokeWidth={2.5} />
          </Link>
        </div>
      </section>

      {/* 5. Minimal Footer */}
      <footer className="bg-zinc-950 py-12 border-t border-zinc-800">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white tracking-tight">Agri-Advisor</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-zinc-400">
            <Link to="/about" className="hover:text-white transition-colors">{t('about')}</Link>
            <Link to="/terms-of-service" className="hover:text-white transition-colors">{t('terms_of_service')}</Link>
          </div>
          <div className="text-zinc-600 text-sm">
            © 2026 Agri-Advisor. {t('made_with_love')}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
