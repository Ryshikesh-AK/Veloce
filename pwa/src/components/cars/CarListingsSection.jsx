import React from 'react';
import { ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';
import CarCard from './CarCard';

export default function CarListingsSection({ 
  darkMode,
  cars, 
  inventoryCount = cars.length,
  inventoryError = '',
  favorites, 
  compareIds = [],
  isSavedView = false,
  onToggleFavorite, 
  onCompare, 
  onViewDetails,
  onBrowse
}) {
  return (
    <section className="space-y-5 pt-3" data-purpose="car-listings">
      {/* Section Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-extrabold uppercase tracking-widest block ${
              darkMode ? 'text-[#bef264]' : 'text-emerald-700'
            }`}>
              {isSavedView ? 'SAVED FOR LATER' : 'THE COLLECTION'}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-400" />
            <span className={`text-[11px] font-semibold ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {cars.length} {cars.length === 1 ? 'vehicle' : 'vehicles'} available
            </span>
          </div>

          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {isSavedView ? (
              <>Your <span className="font-serif text-2xl sm:text-3xl font-normal italic">saved cars.</span></>
            ) : (
              <>Cars worth <span className={`font-serif italic font-normal text-2xl sm:text-3xl ${
                darkMode ? 'text-[#bef264]' : 'text-emerald-700'
              }`}>knowing.</span></>
            )}
          </h2>
        </div>

        {onBrowse && (
          <button 
            type="button"
            onClick={onBrowse} 
            className={`text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bef264] rounded-lg px-2 py-1 ${
              darkMode ? 'text-slate-300 hover:text-[#bef264]' : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <span>{isSavedView ? 'Explore showroom' : 'View all models'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Car Cards Grid */}
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

        {/* Empty Inventory State */}
        {cars.length === 0 && (
          <div 
            className={`col-span-full py-16 px-6 text-center rounded-2xl border transition-colors ${
              darkMode 
                ? 'bg-[#142131]/60 border-white/10 text-white' 
                : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`} 
            data-purpose="empty-car-list"
          >
            <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center bg-[#bef264]/10 text-[#bef264] mb-3">
              {inventoryError ? <AlertTriangle className="w-6 h-6 text-amber-400" /> : <RotateCcw className="w-6 h-6" />}
            </div>
            <h3 className="text-lg font-bold">
              {isSavedView
                ? inventoryError ? 'Saved vehicles temporarily unavailable' : 'Your saved list is empty'
                : inventoryError ? 'Live showroom inventory unavailable' : inventoryCount === 0 ? 'No vehicles listed yet' : 'No cars match your search criteria'}
            </h3>
            <p className={`mt-2 text-sm leading-6 max-w-md mx-auto ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {isSavedView
                ? inventoryError ? 'Check your internet connection or retry to view your saved cars.' : 'Save cars from the showroom collection and they will be waiting in your private garage.'
                : inventoryError ? 'Could not reach the vehicle catalog. Please retry or check connection.' : inventoryCount === 0 ? 'New arrivals will appear here once cataloged.' : 'Try adjusting your search terms or selecting another category filter.'}
            </p>
            {isSavedView && onBrowse && (
              <button 
                type="button"
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#bef264] text-slate-950 hover:bg-[#aee750] transition cursor-pointer shadow-sm" 
                onClick={onBrowse}
              >
                <span>Browse cars in showroom</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
