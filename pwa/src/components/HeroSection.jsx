import React from 'react';
import { motion } from 'framer-motion';

export default function HeroSection({ darkMode, carCount = 3, brandCount = 24, averageRating = 4.9 }) {
  return (
    <section className="space-y-3" data-purpose="hero-section">
      <div className="flex items-center gap-2">
        <span className="h-[1px] w-4 bg-emerald-500"></span>
        <span className="text-[11px] font-bold tracking-widest text-emerald-500 uppercase">CURATED FOR YOU</span>
      </div>
      <h1 className={`text-3xl sm:text-4xl leading-[1.15] font-extrabold tracking-tight transition-colors ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Find a car that<br />
        <span className={`font-serif italic font-normal text-[1.08em] ${
          darkMode ? 'text-slate-300' : 'text-gray-800'
        }`}>feels like you.</span>
      </h1>
      <p className={`text-xs leading-relaxed max-w-sm transition-colors ${
        darkMode ? 'text-slate-400' : 'text-gray-500'
      }`}>
        A considered collection of exceptional cars, selected for how you live and where you're going.
      </p>

      {/* Key Metrics Horizontal Badges */}
      <div className="grid grid-cols-3 gap-2 pt-2" data-purpose="metrics-grid">
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className={`backdrop-blur-md border shadow-md rounded-xl p-2.5 text-center transition-colors ${
            darkMode ? 'bg-slate-900/60 border-white/10 text-white' : 'bg-white border-gray-100 text-gray-900 shadow-subtle'
          }`}
        >
          <div className="text-base font-bold">{carCount}</div>
          <div className={`text-[10px] font-medium ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>Cars available</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className={`backdrop-blur-md border shadow-md rounded-xl p-2.5 text-center transition-colors ${
            darkMode ? 'bg-slate-900/60 border-white/10 text-white' : 'bg-white border-gray-100 text-gray-900 shadow-subtle'
          }`}
        >
          <div className="text-base font-bold">{brandCount}</div>
          <div className={`text-[10px] font-medium ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>Trusted brands</div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.03 }}
          className={`backdrop-blur-md border shadow-md rounded-xl p-2.5 text-center transition-colors ${
            darkMode ? 'bg-slate-900/60 border-white/10 text-white' : 'bg-white border-gray-100 text-gray-900 shadow-subtle'
          }`}
        >
          <div className="text-base font-bold flex items-center justify-center gap-0.5">
            {averageRating}<span className="text-amber-400 text-xs">★</span>
          </div>
          <div className={`text-[10px] font-medium ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>Average rating</div>
        </motion.div>
      </div>
    </section>
  );
}
