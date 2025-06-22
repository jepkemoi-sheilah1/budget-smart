import React from 'react';

const BalanceCard = () => {
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
        <span>$0.00</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Spent</span>
        <span>$0.00</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>Remaining</span>
        <span>$0.00</span>
      </div>
    </div>
  );
};

export default BalanceCard;
