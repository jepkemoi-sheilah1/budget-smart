import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { fetchExpenses, createExpense, deleteExpense as apiDeleteExpense } from '../services/expenseService';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [allExpenses, setAllExpenses] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({
    Housing: 0,
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
  });

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
    } else {
      setAllExpenses([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      // Filter expenses by user email or username
      const filtered = allExpenses.filter(expense => expense.user === user.email || expense.user === user.username);
      setExpenses(filtered);
    } else {
      setExpenses([]);
    }
  }, [user, allExpenses]);

  const addExpense = async (expense) => {
    if (!user) return;
    const expenseWithDate = {
      ...expense,
      date: expense.date || new Date().toLocaleDateString(),
      user: user.email || user.username,
    };
    try {
      const savedExpense = await createExpense(expenseWithDate);
      setAllExpenses(prevExpenses => [...prevExpenses, savedExpense]);
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await apiDeleteExpense(id);
      setAllExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0);

  const totalBudget = Object.values(budgets).reduce((total, amount) => total + amount, 0);

  const remaining = totalBudget - totalSpent;

  const updateBudget = (category, amount) => {
    setBudgets(prevBudgets => ({
      ...prevBudgets,
      [category]: amount,
    }));
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
