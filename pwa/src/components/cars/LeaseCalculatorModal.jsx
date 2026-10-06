import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, DollarSign, Calendar, Percent, ShieldCheck, ArrowRight, X } from 'lucide-react';

export default function LeaseCalculatorModal({ isOpen, onClose, car, darkMode }) {
  if (!isOpen || !car) return null;

  const rawPrice = parseInt(String(car.price || '0').replace(/[^0-9]/g, ''), 10) || 120000;
  
  const [downPayment, setDownPayment] = useState(Math.round(rawPrice * 0.15));
  const [termMonths, setTermMonths] = useState(36);
  const [apr, setApr] = useState(4.9);
  const [mode, setMode] = useState('lease'); // 'lease' | 'finance'

  // Estimate lease vs finance payment
  const residualValue = rawPrice * 0.55; // 55% residual for 36mo luxury lease
  const financedAmount = Math.max(0, rawPrice - downPayment);

  let monthlyEstimate = 0;
  if (mode === 'lease') {
    const depreciation = (rawPrice - residualValue - downPayment) / termMonths;
    const rentCharge = (rawPrice + residualValue) * (apr / 2400);
    monthlyEstimate = Math.max(450, Math.round(depreciation + rentCharge));
  } else {
    const monthlyRate = apr / 100 / 12;
    monthlyEstimate = Math.round(
      (financedAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
      (Math.pow(1 + monthlyRate, termMonths) - 1)
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-md rounded-3xl border overflow-hidden shadow-2xl transition-colors ${
          darkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Instant Payment Estimator</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[220px]">
                {car.title} ({car.price})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Lease vs Finance Switch */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('lease')}
              className={`py-2 rounded-lg transition ${
                mode === 'lease' 
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Luxury Lease
            </button>
            <button
              type="button"
              onClick={() => setMode('finance')}
              className={`py-2 rounded-lg transition ${
                mode === 'finance' 
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              Direct Finance
            </button>
          </div>

          {/* Big Monthly Estimate Display */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Estimated Monthly Payment
            </span>
            <div className="text-3xl font-extrabold text-slate-950 dark:text-white flex items-baseline justify-center gap-1">
              <span>${monthlyEstimate.toLocaleString()}</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">/month</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {mode === 'lease' ? `${termMonths} mos lease · 10k mi/yr · $${downPayment.toLocaleString()} down` : `${termMonths} mos financing · ${apr}% APR`}
            </p>
          </div>

          {/* Interactive Sliders */}
          <div className="space-y-4 text-xs font-medium">
            {/* Down Payment */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Down Payment</span>
                <span className="font-bold text-slate-900 dark:text-white">${downPayment.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.round(rawPrice * 0.4)}
                step="1000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Term Months */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Term Length</span>
                <span className="font-bold text-slate-900 dark:text-white">{termMonths} Months</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[24, 36, 48].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTermMonths(t)}
                    className={`py-1.5 rounded-lg border font-bold text-xs transition ${
                      termMonths === t
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t} mo
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[44px] rounded-xl font-bold text-xs bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>Lock Pre-Approval Rate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500">
              Subject to Tier 1 credit approval. Transparent pricing with no dealer markups.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
