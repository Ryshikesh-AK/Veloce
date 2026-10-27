import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function ScreenHeading({ eyebrow, title, description, onBack }) {
  return (
    <div className="space-y-2">
      {onBack && (
        <button
          type="button"
          className="inline-flex min-h-9 items-center gap-2 text-xs font-bold text-emerald-600 dark:text-[#bef264] hover:opacity-80 transition cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bef264] rounded-lg px-2 py-1 -ml-2"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </button>
      )}
      {eyebrow && (
        <div className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-600 dark:text-[#bef264]">
          {eyebrow}
        </div>
      )}
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
        {title}
      </h1>
      {description && (
        <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}
