import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Lightbulb, Users, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

const About = () => {
  return (
    <div className="min-h-screen bg-zinc-50 w-full font-sans">
      
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-semibold text-zinc-900 tracking-tight mb-6">
          Empowering Farmers with <span className="text-emerald-600 block mt-2">Data-Driven Intelligence</span>
        </h1>
        <p className="text-xl text-zinc-600 leading-relaxed mb-10 max-w-2xl mx-auto">
          Agri-Advisor bridges the gap between traditional farming wisdom and modern machine learning, delivering precise crop recommendations based on your local environment.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register">
            <Button size="lg">Get Started Free</Button>
          </Link>
          <a href="#mission">
            <Button variant="outline" size="lg">Our Mission</Button>
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Model Accuracy', value: '96.7%' },
              { label: 'Crop Varieties', value: '100+' },
              { label: 'Districts Covered', value: '700+' },
              { label: 'Languages', value: '6' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-semibold tracking-tighter text-emerald-600 mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-zinc-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h2 className="text-3xl font-semibold text-zinc-900 mb-4">Our Mission</h2>
            <p className="text-lg text-zinc-600 leading-relaxed">
              To democratize access to agricultural intelligence. We believe every farmer, regardless of the size of their holding, deserves access to world-class data science to maximize their yield and minimize environmental impact.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-zinc-100 text-zinc-900 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb size={24} />
              </div>
              <h2 className="text-3xl font-semibold text-zinc-900 mb-4">The Vision</h2>
              <p className="text-lg text-zinc-600 leading-relaxed mb-8">
                Building a future where technology and agriculture work in perfect harmony, ensuring global food security through sustainable, intelligent farming practices.
              </p>
              <Link to="/crop-library" className="inline-flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700 transition-colors">
                Explore our crop models <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-zinc-900 text-center text-white px-4">
        <h2 className="text-4xl font-semibold tracking-tight mb-6">Ready to transform your farm?</h2>
        <p className="text-xl text-zinc-400 mb-10">Join the thousands of farmers already using Agri-Advisor.</p>
        <Link to="/register">
          <Button variant="primary" size="lg" className="bg-emerald-500 hover:bg-emerald-400">
            Create Free Account
          </Button>
        </Link>
      </section>
      
    </div>
  );
};

export default About;
