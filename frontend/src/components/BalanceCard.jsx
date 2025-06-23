import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const BalanceCard = () => {
  const { totalBudget, totalSpent } = useContext(ExpenseContext);

  return (
    <div className="balance-card">
      <div>
        <div className="balance-card-label">Budget</div>
        <div className="balance-card-amount">${totalBudget.toFixed(0)}</div>
      </div>
      <div>
        <div className="balance-card-label">Total Expenses</div>
        <div className="balance-card-amount">${totalSpent.toFixed(0)}</div>
      </div>
    </div>
  );
};

export default BalanceCard;
