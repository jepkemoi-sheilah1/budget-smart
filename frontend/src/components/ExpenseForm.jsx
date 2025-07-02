import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const ExpenseForm = () => {
  const { addExpense } = useContext(ExpenseContext);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Housing');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    console.log("Submitting expense:", { description, amount: parseFloat(amount), category });
    addExpense({ description, amount: parseFloat(amount), category });
    setDescription('');
    setAmount('');
  };

  return (
<form className="add-expense-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="Housing">Housing</option>
        <option value="Transportation">Transportation</option>
        <option value="Food">Food</option>
        <option value="Health & Medical">Health & Medical</option>
        <option value="Debt Payments">Debt Payments</option>
        <option value="Savings & Investments">Savings & Investments</option>
        <option value="Personal & Family">Personal & Family</option>
        <option value="Entertainment & Leisure">Entertainment & Leisure</option>
        <option value="Education">Education</option>
        <option value="Gifts & Donations">Gifts & Donations</option>
        <option value="Miscellaneous">Miscellaneous</option>
      </select>
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
