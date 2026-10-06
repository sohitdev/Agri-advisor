import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Leaf, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'hi', name: 'HI' },
    { code: 'ta', name: 'TA' },
    { code: 'te', name: 'TE' },
    { code: 'kn', name: 'KN' },
    { code: 'ml', name: 'ML' }
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { path: '/dashboard', label: t('dashboard') },
    { path: '/recommendations', label: t('history') },
    { path: '/crop-library', label: t('cropLibrary') },
    { path: '/weather', label: t('weather') },
    { path: '/soil-analysis', label: t('soilAnalysis') },
    { path: '/market-prices', label: t('marketPrices') },
    { path: '/analytics', label: t('analytics') },
    { path: '/about', label: t('about') }
  ];

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-105">
              <Leaf size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-900 group-hover:text-emerald-700 transition-colors">
              Agri<span className="text-emerald-600">Advisor</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {user && navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <Link to="/about" className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors">
                {t('about')}
              </Link>
            )}
          </div>

          {/* Actions (Language, Auth) */}
          <div className="hidden lg:flex items-center gap-4">
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block px-2.5 py-1.5 cursor-pointer outline-none"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>

            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User size={16} />
                    <span>{t('profile')}</span>
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={logout} className="gap-2 text-zinc-600">
                  <LogOut size={16} />
                  <span>{t('logout')}</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">{t('login')}</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">{t('register')}</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center gap-4">
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block px-2 py-1 cursor-pointer outline-none"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            <button
              onClick={toggleMenu}
              className="text-zinc-600 hover:text-zinc-900 focus:outline-none p-2 rounded-lg bg-zinc-50 border border-zinc-200"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {user ? (
              <>
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                      location.pathname === link.path
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-zinc-100 my-2 pt-2 space-y-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-zinc-600 hover:bg-zinc-50"
                  >
                    <User size={18} />
                    {t('profile')}
                  </Link>
                  <button
                    onClick={() => { logout(); setIsMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} />
                    {t('logout')}
                  </button>
                </div>
              </>
            ) : (
              <div className="p-2 space-y-3">
                <Link
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-zinc-600"
                >
                  {t('about')}
                </Link>
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-100">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">{t('login')}</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" className="w-full justify-center">{t('register')}</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
