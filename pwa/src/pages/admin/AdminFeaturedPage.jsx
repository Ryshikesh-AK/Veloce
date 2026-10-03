import React, { useMemo } from 'react';
import { useCarContext } from '../../context/CarContext';
import AdminNavTabs from './AdminNavTabs';

export default function AdminFeaturedPage() {
  const { cars, updateCar, darkMode, setToast } = useCarContext();

  const featuredCars = useMemo(() => cars.filter((c) => c.isFeatured), [cars]);
  const standardCars = useMemo(() => cars.filter((c) => !c.isFeatured), [cars]);

  const toggleFeatured = (car) => {
    const nextState = !car.isFeatured;
    updateCar(car.id, { isFeatured: nextState });

    if (setToast) {
      setToast({
        id: Date.now(),
        message: nextState
          ? `Added ${car.name} to homepage showcase.`
          : `Removed ${car.name} from homepage showcase.`,
        type: 'info',
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
          title="Featured Showcase"
          subtitle="Curate the flagship supercars showcased directly in the client hero and highlight reels."
        />

        {/* Featured Showcase Count Banner */}
        <div
          className={`mb-8 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between shadow-sm backdrop-blur-md transition-colors ${
            darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white'
          }`}
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#b9f43d]">
              Showcase Active
            </span>
            <h2 className="text-2xl font-bold">
              {featuredCars.length} of {cars.length} Vehicles Featured
            </h2>
            <p className={`mt-0.5 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Featured vehicles appear prominently on the client home page hero and category showcases.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Recommended: 3 to 6 vehicles
            </span>
          </div>
        </div>

        {/* Currently Featured Section */}
        <div className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#b9f43d]" />
              Currently In Spotlight ({featuredCars.length})
            </h3>
          </div>

          {featuredCars.length === 0 ? (
            <div
              className={`rounded-2xl border p-8 text-center ${
                darkMode ? 'border-slate-800 bg-slate-900/40 text-slate-400' : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              No vehicles are currently featured. Click the star icon on any vehicle below to highlight it.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCars.map((car) => (
                <div
                  key={car.id}
                  className={`group relative overflow-hidden rounded-2xl border transition-all hover:shadow-lg ${
                    darkMode
                      ? 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-800">
                    <img
                      src={car.image || '/assets/cars/porsche-911.jpg'}
                      alt={car.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <span className="rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
                          {car.category || 'Supercar'}
                        </span>
                        <h4 className="mt-1 font-bold text-white text-base drop-shadow">
                          {car.name}
                        </h4>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-[#b9f43d]">
                          ${car.pricePerDay}/day
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {car.specs?.horsepower || '600 HP'} • {car.specs?.acceleration || '3.2s'}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFeatured(car)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-500 transition-all hover:bg-amber-500/20"
                      title="Remove from featured spotlight"
                    >
                      <svg className="h-4 w-4 fill-amber-500" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>In Spotlight</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Standard Fleet (Available to promote) */}
        <div>
          <h3 className="mb-4 text-base font-bold flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
            Standard Fleet ({standardCars.length})
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {standardCars.map((car) => (
              <div
                key={car.id}
                className={`flex items-center justify-between rounded-xl border p-3 transition-all ${
                  darkMode
                    ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={car.image || '/assets/cars/porsche-911.jpg'}
                    alt={car.name}
                    className="h-12 w-16 rounded-lg object-cover bg-slate-800"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=200&q=80';
                    }}
                  />
                  <div>
                    <div className="font-semibold text-sm line-clamp-1">{car.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      ${car.pricePerDay}/day • {car.category || 'Luxury'}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleFeatured(car)}
                  className={`rounded-lg p-2 transition-all ${
                    darkMode
                      ? 'text-slate-500 hover:bg-slate-800 hover:text-amber-400'
                      : 'text-slate-400 hover:bg-slate-100 hover:text-amber-500'
                  }`}
                  title="Promote to Spotlight"
                  aria-label={`Promote ${car.name}`}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
