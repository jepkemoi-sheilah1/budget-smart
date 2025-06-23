import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const BalanceCard = () => {
  const { totalBudget, totalSpent } = useContext(ExpenseContext);

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: 8,
      padding: 20,
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 16,
      maxWidth: 400,
      margin: '0 auto'
    }}>
      <div>
        <div style={{ fontSize: 14, color: '#555' }}>Budget</div>
        <div style={{ fontWeight: 'bold', fontSize: 24 }}>${totalBudget.toFixed(0)}</div>
      </div>
      <div>
        <div style={{ fontSize: 14, color: '#555' }}>Total Expenses</div>
        <div style={{ fontWeight: 'bold', fontSize: 24 }}>${totalSpent.toFixed(0)}</div>
      </div>
    </div>
  );
};

export default BalanceCard;
