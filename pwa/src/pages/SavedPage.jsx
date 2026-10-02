import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchAndFilters from '../components/cars/SearchAndFilters';
import CarListingsSection from '../components/cars/CarListingsSection';
import Footer from '../components/layout/Footer';
import { useCarContext } from '../context/CarContext';

export default function SavedPage() {
  const navigate = useNavigate();
  const {
    darkMode,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    cars,
    favorites,
    compareIds,
    toggleFavorite,
    toggleCompare,
    openCarDetails
  } = useCarContext();

  const savedCars = cars.filter((car) => favorites.includes(car.id));

  return (
    <>
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
        cars={savedCars}
        favorites={favorites}
        compareIds={compareIds}
        isSavedView={true}
        onToggleFavorite={toggleFavorite}
        onCompare={(car) => toggleCompare(car.id)}
        onViewDetails={openCarDetails}
        onBrowse={() => navigate('/')}
      />
      <Footer darkMode={darkMode} />
    </>
  );
}
