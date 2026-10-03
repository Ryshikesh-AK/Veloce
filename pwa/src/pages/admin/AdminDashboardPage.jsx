import React from 'react';
import { useCarContext } from '../../context/CarContext';
import AdminNavTabs from './AdminNavTabs';

export default function AdminDashboardPage() {
  const { cars, darkMode } = useCarContext();

  const totalCars = cars.length;
  const totalValue = cars.reduce((sum, c) => sum + (c.priceAmount || (Number(c.pricePerDay || 0) * 300)), 0);

  // Strict mutually exclusive categorization so Available + Reserved + Sold always equals Total Cars
  const availableCount = cars.filter((c) => {
    const st = (c.status || '').toLowerCase();
    if (st === 'reserved' || st === 'sold') return false;
    return c.isAvailable !== false;
  }).length;

  const reservedCount = cars.filter((c) => {
    const st = (c.status || '').toLowerCase();
    return st === 'reserved' || (c.isAvailable === false && st !== 'sold');
  }).length;

  const soldCount = cars.filter((c) => (c.status || '').toLowerCase() === 'sold').length;

  return (
    <div className="admin-dashboard-page space-y-6 pb-24">
      <AdminNavTabs
        title="Showroom Overview"
        description="Comprehensive dashboard of active luxury fleet, valuation, and vehicle reservation status."
      />

      {/* KPI Status Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Cars */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Cars
            </span>
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {totalCars}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Units</span>
          </div>
          <p className={`text-[11px] mt-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Full inventory fleet
          </p>
        </div>

        {/* Total Fleet Valuation */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Fleet Value
            </span>
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              ${(totalValue / 1000000).toFixed(2)}M
            </span>
          </div>
          <p className={`text-[11px] mt-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Combined asset value
          </p>
        </div>

        {/* Available Cars */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold uppercase tracking-wider text-emerald-500`}>
              Available Cars
            </span>
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500">
              {availableCount}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Ready</span>
          </div>
          <p className={`text-[11px] mt-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Ready for reservation
          </p>
        </div>

        {/* Reserved Cars */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold uppercase tracking-wider text-amber-500`}>
              Reserved Cars
            </span>
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-amber-400/10 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-500">
              {reservedCount}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Engaged</span>
          </div>
          <p className={`text-[11px] mt-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Currently booked / out
          </p>
        </div>

        {/* Sold Cars */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border col-span-2 lg:col-span-1 transition-all ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold uppercase tracking-wider text-rose-500`}>
              Sold Cars
            </span>
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-500">
              {soldCount}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Settled</span>
          </div>
          <p className={`text-[11px] mt-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Completed client deliveries
          </p>
        </div>
      </div>

      {/* Quick Access to Wishlist Leads & Garage Action */}
      <div
        className={`rounded-3xl border p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
          darkMode
            ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/20 border-slate-800'
            : 'bg-gradient-to-r from-white via-slate-50 to-rose-50/30 border-slate-200 shadow-sm'
        }`}
      >
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-rose-500/10 text-rose-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </span>
            <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
              Customer Wishlists & Buyer Outreach
            </h3>
          </div>
          <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            When clients add showroom vehicles to their wishlist, inspect their inquiry profile and direct phone numbers in the Customers section or Garage table to close acquisitions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/admin/customers"
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer no-underline text-center"
          >
            Review Buyer Leads
          </a>
          <a
            href="/admin/inventory"
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all text-center no-underline ${
              darkMode
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Open Car Garage
          </a>
        </div>
      </div>
    </div>
  );
}
