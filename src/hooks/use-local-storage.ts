import { useCallback, useEffect, useState } from 'react';

/**
 * Options for useLocalStorage hook.
 */
export interface UseLocalStorageOptions<T> {
  /** Storage key prefix (default: 'agent-explorer') */
  prefix?: string;
  /** Custom serializer function */
  serializer?: (value: T) => string;
  /** Custom deserializer function */
  deserializer?: (value: string) => T;
}

/**
 * Return type for useLocalStorage hook.
 */
export interface UseLocalStorageResult<T> {
  /** Current stored value */
  value: T;
  /** Set a new value */
  setValue: (value: T | ((prev: T) => T)) => void;
  /** Remove the value from storage */
  remove: () => void;
  /** Check if value exists in storage */
  exists: boolean;
}

/**
 * Generic hook for localStorage persistence with type safety.
 *
 * Features:
 * - SSR-safe (returns initial value during SSR)
 * - Cross-tab synchronization via storage events
 * - Custom serialization support
 * - Automatic JSON serialization by default
 *
 * @param key - Storage key (will be prefixed)
 * @param initialValue - Default value when nothing is stored
 * @param options - Optional configuration
 *
 * @example
 * ```tsx
 * // Simple usage
 * const { value, setValue } = useLocalStorage('theme', 'dark');
 *
 * // With complex objects
 * const { value: bookmarks, setValue: setBookmarks } = useLocalStorage<string[]>(
 *   'bookmarks',
 *   [],
 * );
 *
 * // Add a bookmark
 * setBookmarks(prev => [...prev, 'agent-123']);
 *
 * // Remove
 * const { remove } = useLocalStorage('tempData', null);
 * remove();
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {},
): UseLocalStorageResult<T> {
  const {
    prefix = 'agent-explorer',
    serializer = JSON.stringify,
    deserializer = JSON.parse,
  } = options;

  const storageKey = `${prefix}-${key}`;

  // Initialize state with initialValue to prevent SSR hydration mismatch.
  // Actual localStorage value is loaded in useEffect after hydration.
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Track if value exists in storage (initialized after mount)
  const [exists, setExists] = useState<boolean>(false);

  // Set value in state and localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Use functional updater to ensure we get the latest state
        setStoredValue((prevValue) => {
          const valueToStore = value instanceof Function ? value(prevValue) : value;

          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, serializer(valueToStore));
            setExists(true);
          }

          return valueToStore;
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Failed to write localStorage key "${storageKey}":`, error);
        }
      }
    },
    [storageKey, serializer],
  );

  // Remove value from localStorage
  const remove = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(storageKey);
        setExists(false);
      }
      setStoredValue(initialValue);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Failed to remove localStorage key "${storageKey}":`, error);
      }
    }
  }, [storageKey, initialValue]);

  // Sync with other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== storageKey) {
        return;
      }

      if (event.newValue === null) {
        // Key was removed
        setStoredValue(initialValue);
        setExists(false);
      } else {
        try {
          setStoredValue(deserializer(event.newValue) as T);
          setExists(true);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Failed to parse storage event for "${storageKey}":`, error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey, initialValue, deserializer]);

  // Load localStorage value after mount to prevent SSR hydration mismatch.
  // Also re-sync when storageKey or deserializer changes.
  useEffect(() => {
    try {
      const item = localStorage.getItem(storageKey);
      if (item !== null) {
        setStoredValue(deserializer(item) as T);
        setExists(true);
      } else {
        // Key doesn't exist in storage - reset to initial value
        setStoredValue(initialValue);
        setExists(false);
      }
    } catch (error) {
      // Log in development to aid debugging of hydration/storage issues
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[useLocalStorage] Failed to load key "${storageKey}":`, error);
      }
      // Reset to initial value on error
      setStoredValue(initialValue);
      setExists(false);
    }
  }, [storageKey, deserializer, initialValue]);

  return {
    value: storedValue,
    setValue,
    remove,
    exists,
  };
}
