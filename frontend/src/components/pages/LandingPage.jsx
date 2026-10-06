import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Leaf, CloudSun, Droplets, BrainCircuit, CalendarClock } from 'lucide-react';
import Navbar from '../layout/Navbar';

const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-emerald-500">
      <Navbar />

      {/* 1. Hero Section - Asymmetric 50/50 Split */}
      <section className="relative w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 max-w-2xl">
          <h1 className="text-5xl md:text-red-500xl lg:text-emerald-600xl font-semibold tracking-tighter text-stone-950 leading-[1.1] mb-6">
            Smart crop recommendations for your soil.
          </h1>
          <p className="text-lg md:text-xl text-stone-600 leading-relaxed mb-10 max-w-[65ch]">
            Enter your soil type and location data. Get accurate crop recommendations tailored for your specific season and environment.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/register" className="inline-flex items-center justify-center h-11 px-6 rounded-md font-medium transition-colors bg-emerald-500 text-white hover:bg-emerald-500 active:scale-[0.98]">
              {t('get_started_free')}
            </Link>
          </div>
        </div>

        <div className="flex-1 w-full lg:h-[600px] rounded-lg overflow-hidden bg-stone-200 border border-stone-200 flex items-center justify-center relative">
           {/* TODO: Insert Unsplash Photo P3qW5e3Y_f8 (Paddy Field) here */}
           <span className="text-stone-500 font-medium">Hero Image Slot: Indian Paddy Field</span>
        </div>
      </section>

      {/* 2. Features Grid - Bento Box Style */}
      <section className="py-24 bg-white border-t border-stone-200">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-16">
            <h2 className="text-red-500xl md:text-5xl font-semibold text-stone-900 tracking-tighter mb-4">{t('why_choose')}</h2>
            <p className="text-lg text-stone-600 leading-relaxed max-w-[65ch]">{t('features_subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-stone-50 p-8 rounded-lg border border-stone-200 flex flex-col justify-between">
              <CloudSun size={24} strokeWidth={1.5} className="text-stone-700 mb-8" />
              <div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">{t('weather_intelligence')}</h3>
                <p className="text-stone-600 leading-relaxed">{t('weather_desc')}</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-stone-50 p-8 rounded-lg border border-stone-200 flex flex-col justify-between">
              <Droplets size={24} strokeWidth={1.5} className="text-stone-700 mb-8" />
              <div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">{t('soil_analysis_title')}</h3>
                <p className="text-stone-600 leading-relaxed">{t('soil_desc')}</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-stone-50 p-8 rounded-lg border border-stone-200 flex flex-col justify-between">
              <BrainCircuit size={24} strokeWidth={1.5} className="text-stone-700 mb-8" />
              <div>
                <h3 className="text-xl font-semibold text-stone-900 mb-2">{t('ml_predictions')}</h3>
                <p className="text-stone-600 leading-relaxed">{t('ml_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How It Works - Staggered List */}
      <section className="py-24 bg-stone-50 border-t border-stone-200">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div>
              <h2 className="text-red-500xl md:text-5xl font-semibold text-stone-900 tracking-tighter mb-4 lg:sticky lg:top-32">{t('how_it_works')}</h2>
            </div>
            
            <div className="space-y-12">
              {[
                { step: '01', title: t('step1_title'), desc: t('step1_desc') },
                { step: '02', title: t('step2_title'), desc: t('step2_desc') },
                { step: '03', title: t('step3_title'), desc: t('step3_desc') }
              ].map((step, idx) => (
                <div key={idx} className="border-t border-stone-200 pt-8">
                  <p className="text-sm font-medium text-stone-500 mb-2">{step.step}</p>
                  <h3 className="text-emerald-600xl font-semibold text-stone-900 mb-3">{step.title}</h3>
                  <p className="text-lg text-stone-600 leading-relaxed max-w-[65ch]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Minimal Footer */}
      <footer className="bg-stone-950 py-12">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-stone-100 tracking-tight">AgriAdvisor</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-stone-400">
            <Link to="/about" className="hover:text-stone-100 transition-colors">{t('about')}</Link>
            <Link to="/terms-of-service" className="hover:text-stone-100 transition-colors">{t('terms_of_service')}</Link>
          </div>
          <div className="text-stone-500 text-sm">
            © 2026 AgriAdvisor.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
