import React from 'react';
import CarCard from './CarCard';

export default function CarListingsSection({ 
  darkMode,
  cars, 
  favorites, 
  onToggleFavorite, 
  onCompare, 
  onViewDetails 
}) {
  return (
    <section className="space-y-4 pt-2" data-purpose="car-listings">
      {/* Section Title Header */}
      <div className="flex items-end justify-between">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${
            darkMode ? 'text-slate-400' : 'text-gray-400'
          }`}>THE COLLECTION</span>
          <h2 className={`text-xl font-bold tracking-tight ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Cars worth <span className={`font-serif italic font-normal text-2xl ${
              darkMode ? 'text-slate-200' : 'text-gray-800'
            }`}>knowing.</span>
          </h2>
        </div>
        <a href="#view-all" className={`text-xs font-semibold flex items-center gap-1 transition-colors pb-1 ${
          darkMode ? 'text-slate-300 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'
        }`}>
          View all 
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </a>
      </div>

      {/* Car Cards List */}
      <div className="space-y-4">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            darkMode={darkMode}
            car={car}
            isFavorite={favorites.includes(car.id)}
            onToggleFavorite={onToggleFavorite}
            onCompare={onCompare}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </section>
  );
}
