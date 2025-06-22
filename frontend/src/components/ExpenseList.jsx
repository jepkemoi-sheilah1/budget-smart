import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const ExpenseList = () => {
  const { expenses } = useContext(ExpenseContext);

  return (
    <div>
      {expenses.length === 0 ? (
        <div>No expenses added yet.</div>
      ) : (
        expenses.map(expense => (
          <div key={expense.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #ccc' }}>
            <div style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: '2px solid #ccc',
              marginRight: 10
            }}></div>
            <div style={{ flex: 1 }}>{expense.name}</div>
            <div style={{ width: 80, textAlign: 'right' }}>{expense.date}</div>
            <div style={{ width: 60, textAlign: 'right' }}>${expense.amount.toFixed(2)}</div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseList;
