import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const BudgetForm = () => {
  const { addExpense, updateBudget, budgets } = useContext(ExpenseContext);

  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Housing');

  const [budgetCategory, setBudgetCategory] = useState('Housing');
  const [budgetAmount, setBudgetAmount] = useState(budgets['Housing'] || 0);

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

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    updateBudget(budgetCategory, parseFloat(budgetAmount));
  };

  const handleBudgetCategoryChange = (e) => {
    const category = e.target.value;
    setBudgetCategory(category);
    setBudgetAmount(budgets[category] || 0);
  };

  return (
    <>
      <form onSubmit={handleAddExpense} className="budget-form">
        <input
          type="text"
          placeholder="Description"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          required
          className="budget-form-input"
        />
        <input
          type="number"
          placeholder="Amount"
          value={expenseAmount}
          onChange={(e) => setExpenseAmount(e.target.value)}
          required
          min="0"
          step="0.01"
          className="budget-form-input budget-form-number"
        />
        <select
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
          className="budget-form-select"
        >
          <option value="Housing">Housing</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Entertainment">Entertainment</option>
        </select>
        <button type="submit" className="budget-form-button">
          Add Expense
        </button>
      </form>

      <form onSubmit={handleBudgetSubmit} className="budget-form" style={{ marginTop: '20px' }}>
        <h3>Set Monthly Budget</h3>
        <select
          value={budgetCategory}
          onChange={handleBudgetCategoryChange}
          className="budget-form-select"
        >
          <option value="Housing">Housing</option>
          <option value="Food">Food</option>
          <option value="Transportation">Transportation</option>
          <option value="Entertainment">Entertainment</option>
        </select>
        <input
          type="number"
          placeholder="Budget Amount"
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(e.target.value)}
          min="0"
          step="0.01"
          className="budget-form-input budget-form-number"
          required
        />
        <button type="submit" className="budget-form-button">
          Set Budget
        </button>
      </form>
    </>
  );
};

export default BudgetForm;
