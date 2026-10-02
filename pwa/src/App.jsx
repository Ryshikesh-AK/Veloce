import React, { useState } from 'react';
import StatusBar from './components/StatusBar';
import NavigationHeader from './components/NavigationHeader';
import HeroSection from './components/HeroSection';
import FeaturedHeroCard from './components/FeaturedHeroCard';
import SearchAndFilters from './components/SearchAndFilters';
import CarListingsSection from './components/CarListingsSection';
import Footer from './components/Footer';
import FloatingBottomDock from './components/FloatingBottomDock';

const CARS_DATA = [
  {
    id: 'audi-rs-etron-gt',
    title: 'Audi RS e-tron GT',
    rating: 4.9,
    year: 2024,
    category: 'Electric',
    location: 'New York',
    description: 'A breathtaking electric grand tourer with instant torque, sculpted lines, and a serene cabin.',
    price: '$142,900',
    badge: 'Certified pre-owned',
    viewersCount: 18,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY5-pp_NkGV_NuRu80g__8-IOlUCZYlLFgDbaN3joTZNWct00eKT6pV_0yi_KijMy5ZMaA-PVLgkWE5RtGe4S9-9KE7sJJWhzrkE8QyfedDiENNM-wI-RyGvbzzR4yYArpj0YhxeLO4iPQ1eXAb9Ovm6uojArkFUCI2DzDE_8mpNKJWWVqNZmSxCAmstybmnc6WDRrYkHHyOfgDlNhRUkSFzMqjPKsIqUqeEPX0FpUQqf2BrUtevHL'
  },
  {
    id: 'porsche-911-carrera',
    title: 'Porsche 911 Carrera',
    rating: 4.8,
    year: 2023,
    category: 'Sports',
    location: 'Los Angeles',
    description: "An iconic driver's car, refined for every day and engineered for the moments that matter.",
    price: '$128,500',
    badge: 'Certified pre-owned',
    viewersCount: 18,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClUTedEAlcXDRDGHDMXqi_iAKhN6Yfr9Kja2M-63jJB9zIEwW37gAYtFvZKoyl2kZRhBjpJQcCk9I4alK1lQoxIpwylGxVhiQdGayxEgqDReAqw4jAy-j-Z308HLPOXKaAmeKrQnRXkvA19Mnr-i63Ei2zkxOkYR2Y3t62NZP1JiJg2DMN8VbRb3T8DeXknboNVk2jW-Gh-LL93ATqDnX2l93_2hl1e1Hlnu1q7xn8eqZ-GpKp7gUw'
  },
  {
    id: 'range-rover-sport',
    title: 'Range Rover Sport',
    rating: 4.7,
    year: 2024,
    category: 'SUV',
    location: 'Miami',
    description: 'Commanding presence, all-terrain confidence, and an effortlessly elevated interior.',
    price: '$106,750',
    badge: 'Certified pre-owned',
    viewersCount: 18,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1Un_t_lbDV_y6fTIpvhwDGBOfnFI5KZNdhpGDOFv0QM0uPGd-4QavtIwnD1wzvlSXgiZrS22CbJeIGirAdwgPY40KndrEaZ3I0CYV_XOHoPWLZnMVs6EFdZB7dvM2Py6BKmD0ccIrTLNI9o8KNAgTPaxAAYEdBVq3fH-GJSXQ8WYCWTNM4BVBwQogFVNnNJD0kI5-1ZKco4QjvJGTWIZwdjBUfctJbdTPxKvuwuGPmVMWGM1MayO_'
  }
];

const FEATURED_CAR = {
  title: "Porsche 911 Carrera",
  price: "$128,500",
  description: "An iconic driver's car, refined for every day and engineered for the moments that matter. Selected for its performance, design, and presence.",
  imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuClUTedEAlcXDRDGHDMXqi_iAKhN6Yfr9Kja2M-63jJB9zIEwW37gAYtFvZKoyl2kZRhBjpJQcCk9I4alK1lQoxIpwylGxVhiQdGayxEgqDReAqw4jAy-j-Z308HLPOXKaAmeKrQnRXkvA19Mnr-i63Ei2zkxOkYR2Y3t62NZP1JiJg2DMN8VbRb3T8DeXknboNVk2jW-Gh-LL93ATqDnX2l93_2hl1e1Hlnu1q7xn8eqZ-GpKp7gUw"
};

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All cars');
  const [favorites, setFavorites] = useState(['porsche-911-carrera']);
  const [activeTab, setActiveTab] = useState('explore');

  const toggleFavorite = (carId) => {
    setFavorites((prev) =>
      prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
    );
  };

  const filteredCars = CARS_DATA.filter((car) => {
    const matchesCategory =
      selectedCategory === 'All cars' ||
      car.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`w-full max-w-[430px] min-h-screen flex flex-col relative pb-32 shadow-2xl transition-colors duration-300 ${
      darkMode 
        ? 'bg-slate-950 text-slate-100 border-x border-white/10 selection:bg-emerald-500 selection:text-white' 
        : 'bg-[#FBFBFC] text-slate-900 border-x border-gray-200 selection:bg-emerald-500 selection:text-white'
    }`}>
      {/* iOS Status Bar */}
      <StatusBar />

      {/* Brand Navigation Header */}
      <NavigationHeader
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />

      {/* Main App Content */}
      <main className="flex-1 px-4 space-y-6 pt-3" data-purpose="main-content">
        {/* Editorial Title & Metrics */}
        <HeroSection
          darkMode={darkMode}
          carCount={filteredCars.length}
          brandCount={24}
          averageRating={4.9}
        />

        {/* Top of the Collection Featured Hero */}
        <FeaturedHeroCard
          car={FEATURED_CAR}
          onExplore={(car) => alert(`Exploring ${car.title}`)}
        />

        {/* Search & Category Filter Pills */}
        <SearchAndFilters
          darkMode={darkMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Car Collection Listings */}
        <CarListingsSection
          darkMode={darkMode}
          cars={filteredCars}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onCompare={(car) => alert(`Added ${car.title} to comparison`)}
          onViewDetails={(car) => alert(`Viewing details for ${car.title}`)}
        />

        {/* Footer */}
        <Footer darkMode={darkMode} />
      </main>

      {/* Floating Dock Navigation */}
      <FloatingBottomDock
        darkMode={darkMode}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'concierge') {
            alert('Connecting to Veloce Luxury Concierge...');
          }
        }}
        savedCount={favorites.length}
      />
    </div>
  );
}
