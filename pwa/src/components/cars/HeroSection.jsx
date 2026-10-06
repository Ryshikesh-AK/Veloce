import React from 'react';
import { Sparkles, Flame, SlidersHorizontal } from 'lucide-react';

export default function HeroSection({ darkMode, onOpenMatchmaker }) {
  return (
    <section data-purpose="hero-section" className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <h1 className={`pwa-hero-title transition-colors ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          <span>Find a car that</span>
          <em>feels like you.</em>
        </h1>

        {/* AI Dream Car Matchmaker Quick Launcher Pill */}
        {onOpenMatchmaker && (
          <button
            type="button"
            onClick={onOpenMatchmaker}
            className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-[#bef264]/15 to-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>AI Dream Car Matchmaker</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider bg-emerald-500 text-slate-950 font-extrabold">
              Quiz
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
