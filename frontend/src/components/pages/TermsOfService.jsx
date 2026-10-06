import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: `By accessing and using Agri-Advisor AI, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      id: 'use-license',
      title: 'Use License',
      content: `Permission is granted to temporarily download one copy of the materials (information or software) on Agri-Advisor AI's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
      
• Modifying or copying the materials
• Using the materials for any commercial purpose or for any public display
• Attempting to reverse engineer any software contained on the website
• Removing any copyright or other proprietary notations from the materials
• Transferring the materials to another person or "mirroring" the materials on any other server`
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer',
      content: `The materials on Agri-Advisor AI's website are provided on an 'as is' basis. Agri-Advisor AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.`
    },
    {
      id: 'limitations',
      title: 'Limitations',
      content: `In no event shall Agri-Advisor AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the website, even if we or an authorized representative has been notified orally or in writing of the possibility of such damage.`
    },
    {
      id: 'accuracy',
      title: 'Accuracy of Materials',
      content: `The materials appearing on Agri-Advisor AI's website could include technical, typographical, or photographic errors. Agri-Advisor AI does not warrant that any of the materials on the website are accurate, complete, or current. Agri-Advisor AI may make changes to the materials contained on the website at any time without notice.`
    },
    {
      id: 'materials',
      title: 'Materials and Links',
      content: `Agri-Advisor AI has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Agri-Advisor AI of the site. Use of any such linked website is at the user's own risk. If you notice that a material or link on the website violates your rights, please notify us.`
    },
    {
      id: 'modifications',
      title: 'Modifications',
      content: `Agri-Advisor AI may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.`
    },
    {
      id: 'governing',
      title: 'Governing Law',
      content: `These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.`
    },
    {
      id: 'user-data',
      title: 'User Data & Privacy',
      content: `We collect information you provide to us such as name, email, phone number, location (state and district), and preferred language for the purpose of providing better agricultural recommendations. We use this data responsibly and never share it with third parties without your consent. Your data is stored securely and you can request deletion at any time.`
    }
  ];

  return (
    <div className="relative overflow-hidden min-h-screen px-4 py-8 sm:px-6 lg:px-8 max-sm:p-4" >
      <style>{`
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute rounded-full blur-[60px] opacity-20 mix-blend-multiply w-[300px] h-[300px] max-sm:w-[150px] max-sm:h-[150px] -top-[50px] -right-[50px]" 
          
        ></div>
        <div 
          className="absolute rounded-full blur-[60px] opacity-20 mix-blend-multiply w-[300px] h-[300px] max-sm:w-[150px] max-sm:h-[150px] -bottom-[50px] -left-[50px]" 
          
        ></div>
      </div>

      <div 
        className="max-w-[900px] mx-auto bg-white rounded-lg p-12 max-md:p-8 max-sm:p-6 max-sm:rounded-md relative z-10" 
        style={{ boxShadow: '0 10px 40px rgba(52, 152, 219, 0.2)', animation: 'slideInUp 0.6s ease' }}
      >
        {/* Header */}
        <div className="flex items-start gap-6 max-md:gap-4 max-sm:gap-3 mb-8 max-sm:mb-6 pb-8 border-b-2 border-stone-200 flex-wrap">
          <Link 
            to="/" 
            className="flex items-center justify-center w-12 h-12 max-md:w-10 max-md:h-10 rounded-full text-white shrink-0 mt-1 transition-all duration-300 hover:-translate-x-[3px]"
            
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>
          <div>
            <h1 className="text-[2.5rem] max-md:text-[1.8rem] max-sm:text-[1.5rem] text-stone-900 mb-2 font-bold">Terms of Service</h1>
            <p className="text-stone-600 text-[0.95rem] max-sm:text-[0.85rem]">Last updated: January 2026</p>
          </div>
        </div>

        {/* Introduction */}
        <div className="border-l-4 border-emerald-600 p-6 max-sm:p-4 rounded-lg mb-8 max-sm:mb-6 text-[1rem] max-sm:text-[0.9rem] leading-[1.6] text-stone-900" >
          <p className="m-0">
            Welcome to <strong className="text-emerald-500">Agri-Advisor AI</strong>, an intelligent agricultural advisory platform designed to help farmers make better crop recommendations based on their location and seasonal data. Please read these Terms of Service carefully before using our platform.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-4 mb-8">
          {sections.map((section) => (
            <div 
              key={section.id} 
              className="border border-stone-200 rounded-[10px] overflow-hidden transition-all duration-300 hover:border-emerald-500merald-400"
              style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
            >
              <button
                className={`flex justify-between items-center w-full px-6 py-5 max-sm:px-5 max-sm:py-4 border-none transition-all duration-300 text-left text-[1.1rem] max-sm:text-[1rem] font-semibold ${expandedSection === section.id ? 'text-white' : 'text-stone-900 hover:text-emerald-600'}`}
                style={{ 
                  background: expandedSection === section.id 
                    ? '' 
                    : (expandedSection === section.id ? ', #ffffff)' : '')
                }}
                onClick={() => toggleSection(section.id)}
              >
                <span className="flex-1">{section.title}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-transform duration-300 ${expandedSection === section.id ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {expandedSection === section.id && (
                <div 
                  className="p-6 max-sm:p-5 bg-white border-t border-stone-200"
                  style={{ animation: 'slideInUp 0.3s ease' }}
                >
                  <p className="m-0 leading-[1.8] text-stone-900 text-[0.95rem] max-sm:text-[0.9rem] whitespace-pre-wrap break-words">{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="rounded-[10px] p-8 max-sm:p-6 border border-stone-200 text-center" >
          <div>
            <h3 className="text-[1.3rem] max-sm:text-[1.1rem] text-stone-900 mb-3">Questions?</h3>
            <p className="text-stone-600 mb-2 leading-[1.6]">If you have any questions about these Terms of Service, please contact us at:</p>
            <p className="font-semibold text-emerald-500 text-[1rem] mb-6">support@agri-advisor.com</p>
            <Link 
              to="/" 
              className="inline-block px-8 py-3 max-sm:px-6 max-sm:py-[0.6rem] max-sm:text-[0.9rem] text-white no-underline rounded-lg font-semibold transition-all duration-300 hover:-translate-y-[2px]"
              
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
