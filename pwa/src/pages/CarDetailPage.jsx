import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScreenHeading from '../components/common/ScreenHeading';
import CarPhoto from '../components/cars/CarPhoto';
import { useCarContext } from '../context/CarContext';

export default function CarDetailPage({ car: propCar }) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { cars, favorites, toggleFavorite, compareIds, toggleCompare } = useCarContext();
  const car = propCar || cars.find((c) => c.id === paramId);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [failedPhotoSrc, setFailedPhotoSrc] = useState('');
  const isPhotoUnavailable = !car?.imageUrl || failedPhotoSrc === car.imageUrl;

  const isFavorite = car ? favorites.includes(car.id) : false;
  const isCompared = car ? compareIds.includes(car.id) : false;

  useEffect(() => {
    if (!isImageExpanded) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsImageExpanded(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isImageExpanded]);

  if (!car) {
    return (
      <div className="py-12 text-center">
        <p className="text-slate-400">Car not found.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg cursor-pointer"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <section className="pwa-detail-screen space-y-5 max-w-3xl mx-auto" data-purpose="car-details-screen">
      <div className="pwa-detail-heading">
        <ScreenHeading eyebrow="VEHICLE DETAILS" title={car.title} onBack={() => navigate(-1)} />
      </div>
      <div className="pwa-detail-image relative overflow-hidden rounded-xl bg-slate-900">
        <CarPhoto
          className="pwa-detail-photo aspect-[1.18] w-full object-cover"
          src={car.imageUrl}
          alt={car.title}
          onError={() => setFailedPhotoSrc(car.imageUrl)}
        />
        {!isPhotoUnavailable && <button
          className="pwa-full-image-trigger cursor-pointer"
          type="button"
          onClick={() => setIsImageExpanded(true)}
        >
          View full image
        </button>}
        <span className="absolute bottom-3 left-3 rounded-md bg-black/70 px-3 py-1.5 text-xs font-semibold text-white">
          {car.status || car.badge || 'Available'}
        </span>
      </div>
      <div className="pwa-detail-price flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Price</p>
          <p className="mt-1 text-2xl font-bold text-white">{car.price}</p>
        </div>
        <div className="text-right text-sm text-emerald-300">
          {car.rating == null ? 'New listing' : `★ ${car.rating}`}
        </div>
      </div>
      <p className="pwa-detail-description text-sm leading-6 text-slate-300">
        {car.description || 'Visit DriveXCars to learn more about this vehicle.'}
      </p>
      <div className="pwa-detail-specs grid grid-cols-2 gap-2 border-y border-white/10 py-4">
        {[
          ['Year', car.year],
          ['Type', car.category],
          ['Mileage', `${Number(car.mileage || 0).toLocaleString()} mi`],
          ['Fuel', car.fuel || 'Not listed'],
          ['Transmission', car.transmission || 'Not listed'],
          ['Location', car.location || 'DriveXCars showroom']
        ].map(([label, value]) => (
          <div className="py-1" key={label}>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
            <div className="mt-1 text-sm font-medium text-slate-200">{value}</div>
          </div>
        ))}
      </div>
      <div className="pwa-detail-actions grid grid-cols-2 gap-3">
        <button
          type="button"
          className="min-h-12 rounded-lg border border-white/15 px-3 text-sm font-semibold text-white hover:bg-white/5 cursor-pointer"
          onClick={() => toggleFavorite(car.id)}
        >
          {isFavorite ? '♥ Saved' : '♡ Save car'}
        </button>
        <button
          type="button"
          className="min-h-12 rounded-lg border border-white/15 px-3 text-sm font-semibold text-white hover:bg-white/5 cursor-pointer"
          onClick={() => toggleCompare(car.id)}
        >
          {isCompared ? '✓ In compare' : '+ Compare'}
        </button>
      </div>
      <button
        type="button"
        className="min-h-12 w-full rounded-lg bg-emerald-400 px-4 text-sm font-bold text-slate-950 hover:bg-emerald-300 transition-colors cursor-pointer"
        onClick={() => navigate('/contact')}
      >
        Inquire about this car
      </button>

      {isImageExpanded && (
        <div
          className="pwa-image-lightbox fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${car.title} full-size image`}
          onClick={() => setIsImageExpanded(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white font-bold px-3 py-1 bg-white/10 rounded-lg cursor-pointer"
            aria-label="Close full image"
            onClick={() => setIsImageExpanded(false)}
          >
            Close
          </button>
          <CarPhoto src={car.imageUrl} alt={car.title} className="max-h-[90vh] max-w-[90vw] object-contain" />
        </div>
      )}
    </section>
  );
}
