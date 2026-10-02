import React, { useEffect, useMemo, useState } from 'react';
import NavigationHeader from './components/NavigationHeader';
import HeroSection from './components/HeroSection';
import SearchAndFilters from './components/SearchAndFilters';
import CarListingsSection from './components/CarListingsSection';
import {
  CarDetailsScreen,
  CompareScreen,
  ConciergeScreen,
  TestDriveRequestScreen,
  TestDrivesScreen
} from './components/MobileScreens';
import Footer from './components/Footer';
import FloatingBottomDock from './components/FloatingBottomDock';
import { createTestDrive, listCars, listMyTestDrives } from './shared/api';

const SAVED_KEY = 'veloce-pwa-saved-cars';
const COMPARE_KEY = 'veloce-pwa-compare-cars';
const EMAIL_KEY = 'veloce-test-drive-email';
const PATH_TO_TAB = {
  '/wishlist': 'saved',
  '/compare': 'compare',
  '/test-drives': 'test-drive',
  '/contact': 'concierge'
};
const TAB_TO_PATH = {
  explore: '/',
  saved: '/wishlist',
  compare: '/compare',
  'test-drive': '/test-drives',
  concierge: '/contact'
};

function readList(key, fallback = []) {
  try {
    const saved = JSON.parse(localStorage.getItem(key) || 'null');
    return Array.isArray(saved) ? saved : fallback;
  } catch {
    return fallback;
  }
}

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
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY5-pp_NkGV_NuRu80g__8-IOlUCZYlLFgDbaN3joTZNWct00eKT6pV_0yi_KijMy5ZMaA-PVLgkWE5RtGe4S9-9KE7sJJWhzrkE8QyfedDiENNM-wI-RyGvbzzR4yYArpj0YhxeLO4iPQ1eXAb9Ovm6uojArkFUCI2DzDE_8mpNKJWWVqNZmSxCAmstybmnc6WDRrYkHHyOfgDlNhRUkSFzMqjPKsIqUqeEPX0FpUQqf2BrUtevHL'
  },
  {
    id: 'porsche-911-carrera',
    title: 'Porsche 911 Carrera',
    rating: 4.8,
    isFeatured: true,
    year: 2023,
    category: 'Sports',
    location: 'Los Angeles',
    description: "An iconic driver's car, refined for every day and engineered for the moments that matter.",
    price: '$128,500',
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
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1Un_t_lbDV_y6fTIpvhwDGBOfnFI5KZNdhpGDOFv0QM0uPGd-4QavtIwnD1wzvlSXgiZrS22CbJeIGirAdwgPY40KndrEaZ3I0CYV_XOHoPWLZnMVs6EFdZB7dvM2Py6BKmD0ccIrTLNI9o8KNAgTPaxAAYEdBVq3fH-GJSXQ8WYCWTNM4BVBwQogFVNnNJD0kI5-1ZKco4QjvJGTWIZwdjBUfctJbdTPxKvuwuGPmVMWGM1MayO_'
  }
];

