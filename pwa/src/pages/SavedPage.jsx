import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Flame, Eye, Sparkles, TrendingDown } from 'lucide-react';
import SearchAndFilters from '../components/cars/SearchAndFilters';
import CarListingsSection from '../components/cars/CarListingsSection';
import Footer from '../components/layout/Footer';
import { useCarContext } from '../context/CarContext';

export default function SavedPage() {
  const navigate = useNavigate();
  const {
    darkMode,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    cars,
    inventoryError,
    favorites,
    compareIds,
    toggleFavorite,
    toggleCompare,
    openCarDetails,
    setToast
  } = useCarContext();

  const [priceAlertActive, setPriceAlertActive] = useState(false);

  const savedCars = cars.filter((car) => favorites.some((favId) => String(favId) === String(car.id)));

  const handleToggleAlerts = () => {
    const nextState = !priceAlertActive;
    setPriceAlertActive(nextState);
    if (setToast) {
      setToast({
        message: nextState ? 'Price Drop & Showroom Alerts activated for your Wishlist!' : 'Price alerts disabled.',
        type: 'success'
      });
    }
  };

  return (
    <>
      {/* Dynamic Urgency & Price Alert Banner if user has saved cars */}
      {savedCars.length > 0 && (
        <div className={`p-4 rounded-3xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          darkMode 
            ? 'bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-900 border-emerald-500/20' 
            : 'bg-gradient-to-r from-emerald-50 via-white to-white border-emerald-200 shadow-xs'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  VIP Garage Insights
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-500 dark:text-amber-400 border border-amber-400/30 flex items-center gap-1">
                  <Flame className="w-3 h-3" /> 2 High Demand
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Vehicles in your garage receive exclusive price drop and reserve availability notifications.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleAlerts}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 ${
              priceAlertActive
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : darkMode
                  ? 'bg-slate-800 text-slate-200 border border-white/10 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{priceAlertActive ? 'Alerts Active ✓' : 'Notify Price Drops'}</span>
          </button>
        </div>
      )}

      <SearchAndFilters
        darkMode={darkMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <CarListingsSection
        darkMode={darkMode}
        cars={savedCars}
        inventoryCount={cars.length}
        inventoryError={inventoryError}
        favorites={favorites}
        compareIds={compareIds}
        isSavedView={true}
        onToggleFavorite={toggleFavorite}
        onCompare={(car) => toggleCompare(car.id)}
        onViewDetails={openCarDetails}
        onBrowse={() => navigate('/')}
      />
      <Footer darkMode={darkMode} />
    </>
  );
}
