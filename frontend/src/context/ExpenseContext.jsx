import React, { createContext, useState } from 'react';

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({
    Housing: 0,
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
  });

  const addExpense = (expense) => {
    const expenseWithDate = {
      ...expense,
      date: expense.date || new Date().toLocaleDateString(),
    };
    setExpenses(prevExpenses => [...prevExpenses, { id: Date.now(), ...expenseWithDate }]);
  };

  const deleteExpense = (id) => {
    setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
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
