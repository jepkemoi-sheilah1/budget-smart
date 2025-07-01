import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};
