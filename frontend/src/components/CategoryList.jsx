import React from 'react';

const categories = [
  'Housing',
  'Transportation',
  'Food',
  'Health & Medical',
  'Debt Payments',
  'Savings & Investments',
  'Personal & Family',
  'Entertainment & Leisure',
  'Education',
  'Gifts & Donations',
  'Miscellaneous'
];

const CategoryList = ({ selectedCategory, onSelectCategory }) => {
  return (
    <nav className="category-menu">
      <h2 className="dashboard-section-title">Categories</h2>
      <ul className="category-list-vertical">
        {categories.map((category) => (
          <li
            key={category}
            className={`category-item ${selectedCategory === category ? 'selected' : ''}`}
            onClick={() => onSelectCategory(category)}
            style={{ cursor: 'pointer' }}
          >
            {category}
          </li>
        ))}
        <li
          className={`category-item ${selectedCategory === 'All' ? 'selected' : ''}`}
          onClick={() => onSelectCategory('All')}
          style={{ cursor: 'pointer' }}
        >
          All
        </li>
      </ul>
    </nav>
  );
};

export default CategoryList;
