import React, { useContext, useState } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const ExpenseList = () => {
  const { expenses, deleteExpense, updateExpense } = useContext(ExpenseContext);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editCategory, setEditCategory] = useState('');
  // const [filterCategory, setFilterCategory] = useState('All');
  // const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Calculate total spent per category

  const startEdit = (expense) => {
    setEditId(expense.id);
    setEditName(expense.name);
    setEditAmount(expense.amount);
    setEditDate(expense.date);
    setEditCategory(expense.category);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName('');
    setEditAmount('');
    setEditDate('');
    setEditCategory('');
  };

  const saveEdit = () => {
    if (!editName || !editAmount || !editDate || !editCategory) return;
    updateExpense({
      id: editId,
      name: editName,
      amount: parseFloat(editAmount),
      date: editDate,
      category: editCategory,
    });
    cancelEdit();
  };

  // Filter expenses based on date range
  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    // const startDate = filterStartDate ? new Date(filterStartDate) : null;
    const startDate = null;
    const endDate = filterEndDate ? new Date(filterEndDate) : null;
    const startDateMatch = !startDate || expenseDate >= startDate;
    const endDateMatch = !endDate || expenseDate <= endDate;

    return startDateMatch && endDateMatch;
  });

  return (
    <div>
      {/* Filter controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <label>
          End Date:&nbsp;
          <input
            type="date"
            value={filterEndDate}
            onChange={e => setFilterEndDate(e.target.value)}
            style={{ minWidth: 0 }}
          />
        </label>
      </div>
      {filteredExpenses.length === 0 ? (
        <div>No expenses added yet.</div>
      ) : (
        <>
          <div style={{ display: 'flex', fontWeight: 'bold', padding: '8px 0', borderBottom: '2px solid #000', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ width: 20, marginRight: 10, flexShrink: 0 }}></div>
            <div style={{ flex: '2 1 120px', minWidth: 0, wordBreak: 'break-word' }}>Expense</div>
            <div style={{ flex: '1 1 100px', textAlign: 'right', whiteSpace: 'nowrap', minWidth: 0 }}>Date</div>
            <div style={{ flex: '1 1 80px', textAlign: 'right', whiteSpace: 'nowrap', minWidth: 0 }}>Amount Spent</div>
            <div style={{ width: 60, flexShrink: 0 }}></div>
          </div>
          {filteredExpenses.map(expense => {
            if (editId === expense.id) {
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
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ flex: '2 1 120px', minWidth: 0, wordBreak: 'break-word' }}
                  />
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    style={{ flex: '1 1 100px', textAlign: 'left', minWidth: 0 }}
                  />
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    style={{ flex: '1 1 80px', textAlign: 'right', minWidth: 0 }}
                    step="0.01"
                    min="0"
                  />
                  <div style={{ flex: '0 0 120px', display: 'flex', gap: '5px' }}>
                    <button onClick={saveEdit} style={{ backgroundColor: 'green', color: 'white', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer' }}>Save</button>
                    <button onClick={cancelEdit} style={{ backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: 4, padding: '2px 6px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                </div>
              );
            }
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
                <div style={{ flex: '2 1 120px', overflowWrap: 'break-word', minWidth: 0, textAlign: 'left', wordBreak: 'break-word' }}>{expense.name}</div>
                <div style={{ flex: '1 1 100px', textAlign: 'left', whiteSpace: 'nowrap', minWidth: 0 }}>{expense.date}</div>
                <div style={{ flex: '1 1 80px', textAlign: 'right', whiteSpace: 'nowrap', minWidth: 0 }}>${expense.amount.toFixed(2)}</div>
                <div style={{ flex: '0 0 120px', display: 'flex', justifyContent: 'flex-end', gap: '5px', flexShrink: 0 }}>
                  <button
                    onClick={() => startEdit(expense)}
                    style={{
                      backgroundColor: 'blue',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      padding: '2px 6px',
                      cursor: 'pointer',
                      minWidth: '60px'
                    }}
                    aria-label={`Edit expense ${expense.name}`}
                  >
                    Edit
                  </button>
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
