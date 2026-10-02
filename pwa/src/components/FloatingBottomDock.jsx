import React from 'react';
import { hapticTab } from '../utils/haptics';

const TAB_PATHS = {
  explore: '/',
  saved: '/wishlist',
  compare: '/compare',
  'test-drive': '/test-drives',
  concierge: '/contact'
};

export default function FloatingBottomDock({ darkMode, activeTab = 'explore', savedCount = 0, compareCount = 0, onNavigate }) {
  const tabs = [
    {
      id: 'explore',
      label: 'Explore',
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
      badge: savedCount,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )
    },
    {
      id: 'compare',
      label: 'Compare',
      badge: compareCount,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )
    },
    {
      id: 'test-drive',
      label: 'Test Drive',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
      )
    }
  ];

  const handleNavigate = (event, tab) => {
    hapticTab();
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !onNavigate) return;
    event.preventDefault();
    onNavigate(tab);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none" data-purpose="floating-nav-container">
      <div className="w-full max-w-[480px] px-3 pb-3 safe-bottom pointer-events-auto">
        <nav className={`backdrop-blur-xl border rounded-2xl px-2 py-2 shadow-2xl flex items-center justify-around transition-colors ${
          darkMode 
            ? 'bg-slate-900/90 border-white/10 text-white' 
            : 'bg-white/95 border-gray-200/90 text-gray-900 shadow-float'
        }`}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <a
                key={tab.id}
                href={TAB_PATHS[tab.id]}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => handleNavigate(event, tab.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 group transition-colors cursor-pointer no-underline ${
                  isActive 
                    ? 'text-emerald-500 font-semibold' 
                    : darkMode 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-gray-500 hover:text-gray-900'
                }`}
              >
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
              </a>
            );
          })}

          {/* Concierge Button */}
          <a
            href={TAB_PATHS.concierge}
            aria-current={activeTab === 'concierge' ? 'page' : undefined}
            onClick={(event) => handleNavigate(event, 'concierge')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors group cursor-pointer no-underline ${
              darkMode ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="relative flex items-center justify-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                darkMode ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-gray-900 text-white'
              }`}>
                <svg className={`w-3.5 h-3.5 ${darkMode ? 'text-emerald-400' : 'text-emerald-400'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
            </div>
            <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${
              darkMode ? 'text-slate-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-900'
            }`}>Concierge</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
