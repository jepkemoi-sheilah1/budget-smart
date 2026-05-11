import React, { useContext } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { ExpenseContext } from '../context/ExpenseContext';

const COLORS = [
  '#2563eb', '#7c3aed', '#059669', '#ea580c',
  '#db2777', '#0891b2', '#65a30d', '#d97706',
  '#dc2626', '#6366f1', '#14b8a6'
];

const Chart = () => {
  const { expenses } = useContext(ExpenseContext);

  const categoryTotals = expenses.reduce((acc, expense) => {
    const key = `Cat ${expense.category_id}`;
    acc[key] = (acc[key] || 0) + expense.amount;
    return acc;
  }, {});

  const data = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    amount: parseFloat(value.toFixed(2)),
  }));

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400">
        <span className="text-4xl mb-2">📊</span>
        <p className="text-sm">No expenses yet — add some to see your chart</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#64748b' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `KSh ${v.toLocaleString()}`}
        />
        <Tooltip
          formatter={(value) => [`KSh ${value.toLocaleString()}`, 'Amount']}
          contentStyle={{
            borderRadius: '12px',
            border: 'none',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            fontSize: '13px'
          }}
        />
        <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={60}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Chart;