export default function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('veloce-pwa-theme') !== 'light');
  const [cars, setCars] = useState([]);
  const [inventoryError, setInventoryError] = useState('');
  const [carsLoading, setCarsLoading] = useState(true);
  const [inventoryRetryCount, setInventoryRetryCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All cars');
  const [sortBy, setSortBy] = useState('featured');
  const [favorites, setFavorites] = useState(() => readList(SAVED_KEY, ['porsche-911-carrera']));
  const [compareIds, setCompareIds] = useState(() => readList(COMPARE_KEY));
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [selectedCar, setSelectedCar] = useState(null);
  const [testDriveCar, setTestDriveCar] = useState(null);
  const [customerEmail, setCustomerEmail] = useState(() => localStorage.getItem(EMAIL_KEY) || '');
  const [testDrives, setTestDrives] = useState([]);
  const [testDriveError, setTestDriveError] = useState('');
  const [toast, setToast] = useState('');
  const activeTab = PATH_TO_TAB[currentPath] || 'explore';

  useEffect(() => {
    let isCurrent = true;
    listCars()
      .then((inventory) => {
        if (isCurrent) {
          setCars(inventory);
          const sampleTitles = new Map(CARS_DATA.map((car) => [car.id, car.title.toLowerCase()]));
          setFavorites((previous) => previous.map((id) => {
            if (inventory.some((car) => car.id === id)) return id;
            const sampleTitle = sampleTitles.get(id);
            return sampleTitle ? inventory.find((car) => car.title.toLowerCase() === sampleTitle)?.id ?? id : id;
          }));
        }
      })
      .catch((error) => {
        if (isCurrent) setInventoryError(error.message);
      })
      .finally(() => {
        if (isCurrent) setCarsLoading(false);
      });
    return () => { isCurrent = false; };
  }, [inventoryRetryCount]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSelectedCar(null);
      setTestDriveCar(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!customerEmail) return;
    listMyTestDrives(customerEmail)
      .then(setTestDrives)
      .catch((error) => setTestDriveError(error.message));
  }, [customerEmail]);

  useEffect(() => {
    localStorage.setItem(SAVED_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compareIds));
  }, [compareIds]);

  useEffect(() => {
    localStorage.setItem('veloce-pwa-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const navigateTo = (tab) => {
    const path = TAB_TO_PATH[tab] || TAB_TO_PATH.explore;
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setCurrentPath(path);
    setSelectedCar(null);
    setTestDriveCar(null);
    if (tab === 'explore' || tab === 'saved') {
      setSearchQuery('');
      setSelectedCategory('All cars');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (carId) => {
    const wasSaved = favorites.includes(carId);
    setFavorites((previous) => wasSaved ? previous.filter((id) => id !== carId) : [...previous, carId]);
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

  const filteredCars = useMemo(() => {
    const sourceCars = activeTab === 'saved' ? cars.filter((car) => favorites.includes(car.id)) : cars;
    const query = searchQuery.trim().toLowerCase();
    const matchingCars = sourceCars.filter((car) => {
      const matchesCategory = selectedCategory === 'All cars' || car.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = `${car.title} ${car.location || ''} ${car.category}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
    return [...matchingCars].sort((first, second) => {
      if (sortBy === 'price-asc') return first.priceAmount - second.priceAmount;
      if (sortBy === 'price-desc') return second.priceAmount - first.priceAmount;
      return Number(Boolean(second.isFeatured)) - Number(Boolean(first.isFeatured));
    });
  }, [activeTab, cars, favorites, searchQuery, selectedCategory, sortBy]);

  const compareCars = cars.filter((car) => compareIds.includes(car.id));

  const findTestDrives = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    setCustomerEmail(normalizedEmail);
    localStorage.setItem(EMAIL_KEY, normalizedEmail);
    setTestDriveError('');
    try {
      setTestDrives(await listMyTestDrives(normalizedEmail));
    } catch (error) {
      setTestDriveError(error.message);
    }
  };

  const submitTestDrive = async (details) => {
    setTestDriveError('');
    try {
      const request = await createTestDrive({
        carId: details.carId,
        customerName: details.customerName,
        customerEmail: details.customerEmail,
        customerPhone: details.customerPhone || null,
        preferredAt: details.preferredAt
      });
      const email = details.customerEmail.trim().toLowerCase();
      setCustomerEmail(email);
      localStorage.setItem(EMAIL_KEY, email);
      setTestDrives((previous) => [request, ...previous.filter((item) => item.id !== request.id)]);
      setTestDriveCar(null);
      setToast('Your request was sent to the showroom');
      navigateTo('test-drive');
    } catch (error) {
      setTestDriveError(error.message);
    }
  };

  const openCar = (car) => {
    setSelectedCar(car);
    setTestDriveCar(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div data-theme={darkMode ? 'dark' : 'light'} className={`pwa-shell w-full min-h-screen flex flex-col relative pb-32 transition-colors duration-300 ${
      darkMode 
        ? 'bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950'
        : 'bg-[#FBFBFC] text-slate-900 selection:bg-emerald-500 selection:text-slate-950'
    }`}>
      {/* Brand Navigation Header */}
      <NavigationHeader
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        activeTab={activeTab}
        savedCount={favorites.length}
        compareCount={compareIds.length}
        onNavigate={navigateTo}
      />

      {/* Main App Content */}
      <main className="pwa-main flex-1 space-y-4 pt-3" data-purpose="main-content">
        {inventoryError && <div className="pwa-inventory-error rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs leading-5 text-amber-100" role="status"><span>{inventoryError}</span><button type="button" onClick={() => { setCarsLoading(true); setInventoryError(''); setInventoryRetryCount((count) => count + 1); }}>Retry</button></div>}
        {carsLoading && <div className="text-xs text-slate-400" role="status">Loading Veloce inventory…</div>}

        {testDriveCar ? (
          <TestDriveRequestScreen
            car={testDriveCar}
            defaultEmail={customerEmail}
            error={testDriveError}
            onCancel={() => { setTestDriveCar(null); setTestDriveError(''); }}
            onSubmit={submitTestDrive}
          />
        ) : selectedCar ? (
          <CarDetailsScreen
            car={selectedCar}
            isFavorite={favorites.includes(selectedCar.id)}
            isCompared={compareIds.includes(selectedCar.id)}
            onBack={() => setSelectedCar(null)}
            onFavorite={() => toggleFavorite(selectedCar.id)}
            onCompare={() => toggleCompare(selectedCar.id)}
            onRequestDrive={() => { setTestDriveError(''); setTestDriveCar(selectedCar); }}
          />
        ) : activeTab === 'compare' ? (
          <CompareScreen cars={compareCars} onRemove={toggleCompare} onBrowse={() => navigateTo('explore')} />
        ) : activeTab === 'test-drive' ? (
          <TestDrivesScreen requests={testDrives} email={customerEmail} error={testDriveError} onFind={findTestDrives} onBrowse={() => navigateTo('explore')} />
        ) : activeTab === 'concierge' ? (
          <ConciergeScreen onBrowse={() => navigateTo('explore')} />
        ) : (
          <>
            {activeTab === 'explore' && <HeroSection darkMode={darkMode} />}
            <SearchAndFilters darkMode={darkMode} searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} sortBy={sortBy} onSortChange={setSortBy} />
            <CarListingsSection
              darkMode={darkMode}
              cars={filteredCars}
              favorites={favorites}
              compareIds={compareIds}
              isSavedView={activeTab === 'saved'}
              onToggleFavorite={toggleFavorite}
              onCompare={(car) => toggleCompare(car.id)}
              onViewDetails={openCar}
              onBrowse={() => navigateTo('explore')}
            />
            <Footer darkMode={darkMode} />
          </>
        )}
      </main>

      {/* Floating Dock Navigation */}
      <FloatingBottomDock
        darkMode={darkMode}
        activeTab={activeTab}
        savedCount={favorites.length}
        compareCount={compareIds.length}
        onNavigate={navigateTo}
      />
      {toast && <div className="pwa-toast" role="status">{toast}</div>}
    </div>
  );
}
