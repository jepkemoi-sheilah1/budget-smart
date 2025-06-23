import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const BalanceCard = () => {
  const { totalBudget, totalSpent } = useContext(ExpenseContext);

  return (
    <div style={{
      border: '1px solid #3399ff', // lighter blue border
      borderRadius: 8,
      padding: 20,
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 16,
      maxWidth: 400,
      margin: '0 auto',
      backgroundColor: '#e6f0ff' // very light blue background
    }}>
      <div>
        <div style={{ fontSize: 14, color: '#004080' /* dark blue text */ }}>Budget</div>
        <div style={{ fontWeight: 'bold', fontSize: 24, color: '#003366' /* dark navy blue */ }}>${totalBudget.toFixed(0)}</div>
      </div>
      <div>
        <div style={{ fontSize: 14, color: '#004080' /* dark blue text */ }}>Total Expenses</div>
        <div style={{ fontWeight: 'bold', fontSize: 24, color: '#003366' /* dark navy blue */ }}>${totalSpent.toFixed(0)}</div>
      </div>
    </div>
  );
};

export default BalanceCard;
