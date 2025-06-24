import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const BalanceCard = () => {
  const { totalBudget, totalSpent, remaining } = useContext(ExpenseContext);

  return (
    <div className="balance-card" style={{ display: 'flex', justifyContent: 'space-around', gap: '20px', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', width: '100%' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="balance-card-label">Monthly Budget</div>
          <div className="balance-card-amount" style={{ fontSize: '1rem' }}>${totalBudget.toFixed(0)}</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="balance-card-label">Total Expenses</div>
          <div className="balance-card-amount" style={{ fontSize: '1rem' }}>${totalSpent.toFixed(0)}</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div className="balance-card-label">Remaining</div>
          <div className="balance-card-amount" style={{ fontSize: '1rem' }}>${remaining.toFixed(0)}</div>
        </div>
      </div>
      {totalSpent >= 0.9 * totalBudget && totalBudget > 0 && (
        <div style={{ marginTop: '10px', color: 'red', fontWeight: 'bold' }}>
          Warning: You are close to exceeding your budget!
        </div>
      )}
    </div>
  );
};

export default BalanceCard;
