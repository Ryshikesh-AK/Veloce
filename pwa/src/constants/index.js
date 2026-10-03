export const SAVED_KEY = 'DriveXCars-pwa-saved-cars';
export const COMPARE_KEY = 'DriveXCars-pwa-compare-cars';
export const EMAIL_KEY = 'DriveXCars-test-drive-email';
export const THEME_KEY = 'DriveXCars-pwa-theme';

export const PATH_TO_TAB = {
  '/': 'explore',
  '/wishlist': 'saved',
  '/compare': 'compare',
  '/contact': 'contact'
};

export const TAB_TO_PATH = {
  explore: '/',
  saved: '/wishlist',
  compare: '/compare',
  contact: '/contact'
};

export const SAMPLE_CARS = [
  {
    id: 'audi-rs-etron-gt',
    title: 'Audi RS e-tron GT',
    brand: 'Audi',
    model: 'RS e-tron GT',
    rating: 4.9,
    year: 2024,
    category: 'Electric',
    location: 'New York',
    description: 'A breathtaking electric grand tourer with instant torque, sculpted lines, and a serene cabin.',
    price: '$142,900',
    priceAmount: 142900,
    status: 'available',
    isFeatured: true,
    horsepower: '637 hp',
    topSpeed: '155 mph',
    acceleration: '3.1s',
    transmission: '2-Speed Automatic',
    drivetrain: 'AWD',
    fuel: 'Electric',
    fuelType: 'Electric',
    mileage: 1200,
    keyFeatures: ['800V Architecture', 'Bang & Olufsen Sound', 'Carbon Fiber Roof', 'Adaptive Air Suspension'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBY5-pp_NkGV_NuRu80g__8-IOlUCZYlLFgDbaN3joTZNWct00eKT6pV_0yi_KijMy5ZMaA-PVLgkWE5RtGe4S9-9KE7sJJWhzrkE8QyfedDiENNM-wI-RyGvbzzR4yYArpj0YhxeLO4iPQ1eXAb9Ovm6uojArkFUCI2DzDE_8mpNKJWWVqNZmSxCAmstybmnc6WDRrYkHHyOfgDlNhRUkSFzMqjPKsIqUqeEPX0FpUQqf2BrUtevHL',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBY5-pp_NkGV_NuRu80g__8-IOlUCZYlLFgDbaN3joTZNWct00eKT6pV_0yi_KijMy5ZMaA-PVLgkWE5RtGe4S9-9KE7sJJWhzrkE8QyfedDiENNM-wI-RyGvbzzR4yYArpj0YhxeLO4iPQ1eXAb9Ovm6uojArkFUCI2DzDE_8mpNKJWWVqNZmSxCAmstybmnc6WDRrYkHHyOfgDlNhRUkSFzMqjPKsIqUqeEPX0FpUQqf2BrUtevHL',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'porsche-911-carrera',
    title: 'Porsche 911 Carrera',
    brand: 'Porsche',
    model: '911 Carrera',
    rating: 4.8,
    isFeatured: true,
    year: 2023,
    category: 'Sports',
    location: 'Los Angeles',
    description: "An iconic driver's car, refined for every day and engineered for the moments that matter.",
    price: '$128,500',
    priceAmount: 128500,
    status: 'available',
    horsepower: '379 hp',
    topSpeed: '182 mph',
    acceleration: '4.0s',
    transmission: '8-Speed PDK Dual-Clutch',
    drivetrain: 'RWD',
    fuel: 'Gasoline',
    fuelType: 'Gasoline',
    mileage: 4500,
    keyFeatures: ['Sport Chrono Package', 'PASM Suspension', 'Leather Interior', 'Porsche Dynamic Light System'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClUTedEAlcXDRDGHDMXqi_iAKhN6Yfr9Kja2M-63jJB9zIEwW37gAYtFvZKoyl2kZRhBjpJQcCk9I4alK1lQoxIpwylGxVhiQdGayxEgqDReAqw4jAy-j-Z308HLPOXKaAmeKrQnRXkvA19Mnr-i63Ei2zkxOkYR2Y3t62NZP1JiJg2DMN8VbRb3T8DeXknboNVk2jW-Gh-LL93ATqDnX2l93_2hl1e1Hlnu1q7xn8eqZ-GpKp7gUw',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuClUTedEAlcXDRDGHDMXqi_iAKhN6Yfr9Kja2M-63jJB9zIEwW37gAYtFvZKoyl2kZRhBjpJQcCk9I4alK1lQoxIpwylGxVhiQdGayxEgqDReAqw4jAy-j-Z308HLPOXKaAmeKrQnRXkvA19Mnr-i63Ei2zkxOkYR2Y3t62NZP1JiJg2DMN8VbRb3T8DeXknboNVk2jW-Gh-LL93ATqDnX2l93_2hl1e1Hlnu1q7xn8eqZ-GpKp7gUw',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 'range-rover-sport',
    title: 'Range Rover Sport',
    brand: 'Land Rover',
    model: 'Range Rover Sport',
    rating: 4.7,
    year: 2024,
    category: 'SUV',
    location: 'Miami',
    description: 'Commanding presence, all-terrain confidence, and an effortlessly elevated interior.',
    price: '$106,750',
    priceAmount: 106750,
    status: 'available',
    isFeatured: false,
    horsepower: '395 hp',
    topSpeed: '150 mph',
    acceleration: '5.4s',
    transmission: '8-Speed Automatic',
    drivetrain: 'AWD',
    fuel: 'Hybrid',
    fuelType: 'Hybrid',
    mileage: 2800,
    keyFeatures: ['Dynamic Air Suspension', 'Meridian Sound System', 'Panoramic Roof', 'All-Terrain Progress Control'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1Un_t_lbDV_y6fTIpvhwDGBOfnFI5KZNdhpGDOFv0QM0uPGd-4QavtIwnD1wzvlSXgiZrS22CbJeIGirAdwgPY40KndrEaZ3I0CYV_XOHoPWLZnMVs6EFdZB7dvM2Py6BKmD0ccIrTLNI9o8KNAgTPaxAAYEdBVq3fH-GJSXQ8WYCWTNM4BVBwQogFVNnNJD0kI5-1ZKco4QjvJGTWIZwdjBUfctJbdTPxKvuwuGPmVMWGM1MayO_',
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB1Un_t_lbDV_y6fTIpvhwDGBOfnFI5KZNdhpGDOFv0QM0uPGd-4QavtIwnD1wzvlSXgiZrS22CbJeIGirAdwgPY40KndrEaZ3I0CYV_XOHoPWLZnMVs6EFdZB7dvM2Py6BKmD0ccIrTLNI9o8KNAgTPaxAAYEdBVq3fH-GJSXQ8WYCWTNM4BVBwQogFVNnNJD0kI5-1ZKco4QjvJGTWIZwdjBUfctJbdTPxKvuwuGPmVMWGM1MayO_',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
    ]
  }
];
