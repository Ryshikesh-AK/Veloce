import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCarContext } from '../../context/CarContext';
import AdminNavTabs from './AdminNavTabs';
import AdminEditModal from './AdminEditModal';

export default function AdminInventoryPage() {
  const { cars, deleteCar, toggleCarStatus, darkMode, setToast } = useCarContext();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingCar, setEditingCar] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const categories = useMemo(() => {
    const set = new Set(cars.map((c) => c.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [cars]);

  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      const matchSearch =
        search.trim() === '' ||
        car.name.toLowerCase().includes(search.toLowerCase()) ||
        car.brand?.toLowerCase().includes(search.toLowerCase()) ||
        car.category?.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === 'All' || car.category === categoryFilter;

      const matchStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Available' && car.isAvailable) ||
        (statusFilter === 'Unavailable' && !car.isAvailable);

      return matchSearch && matchCategory && matchStatus;
    });
  }, [cars, search, categoryFilter, statusFilter]);

  const handleDelete = (id, name) => {
    deleteCar(id);
    setConfirmDeleteId(null);
    if (setToast) {
      setToast({
        id: Date.now(),
        message: `Removed ${name} from inventory`,
        type: 'success',
      });
    }
  };

  return (
    <div
      className={`min-h-screen pb-28 pt-4 transition-colors duration-200 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdminNavTabs
          title="Fleet Inventory"
          subtitle="Manage active vehicles, edit details, toggle availability, or delete entries."
        />

        {/* Filter & Actions Bar */}
        <div
          className={`mb-6 rounded-2xl border p-4 shadow-sm backdrop-blur-md transition-colors ${
            darkMode
              ? 'border-slate-800 bg-slate-900/80'
              : 'border-slate-200 bg-white/90'
          }`}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <svg
                className={`absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 ${
                  darkMode ? 'text-slate-500' : 'text-slate-400'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by model, brand, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full rounded-xl border pl-11 pr-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 ${
                  darkMode
                    ? 'border-slate-800 bg-slate-950 text-slate-100 placeholder-slate-500 focus:border-[#b9f43d] focus:ring-[#b9f43d]/20'
                    : 'border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-[#b9f43d] focus:ring-[#b9f43d]/40'
                }`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/admin/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#b9f43d] px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm transition-all hover:bg-[#a8e630] hover:shadow-md"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Vehicle</span>
              </Link>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t pt-3 border-slate-200 dark:border-slate-800/80">
            {/* Category filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoryFilter(cat)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                    categoryFilter === cat
                      ? darkMode
                        ? 'bg-[#b9f43d] text-slate-950 font-bold'
                        : 'bg-slate-900 text-white font-bold'
                      : darkMode
                      ? 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                Status:
              </span>
              {['All', 'Available', 'Unavailable'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
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

        {/* Results summary bar */}
        <div className="mb-4 flex items-center justify-between text-xs">
          <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
            Showing <strong className={darkMode ? 'text-slate-100' : 'text-slate-900'}>{filteredCars.length}</strong> of{' '}
            <strong className={darkMode ? 'text-slate-100' : 'text-slate-900'}>{cars.length}</strong> vehicles
          </span>
          {(search || categoryFilter !== 'All' || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setStatusFilter('All');
              }}
              className="font-medium text-[#b9f43d] hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Inventory Table / Responsive Card List */}
        {filteredCars.length === 0 ? (
          <div
            className={`rounded-2xl border p-12 text-center ${
              darkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
              <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-semibold">No vehicles match your criteria</h3>
            <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Try clearing your search terms or filters to view all inventory.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('All');
                setStatusFilter('All');
              }}
              className="mt-4 inline-flex items-center rounded-xl bg-[#b9f43d] px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-[#a8e630]"
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
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className={`border-b text-xs font-semibold uppercase tracking-wider ${
                      darkMode
                        ? 'border-slate-800 bg-slate-950/70 text-slate-400'
                        : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                  >
                    <th scope="col" className="px-5 py-3.5">Vehicle</th>
                    <th scope="col" className="px-4 py-3.5">Category</th>
                    <th scope="col" className="px-4 py-3.5">Pricing</th>
                    <th scope="col" className="px-4 py-3.5">Performance</th>
                    <th scope="col" className="px-4 py-3.5">Status</th>
                    <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y text-sm ${darkMode ? 'divide-slate-800/80' : 'divide-slate-200'}`}>
                  {filteredCars.map((car) => {
                    return (
                      <tr
                        key={car.id}
                        className={`transition-colors ${
                          darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Vehicle Info */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-slate-200/40 bg-slate-800 dark:border-slate-700/50">
                              <img
                                src={car.image || '/assets/cars/porsche-911.jpg'}
                                alt={car.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=400&q=80';
                                }}
                              />
                              {car.isFeatured && (
                                <span
                                  className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#b9f43d] text-slate-950 shadow"
                                  title="Featured Car"
                                >
                                  <svg className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </span>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100">
                                {car.name}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {car.brand || 'Luxury'} • {car.year || '2024'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-block rounded-md px-2.5 py-1 text-xs font-medium ${
                              darkMode
                                ? 'bg-slate-800 text-slate-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {car.category || 'Supercar'}
                          </span>
                        </td>

                        {/* Pricing */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-bold text-slate-900 dark:text-[#b9f43d]">
                            ${Number(car.pricePerDay || 0).toLocaleString()}
                            <span className="text-xs font-normal text-slate-500 dark:text-slate-400"> /day</span>
                          </div>
                          {car.originalPrice && Number(car.originalPrice) > Number(car.pricePerDay) && (
                            <div className="text-xs text-slate-400 line-through">
                              ${Number(car.originalPrice).toLocaleString()}/day
                            </div>
                          )}
                        </td>

                        {/* Performance */}
                        <td className="px-4 py-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-400">
                          <div>{car.specs?.horsepower || '650 HP'}</div>
                          <div className="text-[11px] text-slate-400">
                            {car.specs?.acceleration || '0-60 in 3.0s'}
                          </div>
                        </td>

                        {/* Status Toggle Button */}
                        <td className="px-4 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => toggleCarStatus(car.id)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                              car.isAvailable
                                ? darkMode
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : darkMode
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            }`}
                            title="Click to toggle availability"
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                car.isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                            />
                            {car.isAvailable ? 'Available' : 'Reserved'}
                          </button>
                        </td>

                        {/* Actions (ONLY ICONS - Edit and Delete) */}
                        <td className="px-5 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center justify-end gap-1.5">
                            {/* Edit Icon Button */}
                            <button
                              type="button"
                              onClick={() => setEditingCar(car)}
                              className={`rounded-lg p-2 transition-all ${
                                darkMode
                                  ? 'text-slate-400 hover:bg-slate-800 hover:text-[#b9f43d]'
                                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                              }`}
                              title="Edit vehicle details"
                              aria-label={`Edit ${car.name}`}
                            >
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </button>

                            {/* Delete Icon Button / Confirmation */}
                            {confirmDeleteId === car.id ? (
                              <div className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 p-1 border border-rose-500/30">
                                <button
                                  type="button"
                                  onClick={() => handleDelete(car.id, car.name)}
                                  className="rounded px-2 py-1 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow"
                                  title="Confirm deletion"
                                >
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="rounded px-2 py-1 text-xs font-medium text-slate-400 hover:text-slate-200"
                                  title="Cancel"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(car.id)}
                                className={`rounded-lg p-2 transition-all ${
                                  darkMode
                                    ? 'text-slate-400 hover:bg-rose-500/10 hover:text-rose-400'
                                    : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600'
                                }`}
                                title="Delete vehicle"
                                aria-label={`Delete ${car.name}`}
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
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
      </div>

      {/* Edit Modal Component */}
      {editingCar && (
        <AdminEditModal
          car={editingCar}
          isOpen={!!editingCar}
          onClose={() => setEditingCar(null)}
        />
      )}
    </div>
  );
}
