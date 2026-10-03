import React, { useMemo } from 'react';
import { useCarContext } from '../../context/CarContext';
import AdminNavTabs from './AdminNavTabs';

export default function AdminFinancePage() {
  const { cars, darkMode } = useCarContext();

  const metrics = useMemo(() => {
    const totalDailyPotential = cars.reduce((sum, c) => sum + (Number(c.pricePerDay) || 0), 0);
    const avgDailyRate = cars.length > 0 ? Math.round(totalDailyPotential / cars.length) : 0;
    const availableCount = cars.filter((c) => c.isAvailable).length;
    const reservedCount = cars.length - availableCount;
    const activeDailyYield = cars
      .filter((c) => !c.isAvailable)
      .reduce((sum, c) => sum + (Number(c.pricePerDay) || 0), 0);

    // Grouping by category
    const categoryMap = {};
    cars.forEach((car) => {
      const cat = car.category || 'Other';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { count: 0, dailyPotential: 0, highestRate: 0 };
      }
      categoryMap[cat].count += 1;
      const rate = Number(car.pricePerDay) || 0;
      categoryMap[cat].dailyPotential += rate;
      if (rate > categoryMap[cat].highestRate) {
        categoryMap[cat].highestRate = rate;
      }
    });

    return {
      totalDailyPotential,
      avgDailyRate,
      availableCount,
      reservedCount,
      activeDailyYield,
      categoryMap,
    };
  }, [cars]);

  return (
    <div
      className={`min-h-screen pb-28 pt-4 transition-colors duration-200 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdminNavTabs
          title="Financial Performance & Portfolio"
          subtitle="Analyze asset valuation, daily fleet yield potential, and category yield distribution."
        />

        {/* Top KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div
            className={`rounded-2xl border p-5 shadow-sm transition-colors ${
              darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Daily Fleet Potential
            </div>
            <div className="mt-2 text-3xl font-extrabold text-[#b9f43d]">
              ${metrics.totalDailyPotential.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Across all {cars.length} active fleet vehicles
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 shadow-sm transition-colors ${
              darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Leased Daily Yield
            </div>
            <div className="mt-2 text-3xl font-extrabold text-emerald-500">
              ${metrics.activeDailyYield.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {metrics.reservedCount} vehicles currently booked / active
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 shadow-sm transition-colors ${
              darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Average Daily Rate (ADR)
            </div>
            <div className="mt-2 text-3xl font-extrabold">
              ${metrics.avgDailyRate.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Per vehicle 24hr rental cycle
            </div>
          </div>

          <div
            className={`rounded-2xl border p-5 shadow-sm transition-colors ${
              darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Fleet Utilization
            </div>
            <div className="mt-2 text-3xl font-extrabold">
              {cars.length > 0 ? Math.round((metrics.reservedCount / cars.length) * 100) : 0}%
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {metrics.availableCount} ready for client reservation
            </div>
          </div>
        </div>

        {/* Category Breakdown Table */}
        <div
          className={`overflow-hidden rounded-2xl border shadow-sm transition-colors ${
            darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'
          }`}
        >
          <div className="border-b px-6 py-4 border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold">Category Yield & Fleet Distribution</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Breakdown of fleet assets categorized by vehicle segment.
            </p>
          </div>

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
                  <th scope="col" className="px-6 py-3.5">Category</th>
                  <th scope="col" className="px-6 py-3.5">Vehicle Count</th>
                  <th scope="col" className="px-6 py-3.5">Total Potential / Day</th>
                  <th scope="col" className="px-6 py-3.5">Avg Rate</th>
                  <th scope="col" className="px-6 py-3.5">Max Daily Rate</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${darkMode ? 'divide-slate-800/80' : 'divide-slate-200'}`}>
                {Object.entries(metrics.categoryMap).map(([category, stats]) => {
                  const avg = Math.round(stats.dailyPotential / stats.count);
                  return (
                    <tr
                      key={category}
                      className={darkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}
                    >
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                        {category}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {stats.count} vehicles
                      </td>
                      <td className="px-6 py-4 font-bold text-[#b9f43d]">
                        ${stats.dailyPotential.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        ${avg.toLocaleString()}/day
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                        ${stats.highestRate.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
