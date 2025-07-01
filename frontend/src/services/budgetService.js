import api from './api';

export const fetchBudget = async () => {
  const response = await api.get('/budget');
  return response.data;
};

export const setBudget = async (budgetData) => {
  const response = await api.post('/budget', budgetData);
  return response.data;
};

export const updateBudget = async (budgetId, budgetData) => {
  const response = await api.put('/budget/' + budgetId, budgetData);
  return response.data;
};

export const deleteBudget = async (budgetId) => {
  const response = await api.delete('/budget/' + budgetId);
  return response.data;
};
