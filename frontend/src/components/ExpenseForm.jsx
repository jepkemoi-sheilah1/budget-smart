import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const CATEGORIES = [
  'Housing', 'Transportation', 'Food', 'Health & Medical',
  'Debt Payments', 'Savings & Investments', 'Personal & Family',
  'Entertainment & Leisure', 'Education', 'Gifts & Donations', 'Miscellaneous'
];

const ExpenseForm = () => {
  const { addExpense } = useContext(ExpenseContext);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Housing');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    setLoading(true);
    await addExpense({ description, amount: parseFloat(amount), category, date });
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {success && (
        <div className="bg-green-50 text-green-700 text-sm font-medium px-4 py-3 rounded-xl border border-green-200">
          ✅ Expense added successfully!
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
          Description
        </label>
        <input
          type="text"
          placeholder="e.g. Grocery shopping"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Amount (KSh)
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50"
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-sm hover:shadow-md"
      >
        {loading ? 'Adding...' : '+ Add Expense'}
      </button>
    </form>
  );
};

export default ExpenseForm;