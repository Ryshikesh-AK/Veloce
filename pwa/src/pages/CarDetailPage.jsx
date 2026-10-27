import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calculator,
  Heart,
  Scale,
  ArrowLeft,
  MessageSquare,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Calendar,
  Gauge,
  Fuel,
  Cpu,
  Zap,
  ShieldCheck,
  MapPin,
  Sparkles,
  Share2
} from 'lucide-react';
import CarPhoto from '../components/cars/CarPhoto';
import CarCard from '../components/cars/CarCard';
import LeaseCalculatorModal from '../components/cars/LeaseCalculatorModal';
import { useCarContext } from '../context/CarContext';
import { getCarById } from '../services/api';

export default function CarDetailPage({ car: propCar }) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { cars, favorites, toggleFavorite, compareIds, toggleCompare, darkMode } = useCarContext();

  const matchedInContext = cars.find((c) => String(c.id) === String(paramId));
  const [fetchedCar, setFetchedCar] = useState(null);
  const car = propCar || fetchedCar || matchedInContext || null;
  const [loading, setLoading] = useState(() => !propCar && !matchedInContext && Boolean(paramId));

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [prevParamId, setPrevParamId] = useState(paramId);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [failedPhotoSrc, setFailedPhotoSrc] = useState('');
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Reset selected image when car ID changes
  if (paramId !== prevParamId) {
    setPrevParamId(paramId);
    setSelectedPhotoIndex(0);
  }

  const activeImageIndex = selectedPhotoIndex;
  const setActiveImageIndex = setSelectedPhotoIndex;

  useEffect(() => {
    if (propCar || matchedInContext || !paramId) return;

    let active = true;
    getCarById(paramId)
      .then((result) => {
        if (active && result) {
          setFetchedCar(result);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [paramId, propCar, matchedInContext]);

  const imagesList = useMemo(() => {
    if (!car) return [];
    if (Array.isArray(car.images) && car.images.length > 0) {
      return car.images;
    }
    if (typeof car.images === 'string' && car.images.trim()) {
      try {
        const parsed = JSON.parse(car.images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback to imageUrl
      }
    }
    const fallback = car.imageUrl || car.image;
    return fallback ? [fallback] : [];
  }, [car]);

  const activePhotoUrl = imagesList[activeImageIndex] || car?.imageUrl || '';
  const isPhotoUnavailable = !activePhotoUrl || failedPhotoSrc === activePhotoUrl;

  const isFavorite = car ? favorites.includes(car.id) : false;
  const isCompared = car ? compareIds.includes(car.id) : false;

  // Related vehicles for showroom experience
  const relatedCars = useMemo(() => {
    if (!car || !Array.isArray(cars)) return [];
    return cars
      .filter((c) => String(c.id) !== String(car.id))
      .filter((c) => (car.category && c.category === car.category) || (car.fuel && c.fuel === car.fuel) || true)
      .slice(0, 3);
  }, [car, cars]);

  const touchStartPos = useRef(null);
  const pointerStartPos = useRef(null);

  const handleNextImage = useCallback(() => {
    setActiveImageIndex((prev) => (imagesList.length > 0 ? (prev + 1) % imagesList.length : 0));
  }, [imagesList.length]);

  const handlePrevImage = useCallback(() => {
    setActiveImageIndex((prev) => (imagesList.length > 0 ? (prev - 1 + imagesList.length) % imagesList.length : 0));
  }, [imagesList.length]);

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
        handleNextImage();
      } else {
        handlePrevImage();
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
        handleNextImage();
      } else {
        handlePrevImage();
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: car?.title || 'DriveXCars Vehicle',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
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
  }, [isImageExpanded, handleNextImage, handlePrevImage]);

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-[#bef264] border-t-transparent"></div>
        <p className={`text-sm font-semibold tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Loading showroom vehicle details...
        </p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="py-20 text-center space-y-5 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-slate-500/10 text-slate-400">
          <Zap className="w-8 h-8 opacity-40" />
        </div>
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Vehicle Not Found
        </h2>
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          The vehicle you are looking for might have been sold, reserved, or removed from our showroom catalog.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#bef264] text-slate-950 font-bold text-xs rounded-xl cursor-pointer hover:bg-[#aee750] transition shadow-md shadow-[#bef264]/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Showroom</span>
        </button>
      </div>
    );
  }

  // Calculate quick lease estimate for header badge
  const numericPrice = parseInt(String(car.price || '0').replace(/[^0-9]/g, ''), 10) || 0;
  const estimatedLease = numericPrice > 0 ? Math.round(numericPrice * 0.0135) : null;

  return (
    <section className="pwa-detail-screen w-full max-w-7xl mx-auto space-y-8" data-purpose="car-details-screen">
      {/* Breadcrumb & Navigation Bar */}
      <div className="flex items-center justify-between gap-4 border-b pb-4 transition-colors border-slate-200/60 dark:border-white/10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back to previous page"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition border cursor-pointer ${
              darkMode
                ? 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 shadow-2xs'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition">Showroom</Link>
            <span>/</span>
            <span className="capitalize">{car.category || 'Luxury'}</span>
            <span>/</span>
            <span className="font-semibold truncate max-w-[180px] sm:max-w-xs text-slate-900 dark:text-slate-200">
              {car.title}
            </span>
          </div>
        </div>

        {/* Quick Action Badges */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share vehicle"
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition border cursor-pointer ${
              darkMode
                ? 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 shadow-2xs'
            }`}
            title="Share Vehicle"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#bef264]" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => toggleFavorite(car.id)}
            aria-label={isFavorite ? 'Remove from saved' : 'Save vehicle'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition border cursor-pointer ${
              isFavorite
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-500'
                : darkMode
                ? 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 shadow-2xs'
            }`}
            title="Save Vehicle"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => toggleCompare(car.id)}
            aria-label={isCompared ? 'Remove from compare' : 'Compare vehicle'}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition border cursor-pointer ${
              isCompared
                ? 'bg-[#bef264]/20 border-[#bef264]/50 text-slate-900 dark:text-[#bef264]'
                : darkMode
                ? 'bg-slate-900 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 shadow-2xs'
            }`}
            title="Compare Vehicle"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero 2-Column Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Premium Gallery (7 Cols on LG) */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-3.5">
          {/* Main Large Stage */}
          <div
            className="pwa-detail-image relative overflow-hidden rounded-3xl bg-slate-950 group select-none touch-pan-y border border-slate-200/50 dark:border-white/10 shadow-xl"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
          >
            <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden bg-slate-900">
              <CarPhoto
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                src={activePhotoUrl}
                alt={`${car.title} - photo ${activeImageIndex + 1}`}
                onError={() => setFailedPhotoSrc(activePhotoUrl)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
            </div>

            {/* Carousel Arrows */}
            {imagesList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/70 text-white backdrop-blur-md hover:bg-slate-900/90 transition flex items-center justify-center cursor-pointer border border-white/10 shadow-md opacity-90 hover:opacity-100 active:scale-95"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-950/70 text-white backdrop-blur-md hover:bg-slate-900/90 transition flex items-center justify-center cursor-pointer border border-white/10 shadow-md opacity-90 hover:opacity-100 active:scale-95"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="rounded-lg bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#bef264] animate-pulse" />
                <span>{car.status || car.badge || 'Available Now'}</span>
              </span>
              {car.isFeatured && (
                <span className="rounded-lg bg-[#bef264] px-2.5 py-1.5 text-xs font-extrabold text-slate-950 flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Featured</span>
                </span>
              )}
            </div>

            {/* Bottom Controls / Badge */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {imagesList.length > 1 && (
                  <span className="rounded-lg bg-black/70 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                    {activeImageIndex + 1} / {imagesList.length} Photos
                  </span>
                )}
                {car.location && (
                  <span className="hidden sm:flex items-center gap-1 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs text-slate-200 backdrop-blur-md border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-[#bef264]" />
                    <span>{car.location}</span>
                  </span>
                )}
              </div>

              {!isPhotoUnavailable && (
                <button
                  type="button"
                  onClick={() => setIsImageExpanded(true)}
                  className="rounded-lg bg-black/75 px-3 py-1.5 text-xs font-bold text-white hover:bg-black/90 backdrop-blur-md border border-white/15 transition flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Fullscreen</span>
                </button>
              )}
            </div>
          </div>

          {/* Thumbnails Row */}
          {imagesList.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 pt-1">
              {imagesList.map((imgUrl, idx) => {
                const isActive = activeImageIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all cursor-pointer group/thumb ${
                      isActive
                        ? 'border-[#bef264] ring-2 ring-[#bef264]/40 scale-[1.02] shadow-sm'
                        : 'border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100 hover:border-slate-400 dark:hover:border-white/30'
                    }`}
                    aria-label={`Show photo ${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                      loading="lazy"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-[#bef264]/10 pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Vehicle Title, Pricing, Key Specs & Primary CTAs (5 Cols on LG) */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-5">
          {/* Main Card: Details & Price */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border transition-colors shadow-sm ${
              darkMode
                ? 'bg-slate-900/95 border-white/10 text-white'
                : 'bg-white border-slate-200/90 text-slate-900'
            }`}
          >
            {/* Header info */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-500 dark:text-[#bef264]">
                  {car.category || 'Luxury Performance'}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                  darkMode ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  VIN: {car.id ? `VX-${String(car.id).padStart(5, '0')}` : 'VERIFIED'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                {car.title}
              </h1>

              {car.submodel && (
                <p className={`text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {car.submodel}
                </p>
              )}
            </div>

            {/* Price & Finance Strip */}
            <div className={`mt-5 p-4 rounded-2xl border transition-colors ${
              darkMode
                ? 'bg-slate-950/60 border-white/5'
                : 'bg-slate-50 border-slate-200/80'
            }`}>
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Vehicle Purchase Price
                  </span>
                  <div className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-0.5">
                    {car.price}
                  </div>
                </div>

                {estimatedLease && (
                  <div className="text-right">
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      Est. Lease
                    </span>
                    <div className="text-sm font-bold text-emerald-600 dark:text-[#bef264]">
                      ~${estimatedLease.toLocaleString()}/mo
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setCalculatorOpen(true)}
                className="mt-3.5 w-full py-2.5 px-3 rounded-xl border border-[#bef264]/40 bg-[#bef264]/10 hover:bg-[#bef264]/20 text-[#bef264] dark:text-[#bef264] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Calculator className="w-4 h-4 text-[#bef264]" />
                <span className="text-slate-900 dark:text-[#bef264]">Estimate Monthly Lease & Financing</span>
              </button>
            </div>

            {/* High-level Quick Specs (4 key metrics) */}
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <div className={`p-3 rounded-2xl border ${
                darkMode ? 'bg-slate-950/40 border-white/5' : 'bg-slate-50/80 border-slate-200/60'
              }`}>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500 dark:text-[#bef264]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Model Year</span>
                </div>
                <div className="mt-1 text-sm font-bold truncate">{car.year || 'Current'}</div>
              </div>

              <div className={`p-3 rounded-2xl border ${
                darkMode ? 'bg-slate-950/40 border-white/5' : 'bg-slate-50/80 border-slate-200/60'
              }`}>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400 text-xs">
                  <Gauge className="w-3.5 h-3.5 text-emerald-500 dark:text-[#bef264]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Mileage</span>
                </div>
                <div className="mt-1 text-sm font-bold truncate">
                  {car.mileageFormatted || (car.mileage ? `${car.mileage.toLocaleString()} mi` : 'Delivery Mileage')}
                </div>
              </div>

              <div className={`p-3 rounded-2xl border ${
                darkMode ? 'bg-slate-950/40 border-white/5' : 'bg-slate-50/80 border-slate-200/60'
              }`}>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400 text-xs">
                  <Fuel className="w-3.5 h-3.5 text-emerald-500 dark:text-[#bef264]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Powertrain</span>
                </div>
                <div className="mt-1 text-sm font-bold truncate">{car.fuel || car.fuelType || 'Petrol'}</div>
              </div>

              <div className={`p-3 rounded-2xl border ${
                darkMode ? 'bg-slate-950/40 border-white/5' : 'bg-slate-50/80 border-slate-200/60'
              }`}>
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400 text-xs">
                  <Cpu className="w-3.5 h-3.5 text-emerald-500 dark:text-[#bef264]" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Transmission</span>
                </div>
                <div className="mt-1 text-sm font-bold truncate">{car.transmission || 'Automatic'}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => navigate('/contact')}
                className="w-full py-4 px-6 rounded-2xl bg-[#bef264] hover:bg-[#aee750] text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2.5 transition shadow-lg shadow-[#bef264]/20 cursor-pointer active:scale-[0.99]"
              >
                <MessageSquare className="w-4 h-4 fill-slate-950" />
                <span>Inquire About This Vehicle</span>
              </button>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => toggleFavorite(car.id)}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    isFavorite
                      ? 'bg-rose-500/15 border-rose-500/40 text-rose-500'
                      : darkMode
                      ? 'border-white/10 hover:bg-white/5 text-slate-200'
                      : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? 'In Garage' : 'Save Vehicle'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCompare(car.id)}
                  className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    isCompared
                      ? 'bg-[#bef264]/20 border-[#bef264]/50 text-slate-900 dark:text-[#bef264]'
                      : darkMode
                      ? 'border-white/10 hover:bg-white/5 text-slate-200'
                      : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                  <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                </button>
              </div>
            </div>

            {/* DriveXCars Certified Trust Guarantee */}
            <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-white/10 flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-[#bef264] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-[11px] leading-tight text-slate-500 dark:text-slate-400">
                <span className="font-bold text-slate-900 dark:text-slate-200 block">DriveXCars Provenance Guarantee</span>
                Inspected across 160 points with full provenance documentation included.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Sections: Organized Tabs & Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Left Column (8 Cols): Overview, Full Specs Grid, Key Features */}
        <div className="lg:col-span-8 space-y-6">
          {/* Vehicle Overview / Description */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border transition-colors ${
              darkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white border-slate-200/90 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold tracking-tight">Vehicle Overview & Curated Notes</h2>
              <span className="text-xs text-slate-400">Official Showroom Listing</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
              {car.description ||
                'Curated performance vehicle from DriveXCars Motors. Fully certified and inspected for quality, performance, and mechanical integrity. Available for immediate private viewing or nationwide delivery.'}
            </p>
          </div>

          {/* Full Specifications Matrix */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border transition-colors ${
              darkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white border-slate-200/90 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold tracking-tight">Complete Specifications</h2>
                <p className="text-xs text-slate-400 mt-0.5">Verified engineering and performance metrics</p>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#bef264]/10 text-slate-900 dark:text-[#bef264] border border-[#bef264]/20">
                OEM Specs
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Year', value: car.year },
                { label: 'Body Category', value: car.category },
                { label: 'Fuel / Powertrain', value: car.fuel || car.fuelType || 'Petrol' },
                { label: 'Transmission', value: car.transmission || 'Automatic' },
                { label: 'Drivetrain', value: car.drivetrain || 'All-Wheel Drive (AWD)' },
                { label: 'Horsepower', value: car.horsepower ? `${car.horsepower} HP` : 'High Output' },
                { label: 'Top Speed', value: car.topSpeed || '155 mph' },
                { label: '0–60 mph Accel.', value: car.acceleration || '3.5 sec' },
                { label: 'Showroom Location', value: car.location || 'London Central Gallery' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-colors ${
                    darkMode
                      ? 'bg-slate-950/40 border-white/5 hover:border-white/15'
                      : 'bg-slate-50 border-slate-200/70 hover:border-slate-300'
                  }`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {item.label}
                  </div>
                  <div className="mt-1 text-sm font-semibold truncate text-slate-900 dark:text-slate-100">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features & Factory Options */}
          {Array.isArray(car.keyFeatures) && car.keyFeatures.length > 0 && (
            <div
              className={`p-6 sm:p-7 rounded-3xl border transition-colors ${
                darkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white border-slate-200/90 shadow-2xs'
              }`}
            >
              <h2 className="text-base font-bold tracking-tight mb-4">Factory Options & Equipment</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {car.keyFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold ${
                      darkMode
                        ? 'bg-slate-950/40 border-white/5 text-slate-200'
                        : 'bg-slate-50 border-slate-200/70 text-slate-800'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#bef264]/20 text-slate-900 dark:text-[#bef264] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 Cols): Provenance Documents, Concierge Box, Finance Helper */}
        <div className="lg:col-span-4 space-y-6">
          {/* Provenance & Documents Card */}
          {Array.isArray(car.documents) && car.documents.length > 0 && (
            <div
              className={`p-6 rounded-3xl border transition-colors ${
                darkMode ? 'bg-slate-900/70 border-white/10' : 'bg-white border-slate-200/90 shadow-2xs'
              }`}
            >
              <h2 className="text-sm font-bold tracking-tight uppercase tracking-wider text-slate-400 mb-3">
                Provenance & Inspection
              </h2>
              <div className="space-y-2.5">
                {car.documents.map((doc, idx) => (
                  <a
                    key={doc.id || idx}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition group cursor-pointer ${
                      darkMode
                        ? 'bg-slate-950/50 border-white/5 hover:border-[#bef264]/40 hover:bg-slate-900'
                        : 'bg-slate-50 border-slate-200 hover:border-[#bef264] hover:bg-emerald-50/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center shrink-0 text-base">
                        📄
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold truncate text-slate-900 dark:text-white">
                          {doc.fileName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {doc.fileType} {doc.fileSize ? `• ${doc.fileSize}` : ''}
                        </div>
                      </div>
                    </div>
                    <span className="p-2 rounded-lg text-emerald-500 dark:text-[#bef264] group-hover:scale-110 transition shrink-0">
                      <Download className="w-4 h-4" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Quick Concierge Box */}
          <div
            className={`p-6 rounded-3xl border transition-colors ${
              darkMode
                ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-white/10'
                : 'bg-gradient-to-br from-slate-50 to-white border-slate-200 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-[#bef264] text-slate-950 flex items-center justify-center font-black">
                VX
              </div>
              <div>
                <h3 className="text-sm font-bold">DriveX Private Client Concierge</h3>
                <p className="text-[11px] text-slate-400">Available 7 days • Direct Advisor</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 mb-4">
              Need personalized financing, vehicle trade-in appraisal, or private enclosed transport?
            </p>
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold transition hover:opacity-90 cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Connect with an Advisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Vehicles Section */}
      {relatedCars.length > 0 && (
        <div className="pt-8 border-t border-slate-200/60 dark:border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500 dark:text-[#bef264]">
                More from Showroom
              </span>
              <h2 className="text-xl font-bold tracking-tight mt-0.5">Similar Luxury Vehicles</h2>
            </div>
            <Link
              to="/"
              className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1"
            >
              <span>View All Inventory</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedCars.map((relatedCar) => (
              <CarCard
                key={relatedCar.id}
                car={relatedCar}
                darkMode={darkMode}
                isFavorite={favorites.includes(relatedCar.id)}
                isCompared={compareIds.includes(relatedCar.id)}
                onToggleFavorite={toggleFavorite}
                onCompare={toggleCompare}
                onViewDetails={() => navigate(`/car/${relatedCar.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Full Size Image Lightbox */}
      {isImageExpanded && (
        <div
          className="pwa-image-lightbox fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${car.title} full-size image`}
          onClick={() => setIsImageExpanded(false)}
        >
          <button
            type="button"
            className="absolute top-5 right-5 text-white font-bold px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl cursor-pointer transition-all border border-white/15"
            aria-label="Close full image"
            onClick={() => setIsImageExpanded(false)}
          >
            ✕ Close
          </button>

          {imagesList.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3.5 text-white backdrop-blur-md hover:bg-white/25 transition-all cursor-pointer border border-white/15"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3.5 text-white backdrop-blur-md hover:bg-white/25 transition-all cursor-pointer border border-white/15"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <CarPhoto src={activePhotoUrl} alt={car.title} className="max-h-[85vh] max-w-[90vw] object-contain" />
          </div>
        </div>
      )}

      {/* Interactive Lease & Payment Calculator Modal */}
      <LeaseCalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
        car={car}
        darkMode={darkMode}
      />
    </section>
  );
}
