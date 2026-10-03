import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarContext } from '../../context/CarContext';
import AdminNavTabs from './AdminNavTabs';
import AdminEditModal from './AdminEditModal';
import AdminCarLeadsModal from './AdminCarLeadsModal';
import { INITIAL_LEADS, CUSTOMER_LEADS_STORAGE_KEY } from '../../data/customerLeads';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function AdminDashboardPage() {
  const { cars, toggleCarStatus, darkMode } = useCarContext();
  const [customerLeads, setCustomerLeads] = useLocalStorage(CUSTOMER_LEADS_STORAGE_KEY, INITIAL_LEADS);
  const navigate = useNavigate();

  // Selected filter from clicking the KPI cards: 'all' | 'valuation' | 'available' | 'reserved' | 'sold' | 'customers'
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [editingCar, setEditingCar] = useState(null);
  const [inspectingLeadsCar, setInspectingLeadsCar] = useState(null);

  const totalCars = cars.length;
  const totalValue = cars.reduce((sum, c) => sum + (c.priceAmount || (Number(c.pricePerDay || 0) * 300)), 0);

  // Categorizations
  const availableCars = cars.filter((c) => {
    const st = (c.status || '').toLowerCase();
    if (st === 'reserved' || st === 'sold') return false;
    return c.isAvailable !== false;
  });

  const reservedCars = cars.filter((c) => {
    const st = (c.status || '').toLowerCase();
    return st === 'reserved' || (c.isAvailable === false && st !== 'sold');
  });

  const soldCars = cars.filter((c) => (c.status || '').toLowerCase() === 'sold');

  const availableCount = availableCars.length;
  const reservedCount = reservedCars.length;
  const soldCount = soldCars.length;
  const totalCustomersCount = customerLeads.length;

  // Active list based on clicked KPI card
  const filteredVehicles = (() => {
    switch (selectedFilter) {
      case 'available':
        return availableCars;
      case 'reserved':
        return reservedCars;
      case 'sold':
        return soldCars;
      case 'valuation':
        return [...cars].sort((a, b) => {
          const valA = a.priceAmount || (Number(a.pricePerDay || 0) * 300);
          const valB = b.priceAmount || (Number(b.pricePerDay || 0) * 300);
          return valB - valA;
        });
      case 'all':
      default:
        return cars;
    }
  })();

  const getFilterTitle = () => {
    switch (selectedFilter) {
      case 'available':
        return 'Available Vehicles';
      case 'reserved':
        return 'Reserved & Booked Vehicles';
      case 'sold':
        return 'Sold & Delivered Vehicles';
      case 'valuation':
        return 'Fleet Portfolio Ranked by Valuation';
      case 'customers':
        return 'Customer Wishlist Inquiries';
      case 'all':
      default:
        return 'All Fleet Inventory';
    }
  };

  const getCarLeadsCount = (car) => {
    const carKey = car.id || car.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return customerLeads.filter((l) => l.carId === carKey || l.carId === car.id).length;
  };

  return (
    <div className="admin-dashboard-page space-y-6 pb-24">
      <AdminNavTabs
        title="Showroom Overview"
        description="Comprehensive dashboard of active luxury fleet, valuation, customer leads, and vehicle reservation status. Click any status card to filter results."
      />

      {/* KPI Status Overview Grid - 6 Clean Interactive Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Total Cars - Navigates to Car Garage */}
        <button
          type="button"
          onClick={() => navigate('/admin/inventory')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer group active:scale-[0.98] ${
            darkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 hover:shadow-lg'
              : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-md'
          }`}
          title="Click to open Car Garage"
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Cars
            </span>
            <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${
              darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {totalCars}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Units</span>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Garage inventory
            </p>
            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Open ➔
            </span>
          </div>
        </button>

        {/* 2. Total Fleet Valuation */}
        <button
          type="button"
          onClick={() => setSelectedFilter(selectedFilter === 'valuation' ? 'all' : 'valuation')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer group active:scale-[0.98] ${
            selectedFilter === 'valuation'
              ? darkMode
                ? 'bg-slate-800/90 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-lg'
                : 'bg-emerald-50/70 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-md'
              : darkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Fleet Value
            </span>
            <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${
              darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              ${(totalValue / 1000000).toFixed(2)}M
            </span>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Combined asset
            </p>
            <span className="text-[10px] font-bold text-emerald-500">
              Rank ↓
            </span>
          </div>
        </button>

        {/* 3. Available Cars */}
        <button
          type="button"
          onClick={() => setSelectedFilter(selectedFilter === 'available' ? 'all' : 'available')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer group active:scale-[0.98] ${
            selectedFilter === 'available'
              ? darkMode
                ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
                : 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
              : darkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-850'
              : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500">
              Available
            </span>
            <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${
              darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500">
              {availableCount}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Ready</span>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              For reservation
            </p>
            <span className="text-[10px] font-bold text-emerald-400">
              Filter ↓
            </span>
          </div>
        </button>

        {/* 4. Reserved Cars */}
        <button
          type="button"
          onClick={() => setSelectedFilter(selectedFilter === 'reserved' ? 'all' : 'reserved')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer group active:scale-[0.98] ${
            selectedFilter === 'reserved'
              ? darkMode
                ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                : 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/30 shadow-md'
              : darkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-amber-500/40 hover:bg-slate-850'
              : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-500">
              Reserved
            </span>
            <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${
              darkMode ? 'bg-amber-400/10 text-amber-400' : 'bg-amber-50 text-amber-600'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-500">
              {reservedCount}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Engaged</span>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Booked / out
            </p>
            <span className="text-[10px] font-bold text-amber-400">
              Filter ↓
            </span>
          </div>
        </button>

        {/* 5. Sold Cars */}
        <button
          type="button"
          onClick={() => setSelectedFilter(selectedFilter === 'sold' ? 'all' : 'sold')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer group active:scale-[0.98] ${
            selectedFilter === 'sold'
              ? darkMode
                ? 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500/30 shadow-lg'
                : 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/30 shadow-md'
              : darkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-rose-500/40 hover:bg-slate-850'
              : 'bg-white border-slate-200 hover:border-rose-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-500">
              Sold Cars
            </span>
            <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${
              darkMode ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'
            }`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-500">
              {soldCount}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Settled</span>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Completed sales
            </p>
            <span className="text-[10px] font-bold text-rose-400">
              Filter ↓
            </span>
          </div>
        </button>

        {/* 6. Total Customers Leads - Shows customer wishlist leads */}
        <button
          type="button"
          onClick={() => setSelectedFilter(selectedFilter === 'customers' ? 'all' : 'customers')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer group active:scale-[0.98] ${
            selectedFilter === 'customers'
              ? darkMode
                ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30 shadow-lg'
                : 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/30 shadow-md'
              : darkMode
              ? 'bg-slate-900/90 border-slate-800 hover:border-blue-500/40 hover:bg-slate-850'
              : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
          }`}
          title="Click to view all interested customers"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-500">
              Customers
            </span>
            <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${
              darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
            }`}>
              <svg className="w-4 h-4 fill-none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-500">
              {totalCustomersCount}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Leads</span>
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Wishlist buyers
            </p>
            <span className="text-[10px] font-bold text-blue-400">
              View List ↓
            </span>
          </div>
        </button>
      </div>

      {/* Customer Wishlist Leads Quick Outreach Banner */}
      <div
        className={`rounded-3xl border p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all ${
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

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/admin/customers')}
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer text-center"
          >
            Review Buyer Leads ({customerLeads.length})
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/inventory')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all text-center cursor-pointer ${
              darkMode
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            Open Car Garage
          </button>
        </div>
      </div>

      {/* Interactive Filter Results Section */}
      <div
        className={`rounded-3xl border p-5 sm:p-6 transition-all ${
          darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className={`text-base sm:text-lg font-bold tracking-tight ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {getFilterTitle()} ({selectedFilter === 'customers' ? customerLeads.length : filteredVehicles.length})
            </h3>
            {selectedFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedFilter('all')}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:opacity-90 cursor-pointer"
              >
                Clear Filter ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedFilter === 'customers' ? (
              <button
                type="button"
                onClick={() => navigate('/admin/customers')}
                className="text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
              >
                <span>Open Full Customer CRM ➔</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/admin/inventory')}
                className="text-xs font-bold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
              >
                <span>Manage in Car Garage</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* View Mode 1: Customers Table if 'customers' filter selected */}
        {selectedFilter === 'customers' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className={`border-b font-semibold uppercase tracking-wider ${
                    darkMode ? 'border-slate-800 bg-slate-950/60 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  <th scope="col" className="px-4 py-3">Customer</th>
                  <th scope="col" className="px-4 py-3">Wishlisted Car</th>
                  <th scope="col" className="px-4 py-3">Intent / Budget</th>
                  <th scope="col" className="px-4 py-3">Inquiry Notes</th>
                  <th scope="col" className="px-4 py-3">Call Status</th>
                  <th scope="col" className="px-5 py-3 text-right">Direct Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-xs ${darkMode ? 'divide-slate-800/80' : 'divide-slate-200'}`}>
                {customerLeads.map((lead) => {
                  const matchedCar = cars.find(
                    (c) => c.id === lead.carId || c.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === lead.carId
                  );

                  return (
                    <tr
                      key={lead.id}
                      className={`transition-colors ${
                        darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {lead.customerName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {lead.email} • {lead.location}
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {matchedCar && (
                            <img
                              src={matchedCar.image || matchedCar.imageUrl}
                              alt={matchedCar.name || matchedCar.title}
                              className="h-8 w-12 object-cover rounded-md border border-slate-700/40 shrink-0"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                          )}
                          <div className="font-bold text-slate-800 dark:text-slate-200">
                            {matchedCar?.name || matchedCar?.title || lead.carId}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          lead.intentLevel === 'Ready to Buy'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                          {lead.intentLevel}
                        </span>
                        <div className="text-[11px] font-semibold text-emerald-500 mt-0.5">
                          {lead.budget}
                        </div>
                      </td>

                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 italic truncate">
                          "{lead.notes}"
                        </p>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                          {lead.callStatus}
                        </span>
                      </td>

                      <td className="px-5 py-3 whitespace-nowrap text-right">
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-sm transition-all cursor-pointer no-underline"
                          title={`Call ${lead.customerName}`}
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                          </svg>
                          <span>Call {lead.phone}</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* View Mode 2: Vehicle Inventory Table */
          filteredVehicles.length === 0 ? (
            <div
              className={`rounded-2xl border p-8 text-center space-y-2 ${
                darkMode ? 'border-slate-800 bg-slate-950/40 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}
            >
              <p className="text-sm font-semibold">No vehicles found matching "{getFilterTitle()}".</p>
              <p className="text-xs text-slate-400">Click another status KPI card above or open the Garage to update vehicle statuses.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className={`border-b font-semibold uppercase tracking-wider ${
                      darkMode ? 'border-slate-800 bg-slate-950/60 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                  >
                    <th scope="col" className="px-4 py-3">Vehicle</th>
                    <th scope="col" className="px-4 py-3">Category</th>
                    <th scope="col" className="px-4 py-3">Valuation / Daily</th>
                    <th scope="col" className="px-4 py-3">Status (Click to Toggle)</th>
                    <th scope="col" className="px-4 py-3">Wishlists</th>
                    <th scope="col" className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-xs ${darkMode ? 'divide-slate-800/80' : 'divide-slate-200'}`}>
                  {filteredVehicles.map((car) => {
                    const isAvail = car.isAvailable !== false && car.status !== 'reserved' && car.status !== 'sold';
                    const isReserved = car.status === 'reserved';
                    const leadsCount = getCarLeadsCount(car);

                    return (
                      <tr
                        key={car.id}
                        className={`transition-colors ${
                          darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Vehicle Identity */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={car.image || car.imageUrl || '/assets/cars/porsche-911.jpg'}
                              alt={car.name || car.title}
                              className="h-10 w-14 object-cover rounded-lg border border-slate-700/50 bg-slate-950 shrink-0"
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80';
                              }}
                            />
                            <div>
                              <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                {car.name || car.title}
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                                {car.brand || 'Luxury'} • {car.year || '2024'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-block rounded-md px-2.5 py-1 font-medium ${
                            darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {car.category || 'Supercar'}
                          </span>
                        </td>

                        {/* Valuation */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-extrabold text-emerald-500 text-sm">
                            ${Number(car.pricePerDay || (car.priceAmount ? Math.round(car.priceAmount / 300) : 0)).toLocaleString()}
                            <span className="text-[10px] font-normal text-slate-400"> /day</span>
                          </div>
                          {car.priceAmount && (
                            <div className="text-[10px] text-slate-400">
                              Asset: ${Number(car.priceAmount).toLocaleString()}
                            </div>
                          )}
                        </td>

                        {/* Status Toggle */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              const next = isAvail ? 'reserved' : isReserved ? 'sold' : 'available';
                              toggleCarStatus(car.id, next);
                            }}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all cursor-pointer ${
                              isAvail
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                                : isReserved
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25'
                                : 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25'
                            }`}
                            title="Click to cycle status"
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${
                              isAvail ? 'bg-emerald-500' : isReserved ? 'bg-amber-500' : 'bg-rose-500'
                            }`} />
                            <span className="capitalize">{car.status || (isAvail ? 'available' : 'reserved')}</span>
                          </button>
                        </td>

                        {/* Wishlists */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => setInspectingLeadsCar(car)}
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                              leadsCount > 0
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                                : 'bg-slate-800/40 text-slate-400 border-slate-700/50'
                            }`}
                          >
                            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            <span>{leadsCount} Leads</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={() => setEditingCar(car)}
                            className={`rounded-lg p-1.5 transition-all cursor-pointer ${
                              darkMode
                                ? 'text-slate-400 hover:bg-slate-800 hover:text-emerald-400'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                            title="Edit vehicle"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Edit Vehicle Modal */}
      {editingCar && (
        <AdminEditModal
          car={editingCar}
          isOpen={!!editingCar}
          onClose={() => setEditingCar(null)}
        />
      )}

      {/* Customer Leads Modal */}
      {inspectingLeadsCar && (
        <AdminCarLeadsModal
          car={inspectingLeadsCar}
          isOpen={!!inspectingLeadsCar}
          onClose={() => setInspectingLeadsCar(null)}
          leads={customerLeads}
          darkMode={darkMode}
        />
      )}
    </div>
  );
}
