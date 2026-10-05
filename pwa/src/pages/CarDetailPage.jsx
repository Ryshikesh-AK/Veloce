import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  Scale, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2, 
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import CarPhoto from '../components/cars/CarPhoto';
import { useCarContext } from '../context/CarContext';
import { hapticAction } from '../utils/haptics';

export default function CarDetailPage({ car: propCar }) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { cars, favorites, toggleFavorite, compareIds, toggleCompare, darkMode } = useCarContext();
  const car = propCar || cars.find((c) => c.id === paramId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [failedPhotoSrc, setFailedPhotoSrc] = useState('');

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
    hapticAction();
    setActiveImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    hapticAction();
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

  if (!car) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
          🚗
        </div>
        <h2 className="text-xl font-bold mb-2">Vehicle Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">
          The requested vehicle may have been sold or removed from our showroom inventory.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-[#bef264] text-slate-950 font-bold rounded-xl cursor-pointer hover:bg-[#aee750] transition-all shadow-sm"
        >
          Explore Showroom
        </button>
      </div>
    );
  }

  // 3x3 Technical Specs Definition
  const technicalSpecs = [
    { label: 'Year', value: car.year || '2024' },
    { label: 'Category', value: car.category || 'Luxury' },
    { label: 'Fuel / Powertrain', value: car.fuel || car.fuelType || 'Petrol' },
    { label: 'Horsepower', value: car.specs?.horsepower || car.horsepower || 'N/A' },
    { label: '0-60 Accel.', value: car.specs?.acceleration || car.acceleration || 'N/A' },
    { label: 'Top Speed', value: car.specs?.topSpeed || car.topSpeed || 'N/A' },
    { label: 'Transmission', value: car.transmission || 'Automatic' },
    { label: 'Drivetrain', value: car.drivetrain || 'AWD' },
    { label: 'Mileage', value: car.mileage ? `${Number(car.mileage).toLocaleString()} mi` : 'Delivery miles' },
  ];

  return (
    <div
      className={`min-h-[calc(100vh-80px)] pb-20 pt-2 transition-colors duration-200 ${
        darkMode ? 'text-slate-100' : 'text-slate-900'
      }`}
      data-purpose="car-details-screen"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold transition-colors cursor-pointer group ${
              darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <div className={`p-1.5 rounded-full transition-transform group-hover:-translate-x-1 ${
              darkMode ? 'bg-slate-800 text-[#bef264]' : 'bg-slate-100 text-slate-700'
            }`}>
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back to Fleet</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {car.status || 'Showroom Available'}
            </span>
          </div>
        </div>

        {/* Hero Gallery Container */}
        <div className="space-y-3">
          {/* Main Hero Photo Container - Clicking opens Lightbox Preview */}
          <div
            onClick={() => {
              if (!isPhotoUnavailable) {
                hapticAction();
                setIsImageExpanded(true);
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            title="Click to expand full image"
            className="w-full aspect-[16/9] md:h-[450px] object-cover rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-900 relative group cursor-pointer select-none border border-slate-200/80 dark:border-slate-800 shadow-sm"
          >
            <CarPhoto
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              src={activePhotoUrl}
              alt={`${car.title} - photo ${activeImageIndex + 1}`}
              onError={() => setFailedPhotoSrc(activePhotoUrl)}
            />

            {/* Subtle Zoom Hint in corner */}
            <div className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-950/70 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4" />
            </div>

            {/* Carousel Next / Prev Controls - Hidden by default, shown on hover with crisp white chevrons */}
            {imagesList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-slate-950/80 p-2.5 text-white backdrop-blur-md hover:bg-slate-950 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg border border-white/20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-white stroke-[2.5]" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-slate-950/80 p-2.5 text-white backdrop-blur-md hover:bg-slate-950 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg border border-white/20"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-white stroke-[2.5]" />
                </button>
              </>
            )}
          </div>

          {/* 4 Gallery Thumbnails in a Tidy Row with Lime Active Border States */}
          {imagesList.length > 1 && (
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {imagesList.slice(0, 4).map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    hapticAction();
                    setActiveImageIndex(idx);
                  }}
                  className={`relative aspect-[16/10] sm:h-20 w-full rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-slate-950 ${
                    activeImageIndex === idx
                      ? 'border-[#bef264] ring-2 ring-[#bef264]/40 scale-[1.02] shadow-sm'
                      : 'border-transparent opacity-65 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                  aria-label={`View photo ${idx + 1}`}
                >
                  <img
                    src={imgUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2-Column Split: Left (~65%) vs Right Sticky (~35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          {/* Left Column (Width: ~65% -> 8 of 12 cols on desktop) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Title, Year / Model Subtitle */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {car.brand || 'Luxury'}
                </span>
                <span className="text-slate-400">•</span>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  darkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {car.category || 'Exotic'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                {car.title || car.name}
              </h1>
              <p className={`text-sm sm:text-base font-medium ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {car.year} Model • {car.model || car.title} Edition
              </p>
            </div>

            {/* Overview Description */}
            <div className={`p-6 rounded-3xl border ${
              darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/80 border-slate-200/80'
            }`}>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2">
                Vehicle Overview
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed ${
                darkMode ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {car.description ||
                  'An exceptional luxury vehicle engineered to deliver uncompromising performance, refined craftsmanship, and track-inspired responsiveness for the discerning collector.'}
              </p>
            </div>

            {/* 3x3 Technical Specs Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-extrabold uppercase tracking-wider">
                  Technical Specifications
                </h2>
                <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Factory Verified
                </span>
              </div>

              <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 p-5 rounded-3xl border ${
                darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
              }`}>
                {technicalSpecs.map((spec) => (
                  <div
                    key={spec.label}
                    className={`p-3.5 rounded-2xl transition-colors ${
                      darkMode ? 'bg-slate-850/60 hover:bg-slate-800/80' : 'bg-slate-50/70 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      {spec.label}
                    </div>
                    <div className="mt-1 text-sm font-extrabold truncate">
                      {spec.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Feature Checkmarks */}
            {Array.isArray(car.keyFeatures) && car.keyFeatures.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-extrabold uppercase tracking-wider">
                  Key Features & Options
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {car.keyFeatures.map((feature, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs font-bold transition-colors ${
                        darkMode
                          ? 'bg-slate-900/40 border-slate-800/80 text-slate-200'
                          : 'bg-white border-slate-200/80 text-slate-800 shadow-2xs'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Width: ~35% -> 4 of 12 cols on desktop, Sticky) */}
          <div className="lg:col-span-4">
            <div
              className={`sticky top-24 rounded-3xl p-6 border shadow-sm transition-all space-y-6 ${
                darkMode
                  ? 'bg-slate-900 border-slate-800/90'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              {/* Pricing & Rating */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                <div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Showroom Price
                  </span>
                  <div className="text-3xl font-black text-emerald-500 mt-1">
                    {car.price || (car.priceAmount ? `$${Number(car.priceAmount).toLocaleString()}` : 'Inquire')}
                  </div>
                  <span className={`text-[11px] font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    Includes delivery preparation
                  </span>
                </div>

                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  darkMode ? 'bg-slate-800 text-amber-400' : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                }`}>
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{car.rating == null ? '5.0' : car.rating}</span>
                </div>
              </div>

              {/* Primary CTA Button: Inquire about this car */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    hapticAction();
                    navigate('/contact');
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#bef264] hover:bg-[#aee750] text-slate-950 font-extrabold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <span>Inquire about this car</span>
                  <span aria-hidden="true">→</span>
                </button>

                {/* Save and Compare Toggle Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      hapticAction();
                      toggleFavorite(car.id);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isFavorite
                        ? 'bg-rose-500/15 border-rose-500/30 text-rose-500'
                        : darkMode
                        ? 'border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-300'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                    <span>{isFavorite ? 'Saved' : 'Save Car'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      hapticAction();
                      toggleCompare(car.id);
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isCompared
                        ? 'bg-[#bef264]/20 border-[#bef264]/40 text-emerald-600 dark:text-[#bef264]'
                        : darkMode
                        ? 'border-slate-800 bg-slate-850 hover:bg-slate-800 text-slate-300'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isCompared ? 'In Matrix' : 'Compare'}</span>
                  </button>
                </div>
              </div>

              {/* Showroom Contact & Assurance */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                darkMode ? 'bg-slate-850/50 border-slate-800/80' : 'bg-slate-50/80 border-slate-200/70'
              }`}>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
                  <ShieldCheck className="w-4 h-4" />
                  <span>DriveXCars Concierge VIP</span>
                </div>

                <div className={`space-y-2 text-xs ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{car.location || 'San Francisco Showroom, CA'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>+1 (234) 567-890</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>concierge@drivexcars.co.uk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Image Lightbox */}
        {isImageExpanded && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 select-none"
            role="dialog"
            aria-modal="true"
            aria-label={`${car.title} full-size image`}
            onClick={() => setIsImageExpanded(false)}
          >
            <button
              type="button"
              className="absolute top-5 right-5 text-white font-bold p-2.5 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-all border border-white/20"
              aria-label="Close full image"
              onClick={() => setIsImageExpanded(false)}
            >
              <X className="w-5 h-5" />
            </button>

            {imagesList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/25 transition-all cursor-pointer border border-white/20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/25 transition-all cursor-pointer border border-white/20"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <div
              className="relative max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <CarPhoto
                src={activePhotoUrl}
                alt={car.title}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                {activeImageIndex + 1} / {imagesList.length} • {car.title}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

