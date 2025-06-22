import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const BudgetForm = () => {
  const { addExpense, updateBudget } = useContext(ExpenseContext);

  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Food');

  const [budgetCategory, setBudgetCategory] = useState('Food');
  const [budgetAmount, setBudgetAmount] = useState('');

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseName || !expenseAmount || !expenseDate) return;

    addExpense({
      name: expenseName,
      amount: parseFloat(expenseAmount),
      date: expenseDate,
      category: expenseCategory,
    });

    setExpenseName('');
    setExpenseAmount('');
    setExpenseDate('');
  };

  const handleUpdateBudget = (e) => {
    e.preventDefault();
    if (!budgetAmount) return;

    updateBudget(budgetCategory, parseFloat(budgetAmount));
    setBudgetAmount('');
  };

  return (
    <div style={{ maxWidth: 400, margin: '20px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h3>Add Expense</h3>
      <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <input
          type="text"
          placeholder="Expense Name"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          required
          min="0"
          step="0.01"
        />
        <input
          type="date"
          value={expenseDate}
          onChange={(e) => setExpenseDate(e.target.value)}
          required
        />
        <select value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit">Add Expense</button>
      </form>

      <h3 style={{ marginTop: 30 }}>Set Budget</h3>
      <form onSubmit={handleUpdateBudget} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <select value={budgetCategory} onChange={(e) => setBudgetCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="number"
          placeholder="Budget Amount"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
          required
          min="0"
          step="0.01"
        />
        <button type="submit">Set Budget</button>
      </form>
    </div>
  );
};

export default BudgetForm;
