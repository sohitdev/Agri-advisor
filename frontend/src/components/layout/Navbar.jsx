import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

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

  const getNavLinkClassName = ({ isActive }) => 
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full md:w-auto ${
      isActive ? 'text-green-700 bg-green-50 font-semibold' : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
    }`;

  const getDropdownItemClassName = ({ isActive }) => 
    `flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
      isActive ? 'text-green-700 bg-green-50 font-semibold' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity" onClick={closeMobileMenu}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-600">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              <span className="font-extrabold text-xl tracking-tight text-gray-900 hidden sm:block">Agri<span className="text-green-600">Advisor</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard" className={getNavLinkClassName}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  <span>{t('selectLocation')}</span>
                </NavLink>
                <NavLink to="/history" className={getNavLinkClassName}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>{t('history')}</span>
                </NavLink>
                <NavLink to="/analytics" className={getNavLinkClassName}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
                  <span>{t('analytics')}</span>
                </NavLink>

                {/* Tools Dropdown */}
                <div className="relative" ref={toolsRef}>
                  <button 
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isToolsRouteActive ? 'text-green-700 bg-green-50 font-semibold' : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                    <span>{t('tools')}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                  
                  {toolsDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50">
                      <NavLink to="/crops" className={getDropdownItemClassName} onClick={closeMobileMenu}>
                        <span>{t('cropLibrary')}</span>
                      </NavLink>
                      <NavLink to="/weather" className={getDropdownItemClassName} onClick={closeMobileMenu}>
                        <span>{t('weather')}</span>
                      </NavLink>
                      <NavLink to="/soil-analysis" className={getDropdownItemClassName} onClick={closeMobileMenu}>
                        <span>{t('soilAnalysis')}</span>
                      </NavLink>
                      <NavLink to="/market-prices" className={getDropdownItemClassName} onClick={closeMobileMenu}>
                        <span>{t('marketPrices')}</span>
                      </NavLink>
                    </div>
                  )}
                </div>

                <NavLink to="/about" className={getNavLinkClassName}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg>
                  <span>{t('about')}</span>
                </NavLink>
              </>
            )}
            
            {/* Language Dropdown Desktop */}
            <div className="relative ml-2" ref={langRef}>
              <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors border border-gray-200">
                <span>{activeLang.toUpperCase()}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-50 max-h-60 overflow-auto">
                  {languages.map((lang) => (
                    <button key={lang.code} onClick={() => changeLanguage(lang.code)} className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-50 ${activeLang === lang.code ? 'text-green-600 font-medium bg-green-50/50' : 'text-gray-700'}`}>
                      <span className="flex items-center gap-2"><span>{lang.icon}</span> <span>{lang.label}</span></span>
                      {activeLang === lang.code && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth / Profile Desktop */}
            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-4">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm hover:ring-2 hover:ring-green-400 hover:ring-offset-2 transition-all">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Link>
                  <button onClick={handleLogout} className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors" title={t('logout')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors">{t('login')}</Link>
                  <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm transition-colors">{t('register')}</Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-gray-600 hover:text-gray-900 rounded-md focus:outline-none">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-xl absolute w-full left-0 z-40">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={getNavLinkClassName} onClick={closeMobileMenu}>{t('selectLocation')}</NavLink>
                <NavLink to="/history" className={getNavLinkClassName} onClick={closeMobileMenu}>{t('history')}</NavLink>
                <NavLink to="/analytics" className={getNavLinkClassName} onClick={closeMobileMenu}>{t('analytics')}</NavLink>
                <div className="py-2">
                  <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('tools')}</p>
                  <NavLink to="/crops" className={getNavLinkClassName} onClick={closeMobileMenu}>{t('cropLibrary')}</NavLink>
                  <NavLink to="/weather" className={getNavLinkClassName} onClick={closeMobileMenu}>{t('weather')}</NavLink>
                  <NavLink to="/soil-analysis" className={getNavLinkClassName} onClick={closeMobileMenu}>{t('soilAnalysis')}</NavLink>
                  <NavLink to="/market-prices" className={getNavLinkClassName} onClick={closeMobileMenu}>{t('marketPrices')}</NavLink>
                </div>
                <NavLink to="/about" className={getNavLinkClassName} onClick={closeMobileMenu}>{t('about')}</NavLink>
                
                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between px-3">
                  <Link to="/profile" className="flex items-center gap-3" onClick={closeMobileMenu}>
                    <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</div>
                    <span className="font-medium text-gray-900">{user?.name || 'User'}</span>
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-red-600 hover:bg-red-50 rounded-md"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg></button>
                </div>
              </>
            ) : (
              <div className="pt-2 pb-4 space-y-2">
                <Link to="/login" className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-base font-medium text-gray-700 bg-white hover:bg-gray-50" onClick={closeMobileMenu}>{t('login')}</Link>
                <Link to="/register" className="block w-full text-center px-4 py-2 border border-transparent rounded-md text-base font-medium text-white bg-green-600 hover:bg-green-700" onClick={closeMobileMenu}>{t('register')}</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
