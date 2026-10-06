import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

const About = () => {
  return (
    <div className="min-h-screen bg-stone-50 w-full font-sans">
      
      {/* Hero Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <h1 className="text-red-500xl md:text-5xl font-semibold text-stone-900 tracking-tight mb-6">
          How AgriAdvisor Works
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed mb-10 max-w-[65ch] mx-auto">
          AgriAdvisor uses machine learning to match your local soil and climate conditions with optimal crop varieties. We process soil composition, pH levels, and seasonal weather data to recommend crops that have the highest chance of success in your specific environment.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <a href="#details">
            <Button variant="outline" size="lg">Read Details</Button>
          </a>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="details" className="py-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto border-t border-stone-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <div className="w-12 h-12 bg-stone-100 text-stone-900 rounded-lg flex items-center justify-center mb-6">
              <Target size={24} strokeWidth={1.5} />
            </div>
            <h2 className="text-emerald-600xl font-semibold text-stone-900 mb-4">The Methodology</h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Our recommendation engine compares your input data against historical agricultural records and crop requirements. It evaluates Nitrogen, Phosphorus, Potassium (NPK), temperature, humidity, pH, and rainfall to score the suitability of various crops.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg border border-stone-200">
            <div className="w-12 h-12 bg-stone-100 text-stone-900 rounded-lg flex items-center justify-center mb-6">
              <Lightbulb size={24} strokeWidth={1.5} />
            </div>
            <h2 className="text-emerald-600xl font-semibold text-stone-900 mb-4">Limitations</h2>
            <p className="text-lg text-stone-600 leading-relaxed mb-8">
              Recommendations are statistical probabilities based on training data. They do not account for real-time extreme weather events, local pest outbreaks, or market price volatility. Always consult with local agricultural extension officers before making final planting decisions.
            </p>
            <Link to="/crop-library" className="inline-flex items-center text-emerald-500 font-semibold hover:text-emerald-500merald-700 transition-colors">
              Explore crop data requirements <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 bg-stone-950 text-center text-white px-4 border-t border-stone-800">
        <h2 className="text-red-500xl font-semibold tracking-tight mb-6">Try the recommendation tool</h2>
        <p className="text-lg text-stone-400 mb-10 max-w-xl mx-auto">Input your soil data to see how the model evaluates your land.</p>
        <Link to="/register">
          <Button variant="primary" size="lg" className="bg-emerald-500 hover:bg-emerald-500">
            Create Account
          </Button>
        </Link>
      </section>
      
    </div>
  );
};

export default About;
