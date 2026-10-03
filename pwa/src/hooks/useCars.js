import { useState, useEffect, useMemo } from 'react';
import { listCars } from '../services/api';

export function useCars(activeTab, favorites) {
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState('');
  const [inventoryRetryCount, setInventoryRetryCount] = useState(0);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All cars');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    let isCurrent = true;
    listCars()
      .then((inventory) => {
        if (isCurrent) {
          setCars(inventory);
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setCars([]);
          setInventoryError(error.message);
        }
      })
      .finally(() => {
        if (isCurrent) setCarsLoading(false);
      });
    return () => { isCurrent = false; };
  }, [inventoryRetryCount]);

  const retryFetch = () => {
    setCarsLoading(true);
    setInventoryError('');
    setInventoryRetryCount((count) => count + 1);
  };

  const filteredCars = useMemo(() => {
    const sourceCars = activeTab === 'saved' ? cars.filter((car) => favorites.includes(car.id)) : cars;
    const query = searchQuery.trim().toLowerCase();
    const matchingCars = sourceCars.filter((car) => {
      const matchesCategory = selectedCategory === 'All cars' || (car.category || '').toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = `${car.title || ''} ${car.location || ''} ${car.category || ''}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });

    return [...matchingCars].sort((first, second) => {
      if (sortBy === 'price-asc') return first.priceAmount - second.priceAmount;
      if (sortBy === 'price-desc') return second.priceAmount - first.priceAmount;
      return Number(Boolean(second.isFeatured)) - Number(Boolean(first.isFeatured));
    });
  }, [activeTab, cars, favorites, searchQuery, selectedCategory, sortBy]);

  return {
    cars,
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
  };
}
