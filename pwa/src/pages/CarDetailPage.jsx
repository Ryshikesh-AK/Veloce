import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ScreenHeading from '../components/common/ScreenHeading';
import CarPhoto from '../components/cars/CarPhoto';
import { useCarContext } from '../context/CarContext';
import { getCarById } from '../services/api';

export default function CarDetailPage({ car: propCar }) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { cars, favorites, toggleFavorite, compareIds, toggleCompare } = useCarContext();

  const contextCar = propCar || cars.find((c) => String(c.id) === String(paramId));
  const [car, setCar] = useState(contextCar);
  const [loading, setLoading] = useState(!contextCar && Boolean(paramId));
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [failedPhotoSrc, setFailedPhotoSrc] = useState('');

  useEffect(() => {
    if (propCar) {
      setCar(propCar);
      setLoading(false);
      return;
    }

    const matchedInContext = cars.find((c) => String(c.id) === String(paramId));
    if (matchedInContext) {
      setCar(matchedInContext);
    }

    if (paramId) {
      let active = true;
      if (!matchedInContext) setLoading(true);
      getCarById(paramId)
        .then((fetchedCar) => {
          if (active && fetchedCar) {
            setCar(fetchedCar);
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }
  }, [paramId, propCar, cars]);

  const imagesList = Array.isArray(car?.images) && car.images.length > 0
    ? car.images
    : car?.imageUrl
    ? [car.imageUrl]
    : [];

  const activePhotoUrl = imagesList[activeImageIndex] || car?.imageUrl || '';
  const isPhotoUnavailable = !activePhotoUrl || failedPhotoSrc === activePhotoUrl;

  const isFavorite = car ? favorites.includes(car.id) : false;
  const isCompared = car ? compareIds.includes(car.id) : false;

  const touchStartPos = React.useRef(null);
  const pointerStartPos = React.useRef(null);

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    if (!touchStartPos.current) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartPos.current.x;
    const diffY = touch.clientY - touchStartPos.current.y;
    touchStartPos.current = null;

    if (Math.abs(diffX) > 25 && Math.abs(diffX) > Math.abs(diffY)) {
      e.stopPropagation();
      if (diffX < 0) {
        handleNextImage(e);
      } else {
        handlePrevImage(e);
      }
    }
  };

  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pointerStartPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e) => {
    if (!pointerStartPos.current) return;
    const diffX = e.clientX - pointerStartPos.current.x;
    const diffY = e.clientY - pointerStartPos.current.y;
    pointerStartPos.current = null;

    if (Math.abs(diffX) > 25 && Math.abs(diffX) > Math.abs(diffY)) {
      e.stopPropagation();
      if (diffX < 0) {
        handleNextImage(e);
      } else {
        handlePrevImage(e);
      }
    }
  };

  useEffect(() => {
    if (!isImageExpanded) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsImageExpanded(false);
      if (event.key === 'ArrowRight') handleNextImage();
      if (event.key === 'ArrowLeft') handlePrevImage();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isImageExpanded, imagesList.length]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent"></div>
        <p className="text-slate-400 text-sm font-medium">Loading vehicle details...</p>
      </div>
    );
  }

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

      {/* Main Showcase Image Carousel */}
      <div className="space-y-3">
        <div 
          className="pwa-detail-image relative overflow-hidden rounded-xl bg-slate-900 group select-none touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <CarPhoto
            className="pwa-detail-photo aspect-[1.25] sm:aspect-[1.5] w-full object-cover transition-all duration-300"
            src={activePhotoUrl}
            alt={`${car.title} - photo ${activeImageIndex + 1}`}
            onError={() => setFailedPhotoSrc(activePhotoUrl)}
          />

          {/* Carousel Next / Prev Controls */}
          {imagesList.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/70 p-2.5 text-white backdrop-blur-md hover:bg-slate-900 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                aria-label="Previous image"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-slate-950/70 p-2.5 text-white backdrop-blur-md hover:bg-slate-900 transition-all opacity-80 hover:opacity-100 cursor-pointer"
                aria-label="Next image"
              >
                ▶
              </button>
            </>
          )}

          {!isPhotoUnavailable && (
            <button
              className="pwa-full-image-trigger cursor-pointer"
              type="button"
              onClick={() => setIsImageExpanded(true)}
            >
              View full image
            </button>
          )}

          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="rounded-md bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              {car.status || car.badge || 'Available'}
            </span>
            {imagesList.length > 1 && (
              <span className="rounded-md bg-emerald-500/80 px-2.5 py-1.5 text-xs font-bold text-slate-950 backdrop-blur-sm">
                {activeImageIndex + 1} / {imagesList.length}
              </span>
            )}
          </div>
        </div>

        {/* Thumbnail Carousel Bar */}
        {imagesList.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {imagesList.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? 'border-emerald-400 ring-2 ring-emerald-400/30 scale-105'
                    : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="pwa-detail-price flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Price</p>
          <p className="mt-1 text-2xl font-bold text-white">{car.price}</p>
        </div>
      </div>
      <p className="pwa-detail-description text-sm leading-6 text-slate-300">
        {car.description || 'Visit DriveXCars to learn more about this vehicle.'}
      </p>
      <div className="pwa-detail-specs grid grid-cols-2 sm:grid-cols-3 gap-3 border-y border-white/10 py-4">
        {[
          ['Year', car.year],
          ['Type', car.category],
          ['Fuel', car.fuel || car.fuelType || 'Not listed'],
          ['Transmission', car.transmission || 'Not listed'],
          ['Drivetrain', car.drivetrain || 'AWD'],
          ['Horsepower', car.horsepower || 'N/A'],
          ['Top Speed', car.topSpeed || 'N/A'],
          ['0-60 Accel.', car.acceleration || 'N/A'],
          ['Location', car.location || 'DriveXCars showroom']
        ].map(([label, value]) => (
          <div className="py-1" key={label}>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
            <div className="mt-1 text-sm font-medium text-slate-200">{value}</div>
          </div>
        ))}
      </div>

      {Array.isArray(car.documents) && car.documents.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Vehicle Documents</h3>
          <div className="grid grid-cols-1 gap-2">
            {car.documents.map((doc, idx) => (
              <a
                key={doc.id || idx}
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📄</span>
                  <div>
                    <div className="text-sm font-medium text-white">{doc.fileName}</div>
                    <div className="text-[11px] text-slate-400">{doc.fileType}</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-lime-400">Download ↓</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {Array.isArray(car.keyFeatures) && car.keyFeatures.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Key Features</h3>
          <div className="flex flex-wrap gap-2">
            {car.keyFeatures.map((feature, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              >
                ✓ {feature}
              </span>
            ))}
          </div>
        </div>
      )}
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
          className="pwa-image-lightbox fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${car.title} full-size image`}
          onClick={() => setIsImageExpanded(false)}
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white font-bold px-3.5 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg cursor-pointer transition-all"
            aria-label="Close full image"
            onClick={() => setIsImageExpanded(false)}
          >
            ✕ Close
          </button>

          {imagesList.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer"
                aria-label="Previous image"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer"
                aria-label="Next image"
              >
                ▶
              </button>
            </>
          )}

          <CarPhoto src={activePhotoUrl} alt={car.title} className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg" />
        </div>
      )}
    </section>
  );
}
