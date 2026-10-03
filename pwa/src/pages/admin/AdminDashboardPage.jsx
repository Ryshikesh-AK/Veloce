import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavTabs from './AdminNavTabs';
import { useCarContext } from '../../context/CarContext';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { cars, darkMode } = useCarContext();

  const totalValue = cars.reduce((sum, c) => sum + (c.priceAmount || 0), 0);
  const featuredCount = cars.filter((c) => c.isFeatured).length;
  const availableCount = cars.filter((c) => !c.status || c.status === 'available').length;
  const reservedCount = cars.filter((c) => c.status === 'reserved').length;
  const soldCount = cars.filter((c) => c.status === 'sold').length;

  const recentCars = cars.slice(0, 5);

  return (
    <div className="admin-dashboard-page space-y-6 pb-12">
      <AdminNavTabs
        title="Showroom Overview"
        description="High-level dashboard of luxury vehicle inventory, fleet valuations, and management quick actions."
        actions={
          <button
            type="button"
            onClick={() => navigate('/admin/new')}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Vehicle</span>
          </button>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Total Fleet */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Total Fleet
            </span>
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {cars.length}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Vehicles</span>
          </div>
          <p className={`text-[11px] mt-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Full showroom collection
          </p>
        </div>

        {/* Fleet Valuation */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Portfolio Value
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
            Combined inventory value
          </p>
        </div>

        {/* Featured Showcase */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Featured
            </span>
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-amber-400/10 text-amber-400' : 'bg-amber-50 text-amber-600'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
              {featuredCount}
            </span>
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Curated</span>
          </div>
          <p className={`text-[11px] mt-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Displayed on landing carousel
          </p>
        </div>

        {/* Status Breakdown */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
            darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Availability
            </span>
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              {availableCount} Available
            </span>
            {reservedCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {reservedCount} Reserved
              </span>
            )}
            {soldCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                {soldCount} Sold
              </span>
            )}
          </div>
          <p className={`text-[11px] mt-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Real-time showroom status
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-3">
        <h2 className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Quick Actions & Sections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <button
            type="button"
            onClick={() => navigate('/admin/inventory')}
            className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] cursor-pointer group ${
              darkMode
                ? 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-emerald-500/40'
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <svg className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className={`text-sm font-bold mt-3 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Manage Fleet Inventory
            </h3>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Filter, edit, update status, and manage vehicle specs.
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/new')}
            className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] cursor-pointer group ${
              darkMode
                ? 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-emerald-500/40'
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <svg className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className={`text-sm font-bold mt-3 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Add New Vehicle
            </h3>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Publish new luxury listings with high-res photos.
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/featured')}
            className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] cursor-pointer group ${
              darkMode
                ? 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-emerald-500/40'
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <svg className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className={`text-sm font-bold mt-3 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Featured Showcase
            </h3>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Curate the top luxury models on the landing carousel.
            </p>
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/finance')}
            className={`p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] cursor-pointer group ${
              darkMode
                ? 'bg-slate-900/70 hover:bg-slate-800/80 border-slate-800 hover:border-emerald-500/40'
                : 'bg-white hover:bg-slate-50 border-slate-200 shadow-2xs hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <svg className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className={`text-sm font-bold mt-3 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Financial Portfolio
            </h3>
            <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Category valuations, fleet pricing and asset distribution.
            </p>
          </button>
        </div>
      </div>

      {/* Recent Inventory Additions */}
      <div
        className={`rounded-2xl border overflow-hidden transition-all ${
          darkMode ? 'bg-slate-900/80 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-xs'
        }`}
      >
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <div>
            <h3 className={`text-sm sm:text-base font-bold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              Recent Inventory Additions
            </h3>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Latest luxury vehicles in your showroom
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/admin/inventory')}
            className="text-xs font-semibold text-emerald-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({cars.length})</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`uppercase tracking-wider font-semibold border-b ${
              darkMode ? 'bg-slate-950/70 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              <tr>
                <th className="p-3.5">Vehicle</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Quick Link</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-slate-800/60' : 'divide-slate-200/80'}`}>
              {recentCars.map((car) => (
                <tr key={car.id} className={`transition-colors ${darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                  <td className="p-3.5 flex items-center gap-3">
                    <img
                      src={car.imageUrl || car.image || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300'}
                      alt={car.title}
                      className="w-12 h-8 object-cover rounded-md border border-slate-700/50 bg-slate-950 shrink-0"
                    />
                    <div>
                      <div className={`font-semibold flex items-center gap-1.5 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                        {car.title || car.name}
                        {car.isFeatured && (
                          <span className="text-[9px] bg-amber-400/10 text-amber-500 border border-amber-400/20 px-1 py-0.2 rounded font-bold">
                            ★
                          </span>
                        )}
                      </div>
                      <div className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {car.year || 2024} • {car.location || 'Showroom'}
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                      darkMode ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {car.category || 'Luxury'}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-emerald-500">
                    {car.price || `$${Number(car.priceAmount || 0).toLocaleString()}`}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border capitalize ${
                        car.status === 'sold'
                          ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          : car.status === 'reserved'
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}
                    >
                      {car.status || 'available'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => navigate('/admin/inventory')}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        darkMode
                          ? 'border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white'
                          : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      Manage →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
