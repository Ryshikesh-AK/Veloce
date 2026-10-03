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
    },
    {
      id: 'test-drives',
      label: 'Test Drive',
      path: '/test-drives',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )
    }
  ];

  const adminTabs = [
    {
      id: 'admin-inventory',
      label: 'Inventory',
      path: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      id: 'admin-drives',
      label: 'Requests',
      path: '/test-drives',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      id: 'admin-client-view',
      label: 'Client View',
      path: '/',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    }
  ];

  const tabs = isAdmin ? adminTabs : customerTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none" data-purpose="floating-nav-container">
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
              onClick={() => hapticTab()}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 group transition-colors cursor-pointer no-underline ${
                  isActive 
                    ? 'text-emerald-500 font-semibold' 
                    : darkMode 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-gray-500 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative flex items-center justify-center">
                    {tab.icon}
                    {isActive && (
                      <span className="absolute -bottom-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-sm shadow-emerald-500"></span>
                    )}
                    {tab.badge > 0 && !isActive && (
                      <span className="absolute -top-1 -right-2 bg-emerald-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none ring-2 ring-slate-900">
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] tracking-tight mt-1 ${
                    isActive 
                      ? 'font-semibold text-emerald-500' 
                      : darkMode 
                        ? 'font-medium text-slate-400 group-hover:text-white' 
                        : 'font-medium text-gray-500 group-hover:text-gray-900'
                  }`}>
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          {/* Concierge Button */}
          <NavLink
            to="/concierge"
            onClick={() => hapticTab()}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 py-1 transition-colors group cursor-pointer no-underline ${
                isActive ? 'text-emerald-500' : darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`
            }
          >
            <div className="relative flex items-center justify-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                darkMode ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-gray-900 text-white'
              }`}>
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
            </div>
            <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${
              darkMode ? 'text-slate-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'
            }`}>Concierge</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
}
