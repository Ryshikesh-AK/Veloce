import React from 'react';
import { ArrowDown, Sparkles, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection({ darkMode, onOpenMatchmaker, onExploreCollection }) {
  const handleScrollToInventory = () => {
    if (onExploreCollection) {
      onExploreCollection();
      return;
    }
    const inventoryEl = document.getElementById('inventory-collection');
    if (inventoryEl) {
      inventoryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      data-purpose="hero-section" 
      className="relative overflow-hidden rounded-3xl border transition-all duration-300 mb-6"
    >
      {/* Background Studio Visual Treatment */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-colors duration-300 ${
          darkMode 
            ? 'bg-gradient-to-b from-[#142131] via-[#0b121d] to-[#0b121d] border-white/10' 
            : 'bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#ffffff] border-slate-200/90'
        }`}
      />
      
      {/* Showroom Ambient Lighting Radial Glow */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[340px] rounded-full pointer-events-none blur-3xl opacity-30 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle, #bef264 0%, rgba(190, 242, 100, 0.15) 45%, transparent 70%)'
        }}
      />

      {/* Subtle Studio Grid Overlay */}
      <div className="absolute inset-0 showroom-grid-pattern opacity-40 pointer-events-none" />

      {/* Hero Content Grid */}
      <div className="relative z-10 px-5 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
        {/* Left Column: Editorial Typography & CTAs */}
        <div className="max-w-2xl space-y-5">
          {/* Brand Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-widest backdrop-blur-md transition-colors"
            style={{
              borderColor: darkMode ? 'rgba(190, 242, 100, 0.25)' : 'rgba(163, 230, 53, 0.4)',
              backgroundColor: darkMode ? 'rgba(20, 33, 49, 0.65)' : 'rgba(255, 255, 255, 0.85)',
              color: darkMode ? '#bef264' : '#4d7c0f'
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#bef264] animate-pulse" />
            <span>DriveXCars Motors • Automotive Showroom</span>
          </div>

          {/* Main Heading */}
          <h1 className={`pwa-hero-title tracking-tight transition-colors ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <span className="block text-3xl sm:text-5xl lg:text-6xl font-bold">Find a car that</span>
            <em className="block font-serif italic font-normal text-3xl sm:text-5xl lg:text-6xl mt-1 text-[#bef264] dark:text-[#bef264]">
              feels like you.
            </em>
          </h1>

          {/* Supporting Professional Text */}
          <p className={`text-sm sm:text-base leading-relaxed max-w-xl transition-colors ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Curated luxury, performance, and electric automobiles inspected to the highest standard. Experience transparent pricing, verified vehicle provenance, and personalized concierge guidance.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Primary CTA: Explore Collection (scrolls to inventory) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleScrollToInventory}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-[#bef264] text-slate-950 hover:bg-[#aee750] transition-all shadow-md shadow-[#bef264]/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bef264]"
            >
              <span>Explore the collection</span>
              <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
            </motion.button>

            {/* Secondary CTA: AI Matchmaker */}
            {onOpenMatchmaker && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onOpenMatchmaker}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bef264] ${
                  darkMode
                    ? 'border-white/15 bg-slate-900/70 text-slate-200 hover:text-white hover:bg-slate-850 hover:border-white/25'
                    : 'border-slate-300 bg-white/80 text-slate-700 hover:text-slate-950 hover:bg-white hover:border-slate-400'
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-500 dark:text-[#bef264]" />
                <span>Find my match</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-[#bef264] border border-emerald-500/20">
                  AI Match
                </span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Right Column: Refined Automotive Speedform / Architectural Card */}
        <div className="lg:w-[420px] shrink-0">
          <div className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
            darkMode 
              ? 'bg-[#142131]/80 border-white/10 shadow-xl' 
              : 'bg-white/90 border-slate-200 shadow-lg'
          }`}>
            {/* Automotive Aerodynamic Silhouette Graphic */}
            <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-r from-slate-950 via-[#0b121d] to-[#142131] border border-white/10 p-4">
              {/* Automotive Speedform Vector */}
              <svg 
                className="w-full h-full text-[#bef264]/80 drop-shadow-[0_0_12px_rgba(190,242,100,0.3)]" 
                viewBox="0 0 320 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Aero silhouette curves */}
                <path 
                  d="M15 70 C45 70, 70 68, 95 55 C125 38, 160 32, 215 32 C255 32, 275 42, 295 62 L305 70" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                />
                <path 
                  d="M40 70 C70 65, 105 52, 135 48 C185 42, 240 45, 280 70" 
                  stroke="rgba(255,255,255,0.35)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                />
                {/* Wheel arches & base ground line */}
                <circle cx="65" cy="70" r="14" stroke="#bef264" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="250" cy="70" r="14" stroke="#bef264" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="10" y1="72" x2="310" y2="72" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                {/* Headlight beam */}
                <path d="M295 62 L315 65" stroke="#bef264" strokeWidth="2" strokeLinecap="round" />
              </svg>
              
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-widest bg-black/60 text-[#bef264] border border-[#bef264]/30 backdrop-blur-sm">
                Showroom Grade
              </div>
            </div>

            {/* Showroom Pillars / Authentic Value Points */}
            <div className="mt-4 space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#bef264] shrink-0" />
                <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  Multi-Point Mechanical & Aesthetic Inspection
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-[#bef264] shrink-0" />
                <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  Verified Title & Certified Vehicle Provenance
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs">
                <Compass className="w-4 h-4 text-[#bef264] shrink-0" />
                <span className={`font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  Direct Luxury Concierge & Seamless Logistics
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
