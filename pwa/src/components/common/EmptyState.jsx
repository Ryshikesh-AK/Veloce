import React from 'react';

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-start gap-3 border-t border-white/10 py-8">
      <div
        className="grid size-11 place-items-center rounded-full bg-emerald-400/10 text-xl text-emerald-300"
        aria-hidden="true"
      >
        ◇
      </div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="max-w-sm text-sm leading-6 text-slate-400">{description}</p>
      {actionLabel && (
        <button
          type="button"
          className="mt-1 min-h-11 rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-slate-950 hover:bg-emerald-300 transition-colors cursor-pointer"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
