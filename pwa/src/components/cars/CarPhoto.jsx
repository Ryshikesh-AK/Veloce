import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

export default function CarPhoto({ src, alt, className = '', onError }) {
  const [failedSrc, setFailedSrc] = useState('');
  const hasError = !src || failedSrc === src;

  if (hasError) {
    return (
      <div 
        className={`pwa-photo-fallback flex flex-col items-center justify-center gap-1.5 p-4 text-center ${className}`} 
        role="img" 
        aria-label={`${alt || 'Vehicle'} photo unavailable`}
      >
        <ImageOff className="w-6 h-6 opacity-60 text-slate-400" />
        <span className="text-xs font-semibold text-slate-400">Showroom photo unavailable</span>
      </div>
    );
  }

  return (
    <img 
      className={className} 
      src={src} 
      alt={alt || 'DriveXCars vehicle'} 
      loading="lazy"
      decoding="async"
      onError={() => { 
        setFailedSrc(src); 
        onError?.(); 
      }} 
    />
  );
}