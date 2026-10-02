import React from 'react';

export default function ScreenHeading({ eyebrow, title, description, onBack }) {
  return (
    <div className="space-y-3">
      {onBack && (
        <button
          type="button"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 cursor-pointer"
          onClick={onBack}
        >
          <span aria-hidden="true">←</span> Back to cars
        </button>
      )}
      {eyebrow && (
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
          {eyebrow}
        </div>
      )}
      <h1 className="font-serif text-3xl leading-tight text-white">{title}</h1>
      {description && <p className="max-w-sm text-sm leading-6 text-slate-400">{description}</p>}
    </div>
  );
}
