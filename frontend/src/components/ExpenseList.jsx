import React, { useContext, useState } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const ExpenseList = () => {
  const { expenses, deleteExpense } = useContext(ExpenseContext);
  const [filterEndDate, setFilterEndDate] = useState('');

  const filteredExpenses = expenses.filter(expense => {
    if (!filterEndDate) return true;
    return new Date(expense.date) <= new Date(filterEndDate);
  });

  return (
    <div>
      {/* Filter */}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Filter by date:
        </label>
        <input
          type="date"
          value={filterEndDate}
          onChange={e => setFilterEndDate(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
        />
        {filterEndDate && (
          <button
            onClick={() => setFilterEndDate('')}
            className="text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <span className="text-4xl mb-2">💸</span>
          <p className="text-sm">No expenses added yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Description</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Category</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Date</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Amount</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wide pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredExpenses.map(expense => (
                <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 font-medium text-slate-800">
                    {expense.description || expense.name || '—'}
                  </td>
                  <td className="py-3">
                    <span className="bg-blue-50 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                      Cat {expense.category_id}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500">{expense.date}</td>
                  <td className="py-3 text-right font-semibold text-slate-800">
                    KSh {expense.amount.toLocaleString()}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-xs bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1 rounded-lg transition-all duration-200 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;