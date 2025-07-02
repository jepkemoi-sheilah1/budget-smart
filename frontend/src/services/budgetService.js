import api from './api';

export const fetchBudget = async () => {
  const response = await api.get('/budgets');
  return response.data;
};

export const setBudget = async (budgetData) => {
  const response = await api.post('/budgets', budgetData);
  return response.data;
};

export const updateBudget = async (budgetId, budgetData) => {
  const response = await api.put('/budgets/' + budgetId, budgetData);
  return response.data;
};

export const deleteBudget = async (budgetId) => {
  const response = await api.delete('/budgets/' + budgetId);
  return response.data;
};
