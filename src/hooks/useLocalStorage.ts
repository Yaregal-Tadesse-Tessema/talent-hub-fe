import { useState, useEffect, useCallback } from 'react';

// Cache for localStorage values to reduce redundant reads
const localStorageCache = new Map<string, any>();

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get initial value from cache or localStorage
  const getStoredValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    // Check cache first
    if (localStorageCache.has(key)) {
      return localStorageCache.get(key);
    }

    try {
      const item = window.localStorage.getItem(key);
      const value = item ? JSON.parse(item) : initialValue;

      // Cache the value
      localStorageCache.set(key, value);
      return value;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          // Update cache
          localStorageCache.set(key, valueToStore);
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  // Remove value from localStorage and cache
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        localStorageCache.delete(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Update stored value when key changes
  useEffect(() => {
    setStoredValue(getStoredValue());
  }, [key, getStoredValue]);

  return [storedValue, setValue, removeValue] as const;
}

// Utility function to clear all cached values
export const clearLocalStorageCache = () => {
  localStorageCache.clear();
};

// Utility function to get cached value without hook
export const getCachedLocalStorage = (key: string) => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (localStorageCache.has(key)) {
    return localStorageCache.get(key);
  }

  try {
    const item = window.localStorage.getItem(key);
    const value = item ? JSON.parse(item) : null;
    localStorageCache.set(key, value);
    return value;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return null;
  }
};
