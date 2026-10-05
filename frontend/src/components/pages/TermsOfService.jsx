import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TermsOfService.css';

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
    <div className="tos-container">
      <div className="tos-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="tos-content">
        {/* Header */}
        <div className="tos-header">
          <Link to="/" className="tos-back-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>
          <div>
            <h1 className="tos-title">Terms of Service</h1>
            <p className="tos-subtitle">Last updated: January 2026</p>
          </div>
        </div>

        {/* Introduction */}
        <div className="tos-intro">
          <p>
            Welcome to <strong>Agri-Advisor AI</strong>, an intelligent agricultural advisory platform designed to help farmers make better crop recommendations based on their location and seasonal data. Please read these Terms of Service carefully before using our platform.
          </p>
        </div>

        {/* Sections */}
        <div className="tos-sections">
          {sections.map((section) => (
            <div key={section.id} className="tos-section">
              <button
                className={`tos-section-header ${expandedSection === section.id ? 'active' : ''}`}
                onClick={() => toggleSection(section.id)}
              >
                <span className="section-title">{section.title}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="section-chevron"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {expandedSection === section.id && (
                <div className="tos-section-content">
                  <p>{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="tos-footer">
          <div className="tos-footer-content">
            <h3>Questions?</h3>
            <p>If you have any questions about these Terms of Service, please contact us at:</p>
            <p className="contact-info">support@agri-advisor.com</p>
            <Link to="/" className="tos-home-btn">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;