import api from './api';

export const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};

export const updateUser = async (userData) => {
  const response = await api.put('/users/me', userData);
  return response.data;
};

export const deleteUser = async () => {
  const response = await api.delete('/users/me');
  return response.data;
};