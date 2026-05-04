import api from './api';

export const signup = async (name, email, password) => {
  const { data } = await api.post('/auth/signup', { name, email, password });
  return data;
};

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const guestLogin = async () => {
  const { data } = await api.post('/auth/guest');
  return data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};