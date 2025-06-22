import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const CategoryCard = ({ category }) => {
  const { budgets } = useContext(ExpenseContext);
  const amount = budgets[category] || 0;

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: 10,
      width: 80,
      textAlign: 'center',
      fontSize: 14,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }}>
      <div style={{
        width: 40,
        height: 40,
        backgroundColor: '#eee',
        borderRadius: 8,
        marginBottom: 4
      }}>
        {/* Placeholder for category icon */}
      </div>
      <div>{category}</div>
      <div>${amount.toFixed(2)}</div>
    </div>
  );
};

export default CategoryCard;
