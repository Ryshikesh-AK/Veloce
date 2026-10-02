import React from 'react';
import { motion } from 'framer-motion';
import { hapticCard, hapticAction } from '../utils/haptics';

export default function CarCard({ darkMode, car, isFavorite, isCompared, onToggleFavorite, onCompare, onViewDetails }) {
  const {
    id,
    title,
    rating,
    year,
    category,
    location,
    description,
    price,
    status,
    imageUrl,
    imgObjectPos = 'object-cover'
  } = car;

  return (
    <motion.article 
      whileHover={{ y: -2 }}
      className={`rounded-2xl border overflow-hidden shadow-xl transition-all ${
        darkMode 
          ? 'bg-slate-900/60 backdrop-blur-md border-white/10 text-white hover:border-emerald-500/30' 
          : 'bg-white border-gray-200/70 text-gray-900 shadow-subtle hover:shadow-md'
      }`} 
      data-purpose="car-card"
    >
      {/* Thumbnail Container */}
      <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
        <img 
          alt={title} 
          src={imageUrl} 
          className={`w-full h-full object-cover filter brightness-95 contrast-105 ${imgObjectPos}`} 
        />
        
        {status && status !== 'Available' && (
          <div className="absolute left-3 top-3 rounded-md border border-white/15 bg-slate-950/85 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
            {status}
          </div>
        )}

        {/* Favorite Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            hapticAction();
            onToggleFavorite && onToggleFavorite(id);
          }}
          aria-label={isFavorite ? 'Remove from saved cars' : 'Save car'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-transform cursor-pointer ${
            isFavorite 
              ? 'text-rose-500 border-rose-500/30 bg-slate-950/80' 
              : darkMode 
                ? 'bg-slate-950/80 border-white/10 text-slate-300' 
                : 'bg-white/90 border-gray-200 text-gray-700'
          }`}
        >
          <svg className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 stroke-rose-500' : 'stroke-current fill-transparent'}`} strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </motion.button>

        <div className="absolute bottom-3 right-3">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              hapticAction();
              onCompare && onCompare(car);
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md backdrop-blur-sm text-[10px] text-white font-medium cursor-pointer ${isCompared ? 'bg-emerald-700/90' : 'bg-black/60 hover:bg-black/80'}`}
          >
            <span>{isCompared ? '✓' : '+'}</span> {isCompared ? 'Added' : 'Compare'}
          </motion.button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-base tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
          <div className={`flex items-center text-xs font-semibold ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>
            <span className="text-emerald-500 mr-1">★</span> {rating}
          </div>
        </div>
        
        <p className={`text-[11px] font-medium ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>{year} • {category} • {location}</p>
        {description && <p className={`text-xs line-clamp-2 leading-relaxed ${darkMode ? 'text-slate-300' : 'text-gray-500'}`}>
          {description}
        </p>}

        {/* Card Bottom Divider & Price CTA */}
        <div className={`pt-3 mt-1 border-t flex items-center justify-between ${
          darkMode ? 'border-white/10' : 'border-gray-100'
        }`}>
          <div>
            <span className={`text-[10px] uppercase block font-medium ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>Starting from</span>
            <span className={`text-base font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>{price}</span>
          </div>
          <motion.button 
            whileHover={{ x: 2 }}
            onClick={() => {
              hapticCard();
              onViewDetails && onViewDetails(car);
            }}
            className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 group cursor-pointer"
          >
            View details
            <span className="group-hover:translate-x-0.5 transition-transform text-emerald-500">→</span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}
