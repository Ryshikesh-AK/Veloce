import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useCars } from '../hooks/useCars';
import { SAVED_KEY, COMPARE_KEY, THEME_KEY } from '../constants';
import { useAuth } from './AuthContext';
import { createLeadApi } from '../services/api';
import PhoneLeadModal from '../components/common/PhoneLeadModal';
import storageService from '../services/storageService';

const CarContext = createContext(null);

export function CarProvider({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useLocalStorage(THEME_KEY, false);
  const [favorites, setFavorites] = useLocalStorage(SAVED_KEY, []);
  const [compareIds, setCompareIds] = useLocalStorage(COMPARE_KEY, []);

  const clearUserData = () => {
    setFavorites([]);
    setCompareIds([]);
    setSelectedCar(null);
    if (setSearchQuery) setSearchQuery('');
    if (setSelectedCategory) setSelectedCategory('All cars');
    if (setSortBy) setSortBy('featured');
    storageService.removeGuestUser();
    storageService.removeItem(SAVED_KEY);
    storageService.removeItem(COMPARE_KEY);
  };

  useEffect(() => {
    const handleAppReset = () => {
      clearUserData();
      localStorage.removeItem('DriveXCars-admin-customer-leads');
    };
    window.addEventListener('app:logout', handleAppReset);
    window.addEventListener('app:login', handleAppReset);
    return () => {
      window.removeEventListener('app:logout', handleAppReset);
      window.removeEventListener('app:login', handleAppReset);
    };
  }, []);

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

  const [selectedCar, setSelectedCar] = useState(null);
  const [toast, setToastState] = useState('');

  // Lead modal state for guest users
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [targetCarForLead, setTargetCarForLead] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      document.startViewTransition(() => {
        setDarkMode((prev) => !prev);
      });
    } else {
      setDarkMode((prev) => !prev);
    }
  };

  const setToast = (val) => {
    if (!val) {
      setToastState('');
      return;
    }
    if (typeof val === 'object' && val.message) {
      setToastState(val.message);
    } else if (typeof val === 'string') {
      setToastState(val);
    } else {
      setToastState(String(val));
    }
  };

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToastState(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const toggleFavorite = async (carId) => {
    const wasSaved = favorites.includes(carId);

    if (wasSaved) {
      setFavorites((prev) => prev.filter((id) => id !== carId));
      setToast('Removed from saved cars');
      return;
    }

    // Saving car to wishlist:
    const targetCar = cars.find((c) => String(c.id) === String(carId)) || { id: carId, title: carId };

    if (user) {
      // Logged in user: Post lead in background and save favorite
      setFavorites((prev) => [...prev, carId]);
      setToast('Saved for later');
      try {
        await createLeadApi(
          {
            name: user.name || 'User',
            phone: user.phone || 'N/A',
            email: user.email,
            car_id: isNaN(Number(carId)) ? null : Number(carId),
            action_type: 'wishlist',
            notes: `Wishlisted ${targetCar.title || targetCar.name || carId}`,
          },
          user.token
        );
      } catch (err) {
        console.warn('Could not record lead:', err);
      }
    } else {
      // Guest user: Check if guest info already exists in localStorage via storageService
      const savedGuest = storageService.getGuestUser();

      if (savedGuest?.phone) {
        // Already entered mobile number before! Reuse it directly
        setFavorites((prev) => [...prev, carId]);
        setToast(`Saved to wishlist!`);
        try {
          await createLeadApi(
            {
              name: savedGuest.name || 'Guest User',
              phone: savedGuest.phone,
              car_id: isNaN(Number(carId)) ? null : Number(carId),
              action_type: 'wishlist',
              notes: `Wishlisted ${targetCar.title || targetCar.name || carId} as guest user`,
            }
          );
        } catch (err) {
          console.warn('Could not record lead:', err);
        }
      } else {
        // Guest user entering mobile number for the first time: Prompt modal
        setTargetCarForLead(targetCar);
        setLeadModalOpen(true);
      }
    }
  };

  const handleGuestLeadSuccess = (leadData) => {
    if (leadData) {
      storageService.setGuestUser(leadData);
    }
    if (targetCarForLead?.id) {
      const carId = targetCarForLead.id;
      if (!favorites.includes(carId)) {
        setFavorites((prev) => [...prev, carId]);
      }
      setToast(`Saved to wishlist! Thanks ${leadData.name}.`);
    }
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
    toggleDarkMode,
    favorites,
    toggleFavorite,
    compareIds,
    toggleCompare,
    clearUserData,
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
    selectedCar,
    setSelectedCar,
    openCarDetails,
    toast,
    setToast
  };

  return (
    <CarContext.Provider value={value}>
      {children}
      <PhoneLeadModal
        isOpen={leadModalOpen}
        onClose={() => setLeadModalOpen(false)}
        car={targetCarForLead}
        onSuccess={handleGuestLeadSuccess}
        userToken={user?.token}
      />
    </CarContext.Provider>
  );
}

export function useCarContext() {
  const context = useContext(CarContext);
  if (!context) {
    throw new Error('useCarContext must be used within a CarProvider');
  }
  return context;
}
