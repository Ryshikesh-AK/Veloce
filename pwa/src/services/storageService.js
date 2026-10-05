/**
 * Unified Storage Service for handling localStorage operations safely.
 */

const STORAGE_KEYS = {
  GUEST_USER: 'guest_user_info',
  FAVORITES: 'drivexcars_saved_v2',
  COMPARE: 'drivexcars_compare_v2',
  THEME: 'drivexcars_theme_v2',
  AUTH_TOKEN: 'drivexcars_token_v2',
};

export const storageService = {
  /**
   * Generic getItem with safe JSON parsing and fallback.
   */
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Generic setItem with automatic JSON serialization.
   */
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  },

  /**
   * Generic removeItem.
   */
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  },

  /**
   * Clear all localStorage items.
   */
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
  },

  /* ---------------- Dedicated Helpers ---------------- */

  // Guest User
  getGuestUser: () => storageService.getItem(STORAGE_KEYS.GUEST_USER, null),
  setGuestUser: (userData) => storageService.setItem(STORAGE_KEYS.GUEST_USER, userData),
  removeGuestUser: () => storageService.removeItem(STORAGE_KEYS.GUEST_USER),

  // Favorites
  getFavorites: () => storageService.getItem(STORAGE_KEYS.FAVORITES, []),
  setFavorites: (favoritesList) => storageService.setItem(STORAGE_KEYS.FAVORITES, favoritesList),

  // Compare List
  getCompareIds: () => storageService.getItem(STORAGE_KEYS.COMPARE, []),
  setCompareIds: (compareList) => storageService.setItem(STORAGE_KEYS.COMPARE, compareList),

  // Theme
  getTheme: () => storageService.getItem(STORAGE_KEYS.THEME, null),
  setTheme: (theme) => storageService.setItem(STORAGE_KEYS.THEME, theme),
};

export default storageService;
