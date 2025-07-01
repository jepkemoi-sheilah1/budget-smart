import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const CategoryCard = ({ category }) => {
  const { budgets } = useContext(ExpenseContext);
  const amount = budgets[category] || 0;

  return (
    <div className="category-card">
      <div className="category-card-icon">
        {/* Placeholder for category icon */}
      </div>
      <div className="category-card-text">{category}</div>
      <div className="category-card-text">${amount.toFixed(2)}</div>
    </div>
  );
};

export default CategoryCard;
