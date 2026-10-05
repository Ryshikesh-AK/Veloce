import React from 'react';
import HeroSection from '../components/cars/HeroSection';
import SearchAndFilters from '../components/cars/SearchAndFilters';
import CarListingsSection from '../components/cars/CarListingsSection';
import Footer from '../components/layout/Footer';
import { useCarContext } from '../context/CarContext';

export default function ExplorePage() {
  const {
    darkMode,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    cars,
    filteredCars,
    inventoryError,
    favorites,
    compareIds,
    toggleFavorite,
    toggleCompare,
    openCarDetails
  } = useCarContext();

  return (
    <>
      <HeroSection darkMode={darkMode} />
      <SearchAndFilters
        darkMode={darkMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
      <CarListingsSection
        darkMode={darkMode}
        cars={filteredCars}
        inventoryCount={cars.length}
        inventoryError={inventoryError}
        favorites={favorites}
        compareIds={compareIds}
        isSavedView={false}
        onToggleFavorite={toggleFavorite}
        onCompare={(car) => toggleCompare(car.id)}
        onViewDetails={openCarDetails}
      />
      <Footer darkMode={darkMode} />
    </>
  );
}
