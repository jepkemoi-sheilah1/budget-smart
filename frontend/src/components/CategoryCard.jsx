import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const CategoryCard = ({ category }) => {
  const { budgets } = useContext(ExpenseContext);
  const amount = budgets[category] || 0;

  return (
    <div style={{
      border: '1px solid #3399ff', // lighter blue border
      borderRadius: 8,
      padding: 10,
      width: 80,
      textAlign: 'center',
      fontSize: 14,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#e6f0ff' // very light blue background
    }}>
      <div style={{
        width: 40,
        height: 40,
        backgroundColor: '#cce6ff', // light blue background
        borderRadius: 8,
        marginBottom: 4
      }}>
        {/* Placeholder for category icon */}
      </div>
      <div style={{ color: '#004080', fontWeight: 'bold' }}>{category}</div>
      <div style={{ color: '#003366', fontWeight: 'bold' }}>${amount.toFixed(2)}</div>
    </div>
  );
};

export default CategoryCard;
