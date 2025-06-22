import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const BalanceCard = () => {
  const { totalBudget, totalSpent, remaining } = useContext(ExpenseContext);

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      fontSize: 16,
      maxWidth: 400,
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Total Balance</span>
        <span>${totalBudget.toFixed(2)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Spent</span>
        <span>${totalSpent.toFixed(2)}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Remaining</span>
        <span>${remaining.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default BalanceCard;
