import React, { useContext } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const ExpenseList = () => {
  const { expenses, deleteExpense, budgets } = useContext(ExpenseContext);

  // Calculate total spent per category
  const spentPerCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  return (
    <div>
      {expenses.length === 0 ? (
        <div>No expenses added yet.</div>
      ) : (
        <>
          <div style={{ display: 'flex', fontWeight: 'bold', padding: '8px 0', borderBottom: '2px solid #000', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ width: 20, marginRight: 10 }}></div>
            <div style={{ flex: '2 1 120px', minWidth: 0 }}>Expense</div>
            <div style={{ flex: '1 1 100px', textAlign: 'right', whiteSpace: 'nowrap', minWidth: 0 }}>Date</div>
            <div style={{ flex: '1 1 80px', textAlign: 'right', whiteSpace: 'nowrap', minWidth: 0 }}>Amount Spent</div>
            <div style={{ flex: '1 1 100px', textAlign: 'right', minWidth: 0 }}>Remaining</div>
            <div style={{ width: 60 }}></div>
          </div>
          {expenses.map(expense => {
            const remainingForCategory = (budgets[expense.category] || 0) - (spentPerCategory[expense.category] || 0);
            return (
              <div key={expense.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #ccc', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: '2px solid #ccc',
                  marginRight: 10,
                  flexShrink: 0
                }}></div>
            <div style={{ flex: '2 1 120px', overflowWrap: 'break-word', minWidth: 0, textAlign: 'left' }}>{expense.name}</div>
            <div style={{ flex: '1 1 100px', textAlign: 'left', whiteSpace: 'nowrap', minWidth: 0 }}>{expense.date}</div>
            <div style={{ flex: '1 1 80px', textAlign: 'left', whiteSpace: 'nowrap', minWidth: 0 }}>${expense.amount.toFixed(2)}</div>
            
                <div style={{ flex: '0 0 60px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    style={{
                      backgroundColor: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      padding: '2px 6px',
                      cursor: 'pointer',
                      minWidth: '60px'
                    }}
                    aria-label={`Delete expense ${expense.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default ExpenseList;
