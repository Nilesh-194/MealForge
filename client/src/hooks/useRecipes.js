import { useState, useCallback } from 'react';
import { searchRecipes } from '../services/recipeService';

export function useRecipes() {
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [searched, setSearched] = useState(false);
  const [count, setCount]       = useState(0);

  const findRecipes = useCallback(async (ingredients, filters = {}) => {
    if (!ingredients.length) return;
    setLoading(true);
    setError(null);
    try {
      const data = await searchRecipes(ingredients, filters);
      setResults(data.results);
      setCount(data.count);
      setSearched(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not fetch recipes.');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = () => {
    setResults([]);
    setSearched(false);
    setError(null);
    setCount(0);
  };

  return { results, loading, error, searched, count, findRecipes, reset };
}