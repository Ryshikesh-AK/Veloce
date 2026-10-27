import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer({ darkMode }) {
  return (
    <footer className="pt-8 pb-10 text-center space-y-2 border-t border-slate-200/80 dark:border-white/5 mt-10" data-purpose="micro-footer">
      <div className={`flex items-center justify-center gap-2 text-xs font-semibold ${
        darkMode ? 'text-slate-300' : 'text-slate-600'
      }`}>
        <ShieldCheck className="w-4 h-4 text-[#bef264]" />
        <span>DriveXCars Motors Verified Showroom Guarantee</span>
      </div>
      <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
        © 2026 DriveXCars Motors. Handcrafted automotive curation. All rights reserved.
      </p>
    </footer>
  );
}
