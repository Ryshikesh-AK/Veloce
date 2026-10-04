import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { hapticTab } from '../../utils/haptics';
import { useCarContext } from '../../context/CarContext';
import { useAuth } from '../../context/AuthContext';

export default function NavigationHeader() {
  const { darkMode, toggleDarkMode, favorites, compareIds } = useCarContext();
  const { user, isAuthenticated, isAdmin, logout, skipAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const customerLinks = [
    { path: '/', label: 'Explore' },
    { path: '/saved', label: 'Saved', count: favorites.length },
    { path: '/compare', label: 'Compare', count: compareIds.length },
    { path: '/contact', label: 'Contact' }
  ];

  const adminLinks = [
    { path: '/admin', label: 'Overview' },
    { path: '/admin/inventory', label: 'Car Garage' },
    { path: '/admin/customers', label: 'Customers' },
    { path: '/admin/finance', label: 'Financials' }
  ];

  const links = isAdmin ? adminLinks : customerLinks;

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
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(isAdmin ? '/admin' : '/')}>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
          darkMode ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' : 'bg-emerald-50 text-emerald-600'
        }`}>
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"></path>
            <circle cx="7.5" cy="14.5" r="1.5"></circle>
            <circle cx="16.5" cy="14.5" r="1.5"></circle>
          </svg>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            DriveXCars<span className="text-emerald-500">.</span>
          </span>
          {isAdmin && (
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Admin
            </span>
          )}
        </div>
      </div>

      {!isAuthPage && (
        <div className="pwa-desktop-nav" aria-label="Main navigation">
          <div
            className={`rounded-full p-1 flex items-center gap-1 border transition-all ${
              darkMode
                ? 'bg-slate-900/80 border-slate-800'
                : 'bg-slate-100/80 border-slate-200/60'
            }`}
          >
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/' || link.path === '/admin'}
                onClick={() => hapticTab()}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs transition-all duration-200 cursor-pointer no-underline select-none ${
                    isActive
                      ? 'bg-[#bef264] text-slate-950 font-bold shadow-sm scale-102'
                      : darkMode
                        ? 'text-slate-400 hover:text-slate-100 font-medium hover:bg-white/5'
                        : 'text-slate-600 hover:text-slate-900 font-medium hover:bg-black/5'
                  }`
                }
              >
                <span>{link.label}</span>
                {link.count > 0 && (
                  <span
                    className={`inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold ${
                      link.isActive
                        ? 'bg-black text-[#bef264]'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {link.count}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Action Icons: Dark Mode, Admin Portal Link, & User Profile */}
      <div className="flex items-center gap-3">
        {isAdmin && !isAuthPage && !location.pathname.startsWith('/admin') && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
              }`
            }
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
            </svg>
            <span>Admin</span>
          </NavLink>
        )}

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

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div
              title={`Logged in as ${user?.name || 'User'} (${user?.role || 'customer'}). Click to logout`}
              className="relative group cursor-pointer"
              onClick={() => logout()}
            >
              <div
                className={`w-9 h-9 rounded-full font-semibold text-xs flex items-center justify-center border transition-colors ${
                  darkMode ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30' : 'bg-[#141719] text-emerald-500 border-[#141719]'
                }`}
              >
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 rounded-full ${
                  isAdmin ? 'bg-amber-400' : 'bg-emerald-500'
                } ${darkMode ? 'border-slate-950' : 'border-white'}`}
              ></span>
            </div>
          </div>
        ) : isAuthPage ? (
          <button
            onClick={() => {
              skipAuth();
              if (window.history.length > 1 && window.history.state?.idx > 0) {
                navigate(-1);
              } else {
                navigate('/');
              }
            }}
            className={`text-[11px] sm:text-xs font-semibold px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full border transition-all duration-300 flex items-center gap-1 shrink-0 whitespace-nowrap cursor-pointer ${
              darkMode 
                ? 'text-slate-200 hover:text-white bg-slate-900 border-emerald-500/30 hover:border-emerald-500/60' 
                : 'text-slate-700 hover:text-slate-900 bg-white border-slate-200 hover:border-slate-300 shadow-xs'
            }`}
          >
            <span>Skip for now</span>
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className={`group relative overflow-hidden text-xs font-semibold px-4 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              darkMode 
                ? 'bg-slate-900/90 text-slate-100 border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-[0_0_15px_rgba(185,244,61,0.2)]' 
                : 'bg-white text-slate-900 border-slate-200 hover:border-emerald-500/50 hover:shadow-md'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
}
