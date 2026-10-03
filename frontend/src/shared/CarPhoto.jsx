import React, { useState } from 'react';

export default function CarPhoto({ src, alt, className = '' }) {
  const [failedSrc, setFailedSrc] = useState('');
  const hasError = !src || failedSrc === src;

  if (hasError) {
    return (
      <div className={`vehicle-photo-fallback ${className}`} role="img" aria-label={`${alt || 'Vehicle'} photo unavailable`}>
        <span>Photo unavailable</span>
      </div>
    );
  }

  return <img className={className} src={src} alt={alt} onError={() => setFailedSrc(src)} />;
}