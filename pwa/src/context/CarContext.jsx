import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCars } from '../hooks/useCars';
import { useTestDrives } from '../hooks/useTestDrives';
import { SAVED_KEY, COMPARE_KEY, THEME_KEY } from '../constants';

const CarContext = createContext(null);

export function CarProvider({ children }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useLocalStorage(THEME_KEY, true);
  const [favorites, setFavorites] = useLocalStorage(SAVED_KEY, ['porsche-911-carrera']);
  const [compareIds, setCompareIds] = useLocalStorage(COMPARE_KEY, []);

  const {
    cars,
    setCars,
    filteredCars,
    carsLoading,
    inventoryError,
    retryFetch,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy
  } = useCars('explore', favorites);

  const {
    customerEmail,
    testDriveCar,
    testDrives,
    testDriveError,
    findTestDrives,
    submitTestDrive,
    requestDriveForCar,
    cancelDriveRequest
  } = useTestDrives(() => {});

  const [selectedCar, setSelectedCar] = useState(null);
  const [toast, setToast] = useState('');

  // Toast timer auto-dismiss
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const toggleFavorite = (carId) => {
    const wasSaved = favorites.includes(carId);
    setFavorites((previous) => (wasSaved ? previous.filter((id) => id !== carId) : [...previous, carId]));
    setToast(wasSaved ? 'Removed from saved cars' : 'Saved for later');
  };

  const toggleCompare = (carId) => {
    if (compareIds.includes(carId)) {
      setCompareIds((previous) => previous.filter((id) => id !== carId));
      setToast('Removed from compare');
      return;
    }
    if (compareIds.length >= 3) {
      setToast('Compare up to 3 cars at a time');
      return;
    }
    setCompareIds((previous) => [...previous, carId]);
    setToast('Added to compare');
  };

  const openCarDetails = (car) => {
    setSelectedCar(car);
    cancelDriveRequest();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/car/${car.id}`);
  };

  const addCar = (newCarData) => {
    const id = newCarData.title ? newCarData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'car-' + Date.now();
    const newCar = {
      id,
      status: 'available',
      isFeatured: false,
      ...newCarData,
    };
    if (setCars) {
      setCars((prev) => [newCar, ...prev]);
    }
    setToast('New vehicle added to inventory');
  };

  const updateCar = (id, updatedFields) => {
    if (setCars) {
      setCars((prev) => prev.map((car) => (car.id === id ? { ...car, ...updatedFields } : car)));
    }
    setToast('Vehicle details updated');
  };

  const deleteCar = (id) => {
    if (setCars) {
      setCars((prev) => prev.filter((car) => car.id !== id));
    }
    setToast('Vehicle removed from inventory');
  };

  const toggleCarStatus = (id, newStatus) => {
    if (setCars) {
      setCars((prev) =>
        prev.map((car) => (car.id === id ? { ...car, status: newStatus || (car.status === 'available' ? 'reserved' : 'available') } : car))
      );
    }
    setToast(`Vehicle status updated to ${newStatus}`);
  };

  const value = {
    darkMode,
    setDarkMode,
    toggleDarkMode: () => setDarkMode((prev) => !prev),
    favorites,
    toggleFavorite,
    compareIds,
    toggleCompare,
    customerEmail,
    cars,
    setCars,
    addCar,
    updateCar,
    deleteCar,
    toggleCarStatus,
    filteredCars,
    carsLoading,
    inventoryError,
    retryFetch,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    testDriveCar,
    testDrives,
    testDriveError,
    findTestDrives,
    submitTestDrive: (details) => submitTestDrive(details, setToast),
    requestDriveForCar,
    cancelDriveRequest,
    selectedCar,
    setSelectedCar,
    openCarDetails,
    toast,
    setToast
  };

  return <CarContext.Provider value={value}>{children}</CarContext.Provider>;
}

export function useCarContext() {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
}
