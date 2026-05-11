import React, { useState, useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const CATEGORIES = [
  'Housing', 'Transportation', 'Food', 'Health & Medical',
  'Debt Payments', 'Savings & Investments', 'Personal & Family',
  'Entertainment & Leisure', 'Education', 'Gifts & Donations', 'Miscellaneous'
];

const CATEGORY_ICONS = {
  'Housing': '🏠',
  'Transportation': '🚗',
  'Food': '🍔',
  'Health & Medical': '💊',
  'Debt Payments': '💳',
  'Savings & Investments': '📈',
  'Personal & Family': '👨‍👩‍👧',
  'Entertainment & Leisure': '🎬',
  'Education': '📚',
  'Gifts & Donations': '🎁',
  'Miscellaneous': '📦',
};

const BudgetForm = () => {
  const { budgets, updateBudget } = useContext(ExpenseContext);
  const [budgetCategory, setBudgetCategory] = useState('Housing');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    if (!budgetAmount) return;
    setLoading(true);
    await updateBudget(budgetCategory, parseFloat(budgetAmount));
    setBudgetAmount('');
    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-lg">

      {success && (
        <div className="bg-green-50 text-green-700 text-sm font-medium px-4 py-3 rounded-xl border border-green-200">
          ✅ Budget updated successfully!
        </div>
      )}

      <form onSubmit={handleBudgetSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Category
          </label>
          <select
            value={budgetCategory}
            onChange={(e) => setBudgetCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {CATEGORY_ICONS[cat]} {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            Monthly Budget Amount (KSh)
          </label>
          <input
            type="number"
            placeholder="e.g. 10000"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            min="0"
            step="0.01"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {loading ? 'Saving...' : '🎯 Set Budget'}
        </button>
      </form>

      {/* Current Budgets */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Current Budgets
        </h3>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            budgets[cat] > 0 && (
              <div key={cat} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <span>{CATEGORY_ICONS[cat]}</span>
                  <span className="text-sm font-medium text-slate-700">{cat}</span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  KSh {budgets[cat].toLocaleString()}
                </span>
              </div>
            )
          ))}
          {Object.values(budgets).every(v => v === 0) && (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              <span className="text-3xl mb-2">🎯</span>
              <p className="text-sm">No budgets set yet</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default BudgetForm;