import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { fetchExpenses, createExpense, deleteExpense as apiDeleteExpense } from '../services/expenseService';
import api from '../services/api';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [allExpenses, setAllExpenses] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({
    Housing: 0,
    Transportation: 0,
    Food: 0,
    'Health & Medical': 0,
    'Debt Payments': 0,
    'Savings & Investments': 0,
    'Personal & Family': 0,
    'Entertainment & Leisure': 0,
    Education: 0,
    'Gifts & Donations': 0,
    Miscellaneous: 0,
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (user) {
      fetchExpenses()
        .then((data) => {
          setAllExpenses(data);
        })
        .catch((error) => {
          console.error('Failed to fetch expenses:', error);
          setAllExpenses([]);
        });
      // Fetch categories
      api.get('/categories')
        .then(response => {
          setCategories(response.data);
        })
        .catch(error => {
          console.error('Failed to fetch categories:', error);
          setCategories([]);
        });
    } else {
      setAllExpenses([]);
      setCategories([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // Filter expenses by user_id matching user.id
      const filtered = allExpenses.filter(expense => expense.user_id === user.id);
      setExpenses(filtered);
    } else {
      setExpenses([]);
    }
  }, [user, allExpenses]);

  const addExpense = async (expense) => {
    console.log("addExpense called with:", expense);
    if (!user) {
      console.warn("No user found, aborting addExpense");
      return;
    }
    // Map category name to category_id
    const categoryObj = categories.find(cat => cat.name === expense.category);
    if (!categoryObj) {
      console.error("Invalid category:", expense.category);
      return;
    }
    const expenseWithDate = {
      ...expense,
      date: expense.date || new Date().toLocaleDateString(),
      user_id: user.id,
      category_id: categoryObj.id,
    };
    // Remove category name as backend expects category_id
    delete expenseWithDate.category;
    console.log("Sending expense:", expenseWithDate);
    try {
      const savedExpense = await createExpense(expenseWithDate);
      console.log("Expense saved:", savedExpense);
      setAllExpenses(prevExpenses => [...prevExpenses, savedExpense]);
      alert('Expense added successfully.');
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await apiDeleteExpense(id);
      setAllExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
      alert('Expense deleted successfully.');
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0);

  const totalBudget = Object.values(budgets).reduce((total, amount) => total + amount, 0);

  const remaining = totalBudget - totalSpent;

  const updateBudget = async (category, amount) => {
    try {
      // Find existing budget for user and category
      const existingBudget = budgets[category] || 0;
      // Update local state optimistically
      setBudgets(prevBudgets => ({
        ...prevBudgets,
        [category]: amount,
      }));
      // Prepare budget data for backend
      const budgetData = {
        user_id: user.id,
        amount: amount,
        month: new Date().toISOString().slice(0, 7), // YYYY-MM format
      };
      // Call backend API to create or update budget
      // For simplicity, assume create budget API is POST /budgets
      // In real app, should check if budget exists and call PUT /budgets/:id
      await api.post('/budgets', budgetData);
      alert('Budget set successfully.');
    } catch (error) {
      console.error('Failed to update budget:', error);
    }
  };

  return (
    <ExpenseContext.Provider value={{
      expenses,
      addExpense,
      deleteExpense,
      budgets,
      updateBudget,
      totalSpent,
      totalBudget,
      remaining,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
