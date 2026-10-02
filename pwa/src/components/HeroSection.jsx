import React from 'react';

export default function HeroSection({ darkMode }) {
  return (
    <section data-purpose="hero-section">
      <h1 className={`text-2xl leading-tight font-bold tracking-tight transition-colors ${
        darkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Find your next car.
      </h1>
    </section>
  );
}
