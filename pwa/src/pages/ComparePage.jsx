import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenHeading from '../components/common/ScreenHeading';
import EmptyState from '../components/common/EmptyState';
import { useCarContext } from '../context/CarContext';

export default function ComparePage() {
  const navigate = useNavigate();
  const { cars, compareIds, toggleCompare } = useCarContext();

  const compareCars = cars.filter((car) => compareIds.includes(car.id));

  return (
    <section className="space-y-5" data-purpose="compare-screen">
      <ScreenHeading
        eyebrow="SIDE BY SIDE"
        title="Compare your shortlist."
        description="Keep up to three cars here while you decide."
      />
      {compareCars.length === 0 ? (
        <EmptyState
          title="Your compare list is empty"
          description="Add cars from Explore or open a car and tap Compare."
          actionLabel="Browse cars"
          onAction={() => navigate('/')}
        />
      ) : (
        <div className="pwa-compare-list -mx-4.5 flex snap-x gap-3 overflow-x-auto px-4.5 pb-3 no-scrollbar">
          {compareCars.map((car) => (
            <article
              className="pwa-compare-card w-[82%] sm:w-[320px] min-w-[280px] snap-start overflow-hidden rounded-xl border border-white/10 bg-slate-900/70"
              key={car.id}
            >
              <img className="aspect-[1.55] w-full object-cover" src={car.imageUrl} alt={car.title} />
              <div className="space-y-4 p-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">{car.title}</h2>
                  <p className="mt-1 text-xl font-bold text-emerald-300">{car.price}</p>
                </div>
                <div className="divide-y divide-white/10 border-y border-white/10">
                  {[
                    ['Year', car.year],
                    ['Type', car.category],
                    ['Mileage', `${Number(car.mileage || 0).toLocaleString()} mi`],
                    ['Fuel', car.fuel || 'Not listed'],
                    ['Transmission', car.transmission || 'Not listed']
                  ].map(([label, value]) => (
                    <div className="flex justify-between gap-3 py-3 text-sm" key={label}>
                      <span className="text-slate-400">{label}</span>
                      <strong className="text-right font-medium text-slate-200">{value}</strong>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="min-h-10 text-sm font-semibold text-rose-300 hover:text-rose-200 cursor-pointer"
                  onClick={() => toggleCompare(car.id)}
                >
                  Remove from compare
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
