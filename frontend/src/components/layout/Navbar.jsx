import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLang, setActiveLang] = useState(localStorage.getItem('language') || 'en');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const toolsRef = useRef(null);
  const langRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
    setLangDropdownOpen(false);
  }, [location.pathname]);

  const languages = [
    { code: 'en', label: 'English', icon: '🇬🇧' },
    { code: 'hi', label: 'हिन्दी', icon: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', icon: '🇮🇳' },
    { code: 'te', label: 'తెలుగు', icon: '🇮🇳' },
    { code: 'kn', label: 'ಕನ್ನಡ', icon: '🇮🇳' },
    { code: 'ml', label: 'മലയാളം', icon: '🇮🇳' },
    { code: 'gu', label: 'ગુજરાતી', icon: '🇮🇳' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ', icon: '🇮🇳' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
    setActiveLang(lng);
    setLangDropdownOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  };

  const toolRoutes = ['/crops', '/weather', '/soil-analysis', '/market-prices'];
  const isToolsRouteActive = toolRoutes.some((route) => (
    location.pathname === route || location.pathname.startsWith(`${route}/`)
  ));

  const getNavLinkClassName = ({ isActive }) => `navbar-link${isActive ? ' active' : ''}`;

  const getDropdownItemClassName = ({ isActive }) => `dropdown-item${isActive ? ' active' : ''}`;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="navbar-brand" onClick={closeMobileMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="brand-icon">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          <span className="brand-text">Agri-Advisor</span>
        </Link>

        {/* Hamburger Menu */}
        <button 
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navbar Menu */}
        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          {/* Navigation Links */}
          {isAuthenticated && (
            <div className="navbar-links">
              <>
                <NavLink 
                  to="/dashboard" 
                  className={getNavLinkClassName}
                  onClick={closeMobileMenu}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span>{t('selectLocation')}</span>
                </NavLink>
                <NavLink 
                  to="/history" 
                  className={getNavLinkClassName}
                  onClick={closeMobileMenu}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{t('history')}</span>
                </NavLink>
                <NavLink 
                  to="/analytics" 
                  className={getNavLinkClassName}
                  onClick={closeMobileMenu}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20V10M18 20V4M6 20v-4" />
                  </svg>
                  <span>{t('analytics')}</span>
                </NavLink>

                {/* Tools Dropdown */}
                <div className="nav-dropdown" ref={toolsRef}>
                  <button 
                    className={`navbar-link dropdown-toggle${isToolsRouteActive ? ' active' : ''}`}
                    type="button"
                    onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                    aria-expanded={toolsDropdownOpen}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"></rect>
                      <rect x="14" y="3" width="7" height="7"></rect>
                      <rect x="14" y="14" width="7" height="7"></rect>
                      <rect x="3" y="14" width="7" height="7"></rect>
                    </svg>
                    <span>{t('tools')}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`dropdown-chevron ${toolsDropdownOpen ? 'open' : ''}`}>
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  
                  {toolsDropdownOpen && (
                    <div className="dropdown-menu tools-menu">
                      <NavLink to="/crops" className={getDropdownItemClassName} onClick={closeMobileMenu}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="M2 17l10 5 10-5"></path>
                          <path d="M2 12l10 5 10-5"></path>
                        </svg>
                        <span>{t('cropLibrary')}</span>
                      </NavLink>
                      <NavLink to="/weather" className={getDropdownItemClassName} onClick={closeMobileMenu}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2"></path>
                          <circle cx="12" cy="12" r="5"></circle>
                        </svg>
                        <span>{t('weather')}</span>
                      </NavLink>
                      <NavLink to="/soil-analysis" className={getDropdownItemClassName} onClick={closeMobileMenu}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 22h20M12 6V2M6 14v4M12 14v6M18 14v2"></path>
                          <circle cx="12" cy="9" r="3"></circle>
                        </svg>
                        <span>{t('soilAnalysis')}</span>
                      </NavLink>
                      <NavLink to="/market-prices" className={getDropdownItemClassName} onClick={closeMobileMenu}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                        <span>{t('marketPrices')}</span>
                      </NavLink>
                    </div>
                  )}
                </div>

                <NavLink 
                  to="/about" 
                  className={getNavLinkClassName}
                  onClick={closeMobileMenu}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4M12 8h.01"></path>
                  </svg>
                  <span>{t('about')}</span>
                </NavLink>
              </>
            </div>
          )}

          {/* Language Selector Dropdown */}
          <div className="language-dropdown" ref={langRef}>
            <button
              className="lang-toggle"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              title="Select Language"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              <span>{activeLang.toUpperCase()}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`chevron ${langDropdownOpen ? 'open' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>

            {langDropdownOpen && (
              <div className="lang-dropdown-menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`lang-option ${activeLang === lang.code ? 'active' : ''}`}
                    onClick={() => changeLanguage(lang.code)}
                  >
                    <span className="lang-icon">{lang.icon}</span>
                    <span className="lang-label">{lang.label}</span>
                    {activeLang === lang.code && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="checkmark">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Section */}
          <div className="navbar-right">
            {isAuthenticated ? (
              <div className="navbar-user">
                <Link to="/profile" className="user-avatar" onClick={closeMobileMenu} title="Profile">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="logout-btn"
                  title={t('logout')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <div className="navbar-auth">
                <Link 
                  to="/login" 
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  {t('login')}
                </Link>
                <Link 
                  to="/register" 
                  className="navbar-link auth-register"
                  onClick={closeMobileMenu}
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;