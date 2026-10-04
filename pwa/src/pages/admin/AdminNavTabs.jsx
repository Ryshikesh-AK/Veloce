import React from 'react';
import { useCarContext } from '../../context/CarContext';

export default function AdminNavTabs({ title, description, subtitle, actions }) {
  const { darkMode } = useCarContext();
  const subText = description || subtitle;

  return (
    <header className="mb-4">
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
    </header>
  );
}
