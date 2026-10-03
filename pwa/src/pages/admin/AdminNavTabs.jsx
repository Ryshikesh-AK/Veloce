import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCarContext } from '../../context/CarContext';

export default function AdminNavTabs({ title, description, subtitle, actions }) {
  const { switchRole } = useAuth();
  const { darkMode } = useCarContext();
  const navigate = useNavigate();
  const location = useLocation();

  const subText = description || subtitle;

  const navItems = [
    {
      to: '/admin',
      label: 'Overview',
      exact: true,
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      )
    },
    {
      to: '/admin/inventory',
      label: 'Car Garage',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      to: '/admin/new',
      label: 'Add Vehicle',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      to: '/admin/customers',
      label: 'Customers & Leads',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      to: '/admin/finance',
      label: 'Financials',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <header className="space-y-3 mb-4">
      {/* Top Banner Card */}
      <div
        className={`p-4 sm:px-6 sm:py-4 rounded-2xl border transition-all ${
          darkMode
            ? 'bg-slate-900/90 border-slate-800 shadow-md'
            : 'bg-white border-slate-200/90 shadow-xs'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
          <div className="min-w-0">
            <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {title}
            </h1>
            {subText && (
              <p className={`text-xs sm:text-sm mt-0.5 max-w-2xl truncate sm:whitespace-normal ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {subText}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
            {actions}
          </div>
        </div>
      </div>

      {/* Admin Sub-navigation Tabs */}
      <nav
        aria-label="Admin Sections"
        className={`flex items-center gap-1.5 p-1.5 rounded-xl border overflow-x-auto no-scrollbar ${
          darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100/90 border-slate-200'
        }`}
      >
        {navItems.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer no-underline ${
                isActive
                  ? darkMode
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-emerald-500 text-slate-950 shadow-xs'
                  : darkMode
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
