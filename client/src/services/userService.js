import api from './api';

export const getProfile = async () => {
  const { data } = await api.get('/users/profile');
  return data;
};

export const getSavedRecipes = async () => {
  const { data } = await api.get('/users/saved');
  return data;
};

export const toggleSaveRecipe = async (recipeId) => {
  const { data } = await api.post(`/users/saved/${recipeId}`);
  return data;
};

export const getHistory = async () => {
  const { data } = await api.get('/users/history');
  return data;
};

export const deleteHistoryItem = async (id) => {
  await api.delete(`/users/history/${id}`);
};

export const clearHistory = async () => {
  await api.delete('/users/history');
};

export const getPantry = async () => {
  const { data } = await api.get('/users/pantry');
  return data;
};

export const updatePantry = async (ingredients) => {
  const { data } = await api.put('/users/pantry', { ingredients });
  return data;
};

export const updateProfile = async (name) => {
  const { data } = await api.put('/users/profile', { name });
  return data;
};