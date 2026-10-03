import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCarContext } from '../../context/CarContext';
import AdminEditModal from './AdminEditModal';
import AdminCarLeadsModal from './AdminCarLeadsModal';
import { INITIAL_LEADS, CUSTOMER_LEADS_STORAGE_KEY } from '../../data/customerLeads';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function AdminGarageSection() {
  const { cars, setCars, deleteCar, toggleCarStatus, darkMode, setToast } = useCarContext();
  const [customerLeads, setCustomerLeads] = useLocalStorage(CUSTOMER_LEADS_STORAGE_KEY, INITIAL_LEADS);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingCar, setEditingCar] = useState(null);
  const [inspectingLeadsCar, setInspectingLeadsCar] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const categories = useMemo(() => {
    const set = new Set(cars.map((c) => c.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [cars]);

  const filteredCars = useMemo(() => {
    let result = cars.filter((car) => {
      const name = car.name || car.title || '';
      const brand = car.brand || '';
      const cat = car.category || '';

      const matchSearch =
        search.trim() === '' ||
        name.toLowerCase().includes(search.toLowerCase()) ||
        brand.toLowerCase().includes(search.toLowerCase()) ||
        cat.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === 'All' || car.category === categoryFilter;

      const isAvail = car.isAvailable !== false && car.status !== 'reserved' && car.status !== 'sold';
      const isReserved = car.status === 'reserved' || (!car.isAvailable && car.status !== 'sold');
      const isSold = car.status === 'sold';

      let matchStatus = true;
      if (statusFilter === 'Available') matchStatus = isAvail;
      else if (statusFilter === 'Reserved') matchStatus = isReserved;
      else if (statusFilter === 'Sold') matchStatus = isSold;

      return matchSearch && matchCategory && matchStatus;
    });

    return [...result].sort((a, b) => {
      const priceA = Number(a.priceAmount || a.pricePerDay || 0);
      const priceB = Number(b.priceAmount || b.pricePerDay || 0);
      const nameA = (a.name || a.title || '').toLowerCase();
      const nameB = (b.name || b.title || '').toLowerCase();
      const yearA = Number(a.year || 2024);
      const yearB = Number(b.year || 2024);

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'name') return nameA.localeCompare(nameB);
      if (sortBy === 'year') return yearB - yearA;
      return 0;
    });
  }, [cars, search, categoryFilter, statusFilter, sortBy]);

  const handleDelete = (id, name) => {
    deleteCar(id);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    setConfirmDeleteId(null);
    if (setToast) {
      setToast({
        id: Date.now(),
        message: `Removed ${name} from garage`,
        type: 'success',
      });
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredCars.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = (newStatus, isAvail) => {
    if (setCars && selectedIds.length > 0) {
      setCars((prev) =>
        prev.map((c) =>
          selectedIds.includes(c.id)
            ? { ...c, status: newStatus, isAvailable: isAvail }
            : c
        )
      );
      if (setToast) {
        setToast({
          id: Date.now(),
          message: `Updated status for ${selectedIds.length} vehicle(s)`,
          type: 'success'
        });
      }
      setSelectedIds([]);
    }
  };

  const handleBulkDelete = () => {
    if (setCars && selectedIds.length > 0) {
      const count = selectedIds.length;
      setCars((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
      if (setToast) {
        setToast({
          id: Date.now(),
          message: `Deleted ${count} vehicle(s) from showroom garage`,
          type: 'success'
        });
      }
    }
  };

  const handleUpdateLeadStatus = (leadId, newStatus) => {
    setCustomerLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, callStatus: newStatus } : lead))
    );
    if (setToast) {
      setToast({
        id: Date.now(),
        message: `Updated customer call status to "${newStatus}"`,
        type: 'success'
      });
    }
  };

  // Compute how many wishlist leads exist for a car
  const getCarLeadsCount = (car) => {
    const carKey = car.id || car.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return customerLeads.filter(
      (l) => l.carId === carKey || l.carId === car.id
    ).length;
  };

  return (
    <section className="space-y-6 pt-2">
      {/* Grand Vehicle Intake & Garage Control Hero Impression */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 transition-all ${
          darkMode
            ? 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/30 border-slate-800 shadow-2xl'
            : 'bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 border-slate-200/90 shadow-lg'
        }`}
      >
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Showroom Garage Hub
            </div>
            <h1 className={`text-2xl sm:text-4xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-950'}`}>
              Fleet Vehicle Control & Intake
            </h1>
            <p className={`text-sm sm:text-base leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Expand your showroom by registering new luxury automobiles, manage live reservation states, and follow up directly with prospective buyers who wishlisted specific vehicles.
            </p>

            {/* Quick Fleet Metrics Pill Bar */}
            <div className="flex items-center gap-3 pt-1 flex-wrap text-xs font-semibold">
              <span className={`px-3 py-1 rounded-xl border ${darkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                🚘 <strong className="text-emerald-500">{cars.length}</strong> Total Fleet
              </span>
              <span className={`px-3 py-1 rounded-xl border ${darkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                ⭐ <strong className="text-amber-400">{customerLeads.length}</strong> Active Buyer Wishlists
              </span>
              <span className={`px-3 py-1 rounded-xl border ${darkMode ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                ✨ <strong className="text-emerald-400">{categories.length - 1}</strong> Luxury Classes
              </span>
            </div>
          </div>

          {/* High-Impact Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              to="/admin/new"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-sm font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-[#b9f43d] hover:from-emerald-300 hover:to-[#a8e630] shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer no-underline text-center"
            >
              <svg className="w-5 h-5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Vehicle to Garage</span>
            </Link>

            <Link
              to="/admin/customers"
              className={`inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl text-sm font-bold border transition-all text-center no-underline ${
                darkMode
                  ? 'border-slate-700 bg-slate-950/80 text-slate-200 hover:bg-slate-800 hover:text-white'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 shadow-xs'
              }`}
            >
              <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>Wishlist Buyers ({customerLeads.length})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className={`rounded-2xl border p-4 shadow-xs backdrop-blur-md transition-colors ${
          darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/90'
        }`}
      >
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg
              className={`absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${
                darkMode ? 'text-slate-500' : 'text-slate-400'
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search garage by model, brand, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full rounded-xl border pl-10 pr-4 py-2 text-xs transition-all focus:outline-none focus:ring-2 ${
                darkMode
                  ? 'border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20'
                  : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-emerald-500/30'
              }`}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all focus:outline-none cursor-pointer ${
                  darkMode
                    ? 'border-slate-800 bg-slate-950 text-slate-200'
                    : 'border-slate-300 bg-white text-slate-800'
                }`}
              >
                <option value="newest">Default (Showroom order)</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Model Name (A-Z)</option>
                <option value="year">Year (Newest first)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2.5 border-t pt-3 border-slate-200 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                    : darkMode
                    ? 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:ml-auto">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              Status:
            </span>
            {['All', 'Available', 'Reserved', 'Sold'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                  statusFilter === st
                    ? darkMode
                      ? 'bg-slate-100 text-slate-950 font-bold'
                      : 'bg-slate-900 text-white font-bold'
                    : darkMode
                    ? 'bg-slate-800/70 text-slate-400 hover:bg-slate-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bulk Action Floating Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-slate-900 dark:text-slate-100 transition-all">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-xs font-bold">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold">
              {selectedIds.length} vehicle{selectedIds.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleBulkStatus('available', true)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 cursor-pointer"
            >
              Set Available
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatus('reserved', false)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 cursor-pointer"
            >
              Set Reserved
            </button>
            <button
              type="button"
              onClick={() => handleBulkStatus('sold', false)}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30 cursor-pointer"
            >
              Set Sold
            </button>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
            >
              Delete Selected
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-100 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Vehicles Table */}
      {filteredCars.length === 0 ? (
        <div
          className={`rounded-2xl border p-10 text-center ${
            darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'
          }`}
        >
          <p className="text-sm font-semibold">No vehicles found in garage</p>
          <button
            onClick={() => {
              setSearch('');
              setCategoryFilter('All');
              setStatusFilter('All');
              setSortBy('newest');
            }}
            className="mt-3 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-500 text-slate-950 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div
          className={`overflow-hidden rounded-2xl border shadow-sm transition-colors ${
            darkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className={`border-b font-semibold uppercase tracking-wider ${
                    darkMode
                      ? 'border-slate-800 bg-slate-950/70 text-slate-400'
                      : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  <th scope="col" className="w-10 px-4 py-3.5 text-center">
                    <input
                      type="checkbox"
                      checked={filteredCars.length > 0 && selectedIds.length === filteredCars.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                    />
                  </th>
                  <th scope="col" className="px-4 py-3.5">Vehicle</th>
                  <th scope="col" className="px-4 py-3.5">Category</th>
                  <th scope="col" className="px-4 py-3.5">Daily / Value</th>
                  <th scope="col" className="px-4 py-3.5">Specs</th>
                  <th scope="col" className="px-4 py-3.5">Live Status (Click to Toggle)</th>
                  <th scope="col" className="px-4 py-3.5">Customer Wishlists</th>
                  <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-xs ${darkMode ? 'divide-slate-800/80' : 'divide-slate-200'}`}>
                {filteredCars.map((car) => {
                  const isSelected = selectedIds.includes(car.id);
                  const isAvail = car.isAvailable !== false && car.status !== 'reserved' && car.status !== 'sold';
                  const isReserved = car.status === 'reserved';
                  const leadsCount = getCarLeadsCount(car);

                  return (
                    <tr
                      key={car.id}
                      className={`transition-colors ${
                        isSelected
                          ? darkMode
                            ? 'bg-slate-800/60'
                            : 'bg-emerald-50/70'
                          : darkMode
                          ? 'hover:bg-slate-800/40'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="w-10 px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(car.id)}
                          className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>

                      {/* Vehicle Identity */}
                      <td className="px-4 py-3.5">
                        <div
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => setInspectingLeadsCar(car)}
                          title="Click to view interested buyers"
                        >
                          <img
                            src={car.image || car.imageUrl || '/assets/cars/porsche-911.jpg'}
                            alt={car.name || car.title}
                            className="h-11 w-16 object-cover rounded-lg border border-slate-700/50 bg-slate-950 shrink-0 group-hover:opacity-85 transition-opacity"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-emerald-400 transition-colors">
                              {car.name || car.title}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              {car.brand || 'Luxury'} • {car.year || '2024'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-block rounded-md px-2.5 py-1 font-medium ${
                          darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {car.category || 'Supercar'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
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

                      {/* Specs */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        <div>{car.specs?.horsepower || car.horsepower || '650 HP'}</div>
                        <div className="text-[10px] text-slate-400">{car.specs?.acceleration || car.acceleration || '3.0s'}</div>
                      </td>

                      {/* Clickable Car Status (Cycling between Available -> Reserved -> Sold) */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            const next = isAvail ? 'reserved' : isReserved ? 'sold' : 'available';
                            toggleCarStatus(car.id, next);
                          }}
                          className={`group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold border transition-all cursor-pointer shadow-xs active:scale-95 ${
                            isAvail
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25 hover:border-emerald-500/50'
                              : isReserved
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-500/50'
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30 hover:bg-rose-500/25 hover:border-rose-500/50'
                          }`}
                          title="Click to toggle status: Available ➔ Reserved ➔ Sold"
                        >
                          <span className={`h-2 w-2 rounded-full ${
                            isAvail ? 'bg-emerald-500 group-hover:animate-ping' : isReserved ? 'bg-amber-500' : 'bg-rose-500'
                          }`} />
                          <span className="capitalize">{car.status || (isAvail ? 'available' : 'reserved')}</span>
                          <svg className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </td>

                      {/* Customer Wishlists Section (Click to view interested buyers) */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setInspectingLeadsCar(car)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            leadsCount > 0
                              ? darkMode
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                                : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                              : darkMode
                              ? 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800 text-[11px]'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 text-[11px]'
                          }`}
                          title="View interested customers who wishlisted this car"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                          </svg>
                          <span>{leadsCount > 0 ? `${leadsCount} Buyer${leadsCount > 1 ? 's' : ''}` : 'View Leads'}</span>
                        </button>
                      </td>

                      {/* Action buttons (Edit & Delete) */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingCar(car)}
                            className={`rounded-lg p-1.5 transition-all cursor-pointer ${
                              darkMode
                                ? 'text-slate-400 hover:bg-slate-800 hover:text-emerald-400'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                            title="Edit vehicle details"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>

                          {confirmDeleteId === car.id ? (
                            <div className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 p-1 border border-rose-500/30">
                              <button
                                type="button"
                                onClick={() => handleDelete(car.id, car.name || car.title)}
                                className="rounded px-2 py-0.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="rounded px-1.5 py-0.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(car.id)}
                              className={`rounded-lg p-1.5 transition-all cursor-pointer ${
                                darkMode
                                  ? 'text-slate-400 hover:bg-rose-500/10 hover:text-rose-400'
                                  : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                              }`}
                              title="Delete vehicle"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Vehicle Modal */}
      {editingCar && (
        <AdminEditModal
          car={editingCar}
          isOpen={!!editingCar}
          onClose={() => setEditingCar(null)}
        />
      )}

      {/* Customer Wishlist Leads Modal */}
      {inspectingLeadsCar && (
        <AdminCarLeadsModal
          car={inspectingLeadsCar}
          isOpen={!!inspectingLeadsCar}
          onClose={() => setInspectingLeadsCar(null)}
          leads={customerLeads}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          darkMode={darkMode}
        />
      )}
    </section>
  );
}
