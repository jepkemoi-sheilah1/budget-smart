import React, { useContext } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import { ExpenseContext } from '../context/ExpenseContext';

const COLORS = ['#4A90E2', '#9B59B6', '#F5A623', '#E74C3C'];

const Chart = () => {
  const { budgets } = useContext(ExpenseContext);

  const data = Object.keys(budgets).map((key, index) => ({
    name: key,
    value: budgets[key],
    color: COLORS[index % COLORS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={70}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default Chart;
