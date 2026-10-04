import React from 'react';
import { NavLink } from 'react-router-dom';
import { hapticTab } from '../../utils/haptics';
import { useCarContext } from '../../context/CarContext';
import { useAuth } from '../../context/AuthContext';

export default function FloatingBottomDock() {
  const { darkMode, favorites, compareIds } = useCarContext();
  const { isAdmin } = useAuth();

  const customerTabs = [
    {
      id: 'explore',
      label: 'Explore',
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
          <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
          <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
        </svg>
      )
    },
    {
      id: 'saved',
      label: 'Saved',
      path: '/saved',
      badge: favorites.length,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )
    },
    {
      id: 'compare',
      label: 'Compare',
      path: '/compare',
      badge: compareIds.length,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )
    }
  ];

  const adminTabs = [
    {
      id: 'admin-dashboard',
      label: 'Overview',
      path: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'admin-inventory',
      label: 'Garage',
      path: '/admin/inventory',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'admin-add',
      label: 'Add Car',
      path: '/admin/new',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      id: 'admin-customers',
      label: 'Customers',
      path: '/admin/customers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'admin-finance',
      label: 'Finance',
      path: '/admin/finance',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const tabs = isAdmin ? adminTabs : customerTabs;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none ${
        isAdmin ? 'md:hidden' : ''
      }`}
      data-purpose="floating-nav-container"
    >
      <div className="pwa-bottom-dock w-full max-w-lg px-3 pb-3 safe-bottom pointer-events-auto">
        <nav className={`backdrop-blur-xl border rounded-2xl px-2 py-2 shadow-2xl flex items-center justify-around transition-colors ${
          darkMode 
            ? 'bg-slate-900/90 border-white/10 text-white' 
            : 'bg-white/95 border-gray-200/90 text-gray-900 shadow-float'
        }`}>
          {tabs.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.path}
              end={tab.path === '/' || tab.path === '/admin'}
              onClick={() => hapticTab()}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 px-1.5 rounded-full transition-all duration-200 cursor-pointer no-underline select-none ${
                  isActive
                    ? 'bg-[#bef264] text-black font-semibold shadow-xs scale-105'
                    : darkMode
                      ? 'text-slate-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative flex items-center justify-center">
                    {tab.icon}
                    {tab.badge > 0 && (
                      <span
                        className={`absolute -top-1 -right-2 text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none ring-2 ${
                          isActive
                            ? 'bg-black text-[#bef264] ring-[#bef264]'
                            : 'bg-emerald-500 text-white ring-slate-900'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] tracking-tight mt-0.5 transition-colors duration-200 ${
                      isActive
                        ? 'font-bold text-black'
                        : darkMode
                          ? 'font-medium text-slate-400 group-hover:text-white'
                          : 'font-medium text-gray-500 group-hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          {/* Contact Button (Only shown in customer view) */}
          {!isAdmin && (
            <NavLink
              to="/contact"
              onClick={() => hapticTab()}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 px-1.5 rounded-full transition-all duration-200 group cursor-pointer no-underline select-none ${
                  isActive
                    ? 'bg-[#bef264] text-black font-semibold shadow-xs scale-105'
                    : darkMode
                      ? 'text-slate-400 hover:text-white hover:bg-white/5'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-black/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105 ${
                        isActive
                          ? 'bg-black/10 text-black'
                          : darkMode
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-gray-900 text-white'
                      }`}
                    >
                      <svg
                        className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-emerald-400'}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] tracking-tight mt-0.5 transition-colors duration-200 ${
                      isActive
                        ? 'font-bold text-black'
                        : darkMode
                          ? 'font-medium text-slate-400 group-hover:text-white'
                          : 'font-medium text-gray-500 group-hover:text-gray-900'
                    }`}
                  >
                    Contact
                  </span>
                </>
              )}
            </NavLink>
          )}
        </nav>
      </div>
    </div>
  );
}
