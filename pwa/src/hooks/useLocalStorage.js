import { useState, useEffect } from 'react';
import storageService from '../services/storageService';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    return storageService.getItem(key, initialValue);
  });

  useEffect(() => {
    storageService.setItem(key, storedValue);
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
