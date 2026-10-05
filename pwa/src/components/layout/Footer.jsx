import React from 'react';

export default function Footer({ darkMode }) {
  return (
    <footer className="pt-4 pb-6 text-center space-y-2" data-purpose="micro-footer">
      <div className={`flex items-center justify-center gap-2 text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'
        }`}>
        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
        <span>Secure marketplace guarantee</span>
      </div>
      <p className={`text-[11px] ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
        © 2026 DriveXCars Motors Inc. All rights reserved.
      </p>
    </footer>
  );
}
