import api from './api';

export const searchRecipes = async (ingredients, filters = {}) => {
  const { data } = await api.get('/recipes/search', {
    params: { ingredients: ingredients.join(','), ...filters },
  });
  return data;
};

export const getRecipeById = async (id) => {
  const { data } = await api.get(`/recipes/${id}`);
  return data;
};

export const searchIngredients = async (query) => {
  const { data } = await api.get('/ingredients/search', {
    params: { q: query },
  });
  return data;
};

export const getAllIngredients = async (category) => {
  const { data } = await api.get('/ingredients', {
    params: category ? { category } : {},
  });
  return data;
};