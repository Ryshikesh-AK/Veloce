import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { hapticCard, hapticAction } from '../../utils/haptics';
import { useCarContext } from '../../context/CarContext';
import CarPhoto from './CarPhoto';

export default function CarCard({ darkMode: propDarkMode, car, isFavorite: propIsFav, isCompared: propIsComp, onToggleFavorite, onCompare, onViewDetails }) {
  const navigate = useNavigate();
  const context = useCarContext();
  const darkMode = propDarkMode ?? context.darkMode;

  const {
    id,
    title,
    rating,
    year,
    category,
    location,
    price,
    status,
    imageUrl,
    imgObjectPos = 'object-cover'
  } = car;

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const isSwipingRef = React.useRef(false);
  const touchStartPos = React.useRef(null);
  const pointerStartPos = React.useRef(null);

  const imagesList = React.useMemo(() => {
    if (Array.isArray(car.images) && car.images.length > 0) {
      return car.images;
    }
    if (typeof car.images === 'string' && car.images.trim()) {
      try {
        const parsed = JSON.parse(car.images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // use fallback below
      }
    }
    const fallback = imageUrl || car.image || car.imageUrl;
    return fallback ? [fallback] : [];
  }, [car.images, imageUrl, car.image, car.imageUrl]);

  // Auto-Play Slideshow every 3.8s, paused when card is hovered or swiped
  React.useEffect(() => {
    if (imagesList.length <= 1 || isHovered) return undefined;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
    }, 3800);

    return () => clearInterval(timer);
  }, [imagesList.length, isHovered]);

  const displayPhotoUrl = imagesList[currentImageIndex] || imageUrl || car.image || '';

  const isFavorite = propIsFav ?? context.favorites.includes(id);
  const isCompared = propIsComp ?? context.compareIds.includes(id);

  const handleNextCardImage = (event) => {
    event?.stopPropagation();
    hapticAction();
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrevCardImage = (event) => {
    event?.stopPropagation();
    hapticAction();
    setCurrentImageIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  // Touch Swipe Handlers for mobile sliding
  const handleTouchStart = (e) => {
    isSwipingRef.current = false;
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e) => {
    if (!touchStartPos.current) return;
    const touch = e.touches[0];
    const diffX = touch.clientX - touchStartPos.current.x;
    const diffY = touch.clientY - touchStartPos.current.y;
    if (Math.abs(diffX) > 10 && Math.abs(diffX) > Math.abs(diffY)) {
      isSwipingRef.current = true;
    }
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
        handleNextCardImage(e);
      } else {
        handlePrevCardImage(e);
      }
      setTimeout(() => {
        isSwipingRef.current = false;
      }, 150);
    } else {
      setTimeout(() => {
        isSwipingRef.current = false;
      }, 50);
    }
  };

  // Pointer Swipe Handlers for mouse/trackpad dragging
  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    isSwipingRef.current = false;
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
        handleNextCardImage(e);
      } else {
        handlePrevCardImage(e);
      }
      isSwipingRef.current = true;
      setTimeout(() => {
        isSwipingRef.current = false;
      }, 150);
    }
  };

  const handleToggleFav = (event) => {
    event.stopPropagation();
    hapticAction();
    if (onToggleFavorite) onToggleFavorite(id);
    else context.toggleFavorite(id);
  };

  // Native Web Share or Clipboard Fallback
  const handleShare = async (event) => {
    event.stopPropagation();
    hapticAction();

    const shareUrl = `${window.location.origin}/car/${id}`;
    const shareTitle = `${title} | DriveXCars`;
    const shareText = `Explore ${title} (${price}) on DriveXCars.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      if (context.setToast) {
        context.setToast('Link Copied!');
      }
    } catch {
      if (context.setToast) {
        context.setToast('Could not copy link');
      }
    }
  };

  const handleCompare = (event) => {
    event.stopPropagation();
    hapticAction();
    if (onCompare) onCompare(car);
    else context.toggleCompare(id);
  };

  const handleView = (event) => {
    if (isSwipingRef.current) return;
    event?.stopPropagation();
    hapticCard();
    if (onViewDetails) onViewDetails(car);
    else navigate(`/car/${id}`);
  };

  const handleCardKeyDown = (event) => {
    if (event.target !== event.currentTarget || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    handleView();
  };

  return (
    <motion.article 
      whileHover={{ y: -2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleView}
      onKeyDown={handleCardKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`View details for ${title}`}
      className={`rounded-2xl border overflow-hidden shadow-xl transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        darkMode 
          ? 'bg-slate-900/60 backdrop-blur-md border-white/10 text-white hover:border-emerald-500/30' 
          : 'bg-white border-gray-200/70 text-gray-900 shadow-subtle hover:shadow-md'
      }`} 
      data-purpose="car-card"
    >
      {/* Thumbnail Container with Carousel Controls & Touch Gesture Support */}
      <div 
        className="relative h-48 w-full bg-slate-950 overflow-hidden group select-none touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        {/* Slideshow Image Stack with smooth crossfade and subtle Ken Burns zoom */}
        {imagesList.map((imgSrc, idx) => (
          <div
            key={imgSrc || idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentImageIndex ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
            }`}
          >
            <CarPhoto
              alt={title}
              src={imgSrc}
              className={`w-full h-full object-cover filter brightness-95 contrast-105 transition-transform duration-700 ease-out group-hover:scale-105 ${imgObjectPos}`}
            />
          </div>
        ))}

        {/* Carousel Prev/Next Buttons */}
        {imagesList.length > 1 && (
          <>
            <button
              type="button"
              onClick={handleNextCardImage}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950/70 text-white flex items-center justify-center opacity-70 hover:opacity-100 group-hover:opacity-100 transition-opacity backdrop-blur-md hover:bg-slate-900 cursor-pointer z-10 text-xs font-bold"
            >
              ›
            </button>
            <button
              type="button"
              onClick={handlePrevCardImage}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950/70 text-white flex items-center justify-center opacity-70 hover:opacity-100 group-hover:opacity-100 transition-opacity backdrop-blur-md hover:bg-slate-900 cursor-pointer z-10 text-xs font-bold"
            >
              ‹
            </button>

            {/* Carousel Dot Indicators - Synchronized with lime accent */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10 bg-slate-950/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
              {imagesList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    hapticAction();
                    setCurrentImageIndex(idx);
                  }}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    currentImageIndex === idx
                      ? 'bg-[#bef264] w-3.5 h-1.5 shadow-xs'
                      : 'bg-white/40 hover:bg-white/70 w-1.5 h-1.5'
                  }`}
                  aria-label={`Go to photo ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
        
        {status && status !== 'Available' && (
          <div className="absolute left-3 top-3 rounded-md border border-white/15 bg-slate-950/85 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md z-10">
            {status}
          </div>
        )}

        {/* Top-Right Action Buttons: Share & Favorite */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {/* Circular Share Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            aria-label="Share car listing"
            title="Share or copy link"
            className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 shadow-sm flex items-center justify-center transition-all cursor-pointer border border-white/40"
          >
            <svg
              className="w-3.5 h-3.5 stroke-current fill-none stroke-[2.2]"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </motion.button>

          {/* Favorite Button */}
          <motion.button 
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFav}
            aria-label={isFavorite ? 'Remove from saved cars' : 'Save car'}
            className={`w-8 h-8 rounded-full backdrop-blur-sm border flex items-center justify-center transition-transform cursor-pointer shadow-sm ${
              isFavorite 
                ? 'text-rose-500 border-rose-500/30 bg-white/90' 
                : 'bg-white/80 border-white/40 text-slate-700 hover:bg-white'
            }`}
          >
            <svg className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 stroke-rose-500' : 'stroke-current fill-transparent'}`} strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </motion.button>
        </div>

        <div className="absolute bottom-3 right-3 z-10">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCompare}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md backdrop-blur-sm text-[10px] text-white font-medium cursor-pointer ${isCompared ? 'bg-emerald-700/90' : 'bg-black/60 hover:bg-black/80'}`}
          >
            <span>{isCompared ? '✓' : '+'}</span> {isCompared ? 'Added' : 'Compare'}
          </motion.button>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 space-y-2">
        {car.submodel && car.submodel.toLowerCase() !== title.toLowerCase() && (
          <p className={`text-xs font-semibold tracking-wide ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {car.submodel}
          </p>
        )}

        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-base tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        </div>
        
        {/* Specs line: Transmission • Fuel */}
        <p className={`text-[11px] font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          {[car.transmission, car.fuel || car.fuelType || 'Petrol'].filter(Boolean).join(' • ')}
        </p>

        {/* Card Bottom Divider & Price CTA */}
        <div className={`pt-3 mt-1 border-t flex items-center justify-between ${
          darkMode ? 'border-white/10' : 'border-gray-100'
        }`}>
          <div>
            <span className={`text-[10px] uppercase block font-medium ${darkMode ? 'text-slate-400' : 'text-gray-400'}`}>Price</span>
            <span className={`text-base font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>{price}</span>
          </div>
          <motion.button 
            whileHover={{ x: 2 }}
            onClick={handleView}
            className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 group cursor-pointer"
          >
            View details
            <span className="group-hover:translate-x-0.5 transition-transform text-emerald-500">→</span>
          </motion.button>
        </div>

        {/* Location, Year, & Mileage Footer Bar with Location Pin Icon */}
        <div className={`pt-2 flex items-center gap-1.5 text-[11px] font-medium ${
          darkMode ? 'text-slate-400 border-t border-white/5' : 'text-gray-500 border-t border-gray-100'
        }`}>
          <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">
            {[location, year, car.mileageFormatted || (car.mileage ? `${Number(car.mileage).toLocaleString()} miles` : '')].filter(Boolean).join(' • ')}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
