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
    rating: 4.9,
    year: 2024,
    category: 'Electric',
    location: 'New York',
    description: 'A breathtaking electric grand tourer with instant torque, sculpted lines, and a serene cabin.',
    price: '$142,900',
    priceAmount: 142900,
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
    priceAmount: 128500,
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
    priceAmount: 106750,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1Un_t_lbDV_y6fTIpvhwDGBOfnFI5KZNdhpGDOFv0QM0uPGd-4QavtIwnD1wzvlSXgiZrS22CbJeIGirAdwgPY40KndrEaZ3I0CYV_XOHoPWLZnMVs6EFdZB7dvM2Py6BKmD0ccIrTLNI9o8KNAgTPaxAAYEdBVq3fH-GJSXQ8WYCWTNM4BVBwQogFVNnNJD0kI5-1ZKco4QjvJGTWIZwdjBUfctJbdTPxKvuwuGPmVMWGM1MayO_'
  }
];
