import React from 'react';
import CarCard from './CarCard';

export default function CarListingsSection({ 
  darkMode,
  cars, 
  favorites, 
  compareIds = [],
  isSavedView = false,
  onToggleFavorite, 
  onCompare, 
  onViewDetails,
  onBrowse
}) {
  return (
    <section className="space-y-4 pt-2" data-purpose="car-listings">
      {/* Section Title Header */}
      <div className="flex items-end justify-between">
        <div>
          <span className={`text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${
            darkMode ? 'text-slate-400' : 'text-gray-400'
          }`}>{isSavedView ? 'SAVED FOR LATER' : 'THE COLLECTION'}</span>
          <h2 className={`text-xl font-bold tracking-tight ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {isSavedView ? <>Your <span className="font-serif text-2xl font-normal italic">saved cars.</span></> : <>Cars worth <span className={`font-serif italic font-normal text-2xl ${
              darkMode ? 'text-slate-200' : 'text-gray-800'
            }`}>knowing.</span></>}
          </h2>
        </div>
        <button onClick={onBrowse} className={`text-xs font-semibold flex items-center gap-1 transition-colors pb-1 cursor-pointer ${
          darkMode ? 'text-slate-300 hover:text-emerald-400' : 'text-gray-600 hover:text-emerald-600'
        }`}>
          {isSavedView ? 'Explore' : 'View all'}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      </div>

      {/* Car Cards List */}
      <div className="pwa-listing-grid">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            darkMode={darkMode}
            car={car}
            isFavorite={favorites.includes(car.id)}
            isCompared={compareIds.includes(car.id)}
            onToggleFavorite={onToggleFavorite}
            onCompare={onCompare}
            onViewDetails={onViewDetails}
          />
        ))}
        {cars.length === 0 && (
          <div className="border-t border-white/10 py-8" data-purpose="empty-car-list">
            <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {isSavedView ? 'Your saved list is empty' : 'No cars match your search'}
            </h3>
            <p className={`mt-2 text-sm leading-6 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
              {isSavedView ? 'Save a car from Explore and it will appear here.' : 'Try another model or category.'}
            </p>
            {isSavedView && <button className="mt-4 min-h-10 text-sm font-semibold text-emerald-400 cursor-pointer" onClick={onBrowse}>Browse cars →</button>}
          </div>
        )}
      </div>
    </section>
  );
}
