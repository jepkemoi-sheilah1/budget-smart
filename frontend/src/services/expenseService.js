import api from './api';

export const fetchExpenses = async () => {
  const response = await api.get('/expenses');
  return response.data;
};

export const createExpense = async (expenseData) => {
  console.log("Sending POST request to create expense:", expenseData);
  try {
    const response = await api.post('/expenses', expenseData);
    console.log("Received response:", response);
    return response.data;
  } catch (error) {
    console.error("Error in createExpense API call:", error);
    throw error;
  }
};

export const deleteExpense = async (expenseId) => {
  const response = await api.delete(`/expenses/${expenseId}`);
  return response.data;
};
