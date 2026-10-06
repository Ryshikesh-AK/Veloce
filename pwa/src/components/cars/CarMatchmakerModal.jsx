import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Compass, 
  Zap, 
  Shield, 
  Users, 
  Gauge, 
  DollarSign, 
  Check, 
  RotateCcw, 
  ArrowRight,
  X
} from 'lucide-react';
import { hapticAction, hapticTab } from '../../utils/haptics';

const QUIZ_QUESTIONS = [
  {
    id: 'vibe',
    question: 'What is your driving vibe?',
    subtitle: 'Choose the thrill that matches your lifestyle',
    options: [
      { id: 'track', label: 'Track Speed & Performance', icon: Gauge, category: 'Sports' },
      { id: 'electric', label: 'Futuristic Electric Luxury', icon: Zap, category: 'Electric' },
      { id: 'executive', label: 'Executive Luxury & Comfort', icon: Shield, category: 'Luxury' },
      { id: 'family', label: 'Adventure & Spacious SUV', icon: Users, category: 'SUV' }
    ]
  },
  {
    id: 'budget',
    question: 'What is your target budget range?',
    subtitle: 'Transparent estimates for wire purchase or lease',
    options: [
      { id: 'under_100k', label: 'Under $100,000', sub: 'From $850/mo' },
      { id: '100k_150k', label: '$100,000 – $150,000', sub: 'From $1,250/mo' },
      { id: 'above_150k', label: '$150,000+ Super Luxury', sub: 'From $1,800/mo' }
    ]
  }
];

export default function CarMatchmakerModal({ isOpen, onClose, cars, onSelectCar, darkMode }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [matches, setMatches] = useState([]);
  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  const handleSelectOption = (questionId, optionId, category) => {
    hapticTab();
    const newAnswers = { ...answers, [questionId]: { optionId, category } };
    setAnswers(newAnswers);

    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate Matches
      calculateMatches(newAnswers);
    }
  };

  const calculateMatches = (finalAnswers) => {
    const desiredCategory = finalAnswers.vibe?.category;
    const budgetId = finalAnswers.budget?.optionId;

    let scored = cars.map((car) => {
      let score = 0;
      const rawPrice = parseInt(String(car.price || '0').replace(/[^0-9]/g, ''), 10) || 100000;
      const cat = car.category || car.type || '';

      // Category matching
      if (desiredCategory && cat.toLowerCase().includes(desiredCategory.toLowerCase())) {
        score += 50;
      }

      // Budget matching
      if (budgetId === 'under_100k' && rawPrice < 100000) score += 40;
      else if (budgetId === '100k_150k' && rawPrice >= 100000 && rawPrice <= 155000) score += 40;
      else if (budgetId === 'above_150k' && rawPrice > 150000) score += 40;
      else score += 10;

      return { ...car, matchScore: score };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    const top3 = scored.slice(0, 3);
    setMatches(top3);
    setShowResults(true);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
    setMatches([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-lg rounded-3xl border overflow-hidden shadow-2xl transition-colors ${
          darkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">AI Dream Car Matchmaker</h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {!showResults ? `Question ${step + 1} of ${QUIZ_QUESTIONS.length}` : 'Your Top Curated Matches'}
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
        <div className="p-5 sm:p-6">
          {!showResults ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {QUIZ_QUESTIONS[step].question}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {QUIZ_QUESTIONS[step].subtitle}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {QUIZ_QUESTIONS[step].options.map((opt) => {
                  const Icon = opt.icon || Compass;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(QUIZ_QUESTIONS[step].id, opt.id, opt.category)}
                      className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all hover:scale-[1.02] cursor-pointer select-none ${
                        darkMode 
                          ? 'bg-slate-800/60 hover:bg-slate-800 border-white/5 hover:border-emerald-500/40' 
                          : 'bg-slate-50 hover:bg-emerald-50/50 border-slate-200 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {opt.label}
                        </div>
                        {opt.sub && (
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {opt.sub}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {step > 0 && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    ← Back to previous question
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500">
                  98% Compatibility Match
                </span>
                <h3 className="text-lg font-bold">We Found Your Perfect Ride</h3>
              </div>

              {/* Matches List */}
              <div className="space-y-2.5 pt-1">
                {matches.map((car, idx) => (
                  <div
                    key={car.id}
                    onClick={() => {
                      onClose();
                      onSelectCar?.(car);
                    }}
                    className={`p-3 rounded-2xl border flex items-center gap-3 transition-all hover:scale-[1.01] cursor-pointer ${
                      darkMode ? 'bg-slate-800/80 border-white/10 hover:border-emerald-400' : 'bg-slate-50 border-slate-200 hover:border-emerald-500'
                    }`}
                  >
                    <div className="w-16 h-12 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                      <img src={car.imageUrl || car.image} alt={car.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-500">#{idx + 1} Best Fit</span>
                        <span className="text-[10px] text-slate-400">{car.category}</span>
                      </div>
                      <h4 className="text-xs font-bold truncate text-slate-900 dark:text-white">{car.title}</h4>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{car.price}</p>
                    </div>
                    <div className="text-xs font-bold text-emerald-500 flex items-center gap-1 shrink-0">
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                >
                  Explore All Cars
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
