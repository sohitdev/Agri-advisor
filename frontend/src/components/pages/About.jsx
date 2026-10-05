import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  const [activeAccordion, setActiveAccordion] = useState(null);

  const features = [
    {
      icon: '🌾',
      title: 'Smart Crop Recommendations',
      description: 'AI-powered system analyzes soil, climate, and season data to recommend the best crops.',
    },
    {
      icon: '🌤️',
      title: 'Weather Intelligence',
      description: 'Real-time weather forecasts and alerts for timely farming decisions.',
    },
    {
      icon: '🌱',
      title: 'Soil Analysis',
      description: 'Comprehensive soil health assessment with nutrient analysis.',
    },
    {
      icon: '📈',
      title: 'Market Prices',
      description: 'Live prices from major mandis to help you sell at the best time.',
    },
    {
      icon: '📚',
      title: 'Crop Library',
      description: 'Detailed information on 100+ crops with growing tips.',
    },
    {
      icon: '📊',
      title: 'Analytics',
      description: 'Visual insights into your farming patterns and history.',
    },
  ];

  const howItWorks = [
    { step: 1, title: 'Select Location', description: 'Choose your state and district', icon: '📍' },
    { step: 2, title: 'Enter Data', description: 'Soil type, temperature, rainfall', icon: '🌡️' },
    { step: 3, title: 'Get Results', description: 'AI recommends best crops', icon: '🤖' },
    { step: 4, title: 'View Insights', description: 'Yield & market predictions', icon: '📋' },
    { step: 5, title: 'Decide', description: 'Plan your farming activities', icon: '✅' },
  ];

  const techStack = [
    { name: 'React', icon: '⚛️', description: 'Frontend' },
    { name: 'Node.js', icon: '🟢', description: 'Backend' },
    { name: 'MongoDB', icon: '🍃', description: 'Database' },
    { name: 'FastAPI', icon: '🐍', description: 'ML Service' },
    { name: 'XGBoost', icon: '🚀', description: 'ML Model' },
    { name: 'Docker', icon: '🐳', description: 'Deploy' },
  ];

  const faqs = [
    {
      question: 'How accurate are the crop recommendations?',
      answer: 'Our ML model achieves over 96% accuracy in top-5 crop recommendations, trained on extensive agricultural data from across India.',
    },
    {
      question: 'Is this service free to use?',
      answer: 'Yes! Agri-Advisor is completely free for all farmers. Our mission is to help Indian farmers make better decisions.',
    },
    {
      question: 'How often is market price data updated?',
      answer: 'Market prices are updated daily from major APMC mandis across India from government portals.',
    },
    {
      question: 'Which regions does this cover?',
      answer: 'We cover all major agricultural states of India with data for 700+ districts.',
    },
  ];

  const team = [
    { name: 'AI Team', role: 'Machine Learning', icon: '🤖' },
    { name: 'Backend', role: 'Server & Database', icon: '⚙️' },
    { name: 'Frontend', role: 'User Interface', icon: '🎨' },
    { name: 'Research', role: 'Agricultural Data', icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-[#0f1419] w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="bg-[linear-gradient(135deg,#1a252f_0%,#0f1419_100%)] py-[clamp(3rem,5vw,5rem)] px-[clamp(1rem,2vw,2rem)] text-center">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-[2.75rem] font-[800] text-white mb-4 max-[768px]:text-[2rem]">🌾 <span className="text-[#4CAF50]">Agri-Advisor</span></h1>
          <p className="text-[1.25rem] text-[rgba(255,255,255,0.7)] mb-8 leading-[1.6] max-[768px]:text-[1rem]">
            Empowering Indian farmers with AI-driven crop recommendations. 
            Making smart farming accessible through machine learning and real-time data.
          </p>
          <div className="flex gap-4 justify-center mb-12 flex-wrap max-[768px]:flex-col max-[768px]:items-center">
            <Link to="/register" className="py-[0.875rem] px-8 bg-[linear-gradient(135deg,#2E7D32,#388E3C)] text-white no-underline rounded-[10px] font-semibold transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(46,125,50,0.3)] max-[768px]:w-full max-[768px]:max-w-[250px] max-[768px]:text-center">Get Started Free</Link>
            <a href="#how-it-works" className="py-[0.875rem] px-8 bg-transparent text-[#4CAF50] no-underline rounded-[10px] font-semibold border-2 border-[rgba(76,175,80,0.5)] transition-all duration-300 hover:bg-[rgba(76,175,80,0.1)] hover:border-[#4CAF50] max-[768px]:w-full max-[768px]:max-w-[250px] max-[768px]:text-center">Learn More</a>
          </div>
          <div className="flex justify-center gap-12 flex-wrap pt-8 border-t border-[rgba(255,255,255,0.1)] max-[768px]:gap-6">
            <div className="text-center">
              <span className="block text-[2rem] font-[700] text-[#4CAF50] max-[768px]:text-[1.5rem]">96.75%</span>
              <span className="text-[0.85rem] text-[rgba(255,255,255,0.6)]">Model Accuracy</span>
            </div>
            <div className="text-center">
              <span className="block text-[2rem] font-[700] text-[#4CAF50] max-[768px]:text-[1.5rem]">100+</span>
              <span className="text-[0.85rem] text-[rgba(255,255,255,0.6)]">Crops</span>
            </div>
            <div className="text-center">
              <span className="block text-[2rem] font-[700] text-[#4CAF50] max-[768px]:text-[1.5rem]">700+</span>
              <span className="text-[0.85rem] text-[rgba(255,255,255,0.6)]">Districts</span>
            </div>
            <div className="text-center">
              <span className="block text-[2rem] font-[700] text-[#4CAF50] max-[768px]:text-[1.5rem]">6</span>
              <span className="text-[0.85rem] text-[rgba(255,255,255,0.6)]">Seasons</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#1a252f] py-[clamp(2rem,4vw,4rem)] px-[clamp(1rem,2vw,2rem)] max-[768px]:py-[3rem] max-[768px]:px-[1.5rem]">
        <div className="text-center mb-10">
          <h2 className="text-[1.75rem] font-[700] text-white mb-2 max-[768px]:text-[1.5rem]">✨ Features</h2>
          <p className="text-[1rem] text-[rgba(255,255,255,0.6)]">Everything you need for smart farming decisions</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 max-w-[1000px] mx-auto max-[768px]:grid-cols-1 max-[768px]:max-w-[400px]">
          {features.map((feature, index) => (
            <div key={index} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[12px] p-6 transition-all duration-300 hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(76,175,80,0.3)] hover:-translate-y-[3px]">
              <span className="text-[2rem] mb-3 block">{feature.icon}</span>
              <h3 className="text-white text-[1rem] font-semibold mb-2">{feature.title}</h3>
              <p className="text-[rgba(255,255,255,0.6)] text-[0.875rem] leading-[1.5] m-0">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-[#0f1419] py-[clamp(2rem,4vw,4rem)] px-[clamp(1rem,2vw,2rem)] max-[768px]:py-[3rem] max-[768px]:px-[1.5rem]">
        <div className="text-center mb-10">
          <h2 className="text-[1.75rem] font-[700] text-white mb-2 max-[768px]:text-[1.5rem]">🔄 How It Works</h2>
          <p className="text-[1rem] text-[rgba(255,255,255,0.6)]">Get personalized crop recommendations in 5 simple steps</p>
        </div>
        <div className="flex justify-center gap-4 flex-wrap max-w-[1100px] mx-auto max-[768px]:flex-col max-[768px]:items-center max-[768px]:gap-6">
          {howItWorks.map((step, index) => (
            <div key={index} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[12px] py-6 px-5 text-center flex-1 min-w-[180px] max-w-[200px] relative max-[768px]:max-w-[280px] max-[768px]:w-full">
              <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 w-[28px] h-[28px] bg-[linear-gradient(135deg,#2E7D32,#4CAF50)] text-white rounded-full flex items-center justify-center font-bold text-[0.85rem]">{step.step}</div>
              <span className="text-[1.75rem] my-3 block">{step.icon}</span>
              <h3 className="text-white text-[0.9rem] font-semibold mb-2">{step.title}</h3>
              <p className="text-[rgba(255,255,255,0.6)] text-[0.8rem] leading-[1.4] m-0">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Section */}
      <section className="bg-[#1a252f] py-[clamp(2rem,4vw,4rem)] px-[clamp(1rem,2vw,2rem)] max-[768px]:py-[3rem] max-[768px]:px-[1.5rem]">
        <div className="text-center mb-10">
          <h2 className="text-[1.75rem] font-[700] text-white mb-2 max-[768px]:text-[1.5rem]">🛠️ Technology Stack</h2>
          <p className="text-[1rem] text-[rgba(255,255,255,0.6)]">Powered by modern tools and frameworks</p>
        </div>
        <div className="flex justify-center gap-4 flex-wrap max-w-[900px] mx-auto">
          {techStack.map((tech, index) => (
            <div key={index} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[10px] py-4 px-5 text-center min-w-[120px]">
              <span className="text-[1.75rem] mb-2 block">{tech.icon}</span>
              <h4 className="text-white text-[0.9rem] m-0 mb-1">{tech.name}</h4>
              <p className="text-[rgba(255,255,255,0.5)] text-[0.75rem] m-0">{tech.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ML Model Info */}
      <section className="bg-[linear-gradient(135deg,rgba(46,125,50,0.1),rgba(46,125,50,0.05))] py-[clamp(2rem,4vw,4rem)] px-[clamp(1rem,2vw,2rem)] max-[768px]:py-[3rem] max-[768px]:px-[1.5rem]">
        <div className="flex gap-12 items-center max-w-[1000px] mx-auto max-[768px]:flex-col max-[768px]:gap-8">
          <div className="flex-1">
            <h2 className="text-white text-[1.5rem] mb-4">🤖 Our ML Model</h2>
            <p className="text-[rgba(255,255,255,0.7)] leading-[1.6] mb-4 text-[0.95rem]">
              Our crop recommendation system uses an advanced XGBoost classifier trained on 
              extensive agricultural data from across India.
            </p>
            <ul className="list-none p-0 my-4">
              <li className="text-[rgba(255,255,255,0.7)] py-[0.35rem] text-[0.9rem]">✅ Soil parameters (N, P, K, pH, organic carbon)</li>
              <li className="text-[rgba(255,255,255,0.7)] py-[0.35rem] text-[0.9rem]">✅ Climate data (temperature, rainfall, humidity)</li>
              <li className="text-[rgba(255,255,255,0.7)] py-[0.35rem] text-[0.9rem]">✅ Geographic location (state, district)</li>
              <li className="text-[rgba(255,255,255,0.7)] py-[0.35rem] text-[0.9rem]">✅ Season-specific crop suitability</li>
            </ul>
            <p className="text-[rgba(255,255,255,0.7)] leading-[1.6] mb-4 text-[0.95rem]">
              The model achieves <strong className="text-[#4CAF50]">96.75% Top-5 accuracy</strong>, 
              meaning the correct crop is within the top 5 recommendations.
            </p>
          </div>
          <div className="flex flex-col gap-4 max-[768px]:flex-row max-[768px]:flex-wrap max-[768px]:justify-center">
            <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] py-4 px-6 text-center min-w-[140px]">
              <span className="block text-[1.5rem] font-[700] text-[#4CAF50]">96.75%</span>
              <span className="text-[0.8rem] text-[rgba(255,255,255,0.6)]">Top-5 Accuracy</span>
            </div>
            <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] py-4 px-6 text-center min-w-[140px]">
              <span className="block text-[1.5rem] font-[700] text-[#4CAF50]">15+</span>
              <span className="text-[0.8rem] text-[rgba(255,255,255,0.6)]">Input Features</span>
            </div>
            <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-[10px] py-4 px-6 text-center min-w-[140px]">
              <span className="block text-[1.5rem] font-[700] text-[#4CAF50]">100K+</span>
              <span className="text-[0.8rem] text-[rgba(255,255,255,0.6)]">Training Samples</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#0f1419] py-[clamp(2rem,4vw,4rem)] px-[clamp(1rem,2vw,2rem)] max-[768px]:py-[3rem] max-[768px]:px-[1.5rem]">
        <div className="text-center mb-10">
          <h2 className="text-[1.75rem] font-[700] text-white mb-2 max-[768px]:text-[1.5rem]">❓ FAQ</h2>
          <p className="text-[1rem] text-[rgba(255,255,255,0.6)]">Frequently asked questions</p>
        </div>
        <div className="max-w-[700px] mx-auto flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`bg-[rgba(255,255,255,0.03)] border rounded-[10px] overflow-hidden transition-all duration-300 ${activeAccordion === index ? 'border-[rgba(76,175,80,0.3)] bg-[rgba(255,255,255,0.05)]' : 'border-[rgba(255,255,255,0.08)]'}`}
            >
              <button 
                className="w-full py-4 px-5 bg-transparent border-none flex justify-between items-center cursor-pointer text-[0.9rem] font-semibold text-white text-left"
                onClick={() => setActiveAccordion(activeAccordion === index ? null : index)}
              >
                <span>{faq.question}</span>
                <span className="text-[#4CAF50] text-[1.25rem] font-normal">{activeAccordion === index ? '−' : '+'}</span>
              </button>
              {activeAccordion === index && (
                <div className="px-5 pb-4">
                  <p className="text-[rgba(255,255,255,0.6)] text-[0.875rem] leading-[1.6] m-0">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-[#1a252f] py-[clamp(2rem,4vw,4rem)] px-[clamp(1rem,2vw,2rem)] max-[768px]:py-[3rem] max-[768px]:px-[1.5rem]">
        <div className="text-center mb-10">
          <h2 className="text-[1.75rem] font-[700] text-white mb-2 max-[768px]:text-[1.5rem]">👥 Our Team</h2>
          <p className="text-[1rem] text-[rgba(255,255,255,0.6)]">Built by passionate developers</p>
        </div>
        <div className="flex justify-center gap-5 flex-wrap max-w-[700px] mx-auto">
          {team.map((member, index) => (
            <div key={index} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-[10px] py-5 px-6 text-center min-w-[140px]">
              <span className="text-[2rem] mb-2 block">{member.icon}</span>
              <h4 className="text-white text-[0.9rem] m-0 mb-1">{member.name}</h4>
              <p className="text-[rgba(255,255,255,0.5)] text-[0.8rem] m-0">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[linear-gradient(135deg,#2E7D32,#1B5E20)] text-center py-16 px-8">
        <h2 className="text-white text-[1.75rem] mb-3 max-[768px]:text-[1.5rem]">Ready to Transform Your Farming?</h2>
        <p className="text-[rgba(255,255,255,0.9)] mb-6 text-[1rem]">Join thousands of farmers making smarter decisions</p>
        <Link to="/register" className="inline-block py-[0.875rem] px-10 bg-white text-[#2E7D32] no-underline rounded-[10px] font-bold transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)]">Create Free Account</Link>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0e12] pt-12 pb-6 px-8 border-t border-[rgba(255,255,255,0.1)]">
        <div className="flex justify-between gap-8 max-w-[1000px] mx-auto mb-8 flex-wrap max-[768px]:flex-col max-[768px]:text-center max-[768px]:gap-6">
          <div>
            <h3 className="text-white text-[1.25rem] m-0 mb-2">🌾 Agri-Advisor</h3>
            <p className="text-[rgba(255,255,255,0.5)] text-[0.85rem] m-0">Empowering Indian Farmers</p>
          </div>
          <div>
            <h4 className="text-white text-[0.9rem] m-0 mb-3">Quick Links</h4>
            <Link to="/dashboard" className="block text-[rgba(255,255,255,0.6)] no-underline text-[0.85rem] py-1 transition-colors duration-200 hover:text-[#4CAF50]">Dashboard</Link>
            <Link to="/crop-library" className="block text-[rgba(255,255,255,0.6)] no-underline text-[0.85rem] py-1 transition-colors duration-200 hover:text-[#4CAF50]">Crop Library</Link>
            <Link to="/weather" className="block text-[rgba(255,255,255,0.6)] no-underline text-[0.85rem] py-1 transition-colors duration-200 hover:text-[#4CAF50]">Weather</Link>
          </div>
          <div>
            <h4 className="text-white text-[0.9rem] m-0 mb-3">Resources</h4>
            <Link to="/terms-of-service" className="block text-[rgba(255,255,255,0.6)] no-underline text-[0.85rem] py-1 transition-colors duration-200 hover:text-[#4CAF50]">Terms of Service</Link>
            <Link to="/" className="block text-[rgba(255,255,255,0.6)] no-underline text-[0.85rem] py-1 transition-colors duration-200 hover:text-[#4CAF50]">Home</Link>
          </div>
        </div>
        <div className="text-center pt-6 border-t border-[rgba(255,255,255,0.1)]">
          <p className="text-[rgba(255,255,255,0.5)] text-[0.85rem] m-0">© 2026 Agri-Advisor. Made with ❤️ for Indian Farmers</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
