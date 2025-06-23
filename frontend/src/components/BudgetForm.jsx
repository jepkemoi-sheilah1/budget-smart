import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const BudgetForm = () => {
  const { addExpense } = useContext(ExpenseContext);

  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Housing');

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseName || !expenseAmount) return;

    addExpense({
      name: expenseName,
      amount: parseFloat(expenseAmount),
      category: expenseCategory,
    });

    setExpenseName('');
    setExpenseAmount('');
  };

  return (
    <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: 10, maxWidth: 400, margin: '20px auto' }}>
      <input
        type="text"
        placeholder="Description"
        value={expenseName}
        onChange={(e) => setExpenseName(e.target.value)}
        required
        style={{ flex: 2, padding: 8, borderRadius: 4, border: '1px solid #3399ff' }}
      />
      <input
        type="number"
        placeholder="Amount"
        value={expenseAmount}
        onChange={(e) => setExpenseAmount(e.target.value)}
        required
        min="0"
        step="0.01"
        style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #3399ff' }}
      />
      <select
        value={expenseCategory}
        onChange={(e) => setExpenseCategory(e.target.value)}
        style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #3399ff' }}
      >
        <option value="Housing">Housing</option>
        <option value="Food">Food</option>
        <option value="Transportation">Transportation</option>
        <option value="Entertainment">Entertainment</option>
      </select>
      <button type="submit" style={{
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: 4,
        padding: '8px 16px',
        cursor: 'pointer',
        fontSize: 16
      }}>
        Add
      </button>
    </form>
  );
};

export default BudgetForm;
