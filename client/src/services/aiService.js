import api from './api';

export const generateRecipe = async (payload) => {
  const { data } = await api.post('/ai/generate', payload);
  return data;
};

export const sendChatMessage = async (message, history = []) => {
  const { data } = await api.post('/ai/chat', { message, history });
  return data;
};

export const suggestRecipes = async (ingredients) => {
  const { data } = await api.post('/ai/suggest', { ingredients });
  return data;
};