import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { hapticTab } from '../../utils/haptics';
import { useCarContext } from '../../context/CarContext';

export default function NavigationHeader() {
  const { darkMode, toggleDarkMode, favorites, compareIds } = useCarContext();
  const navigate = useNavigate();

  const links = [
    { path: '/', label: 'Explore' },
    { path: '/saved', label: 'Saved', count: favorites.length },
    { path: '/compare', label: 'Compare', count: compareIds.length },
    { path: '/concierge', label: 'Concierge' }
  ];

  return (
    <nav 
      className={`pwa-header px-5 pt-3 pb-2 flex items-center justify-between sticky top-0 z-20 backdrop-blur-xl transition-colors ${
        darkMode 
          ? 'bg-slate-950/85 border-b border-white/10 text-white' 
          : 'bg-[#FBFBFC]/90 border-b border-gray-100 text-gray-900'
      }`} 
      data-purpose="app-header"
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
          darkMode ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-emerald-50 text-emerald-600'
        }`}>
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"></path>
            <circle cx="7.5" cy="14.5" r="1.5"></circle>
            <circle cx="16.5" cy="14.5" r="1.5"></circle>
          </svg>
        </div>
        <span className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          DriveXCars<span className="text-emerald-500">.</span>
        </span>
      </div>

      <div className="pwa-desktop-nav" aria-label="Main navigation">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {link.label}
            {link.count > 0 && <span>{link.count}</span>}
          </NavLink>
        ))}
      </div>

      {/* Action Icons: Dark Mode & User Profile */}
      <div className="flex items-center gap-3">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle dark mode" 
          onClick={() => {
            hapticTab();
            toggleDarkMode();
          }}
          className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer shadow-xs ${
            darkMode 
              ? 'bg-slate-900 border-white/10 text-amber-400 hover:bg-slate-800' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`} 
          type="button"
        >
          {darkMode ? (
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          )}
        </motion.button>
        <div className="relative">
          <div className={`w-9 h-9 rounded-full font-semibold text-xs flex items-center justify-center border transition-colors ${
            darkMode ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' : 'bg-[#141719] text-emerald-500 border-[#141719]'
          }`}>
            JM
          </div>
          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 rounded-full ${
            darkMode ? 'border-slate-950' : 'border-white'
          }`}></span>
        </div>
      </div>
    </nav>
  );
}
