import { useState, useEffect } from 'react';
import { searchItems } from '../services/mockApi';
import { Item } from '../types';

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setIsLoading(true);
    setError(null);

    const delayDebounceFn = setTimeout(async () => {
      try {
        const data = await searchItems(query);
        if (active) {
          setResults(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
          setIsLoading(false);
        }
      }
    }, 300); // 300ms Debounce delay

    return () => {
      active = false;
      clearTimeout(delayDebounceFn);
    };
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
  };
};
