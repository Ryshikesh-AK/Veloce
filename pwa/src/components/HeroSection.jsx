import React from 'react';

export default function HeroSection({ darkMode }) {
  return (
    <section data-purpose="hero-section">
      <h1 className={`pwa-hero-title transition-colors ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        <span>Find a car that</span>
        <em>feels like you.</em>
      </h1>
    </section>
  );
}
