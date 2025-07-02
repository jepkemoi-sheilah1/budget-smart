import React, { useState } from 'react';
import Chart from '../components/Chart';
import ExpenseList from '../components/ExpenseList';
import BudgetForm from '../components/BudgetForm';
import ExpenseForm from '../components/ExpenseForm';
import { ExpenseProvider } from '../context/ExpenseContext';
import CategoryList from '../components/CategoryList';

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <ExpenseProvider>
      <div className="dashboard-container">
        <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="dashboard-title">Budget Smart</h1>
          {/* Removed emoji user icon as user icon is in Navbar */}
        </header>

        <div className="dashboard-main-content" style={{ display: 'flex', gap: '20px' }}>
          <aside className="dashboard-aside" style={{ flex: '1 1 300px' }}>
            <h2 className="dashboard-section-title">Add Expense</h2>
            <ExpenseForm />
          </aside>

          <section className="dashboard-center-section" style={{ flex: '3 1 0' }}>
            <div className="budget-total-row" style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              <div className="budget-section" style={{ flex: '1 1 300px' }}>
                <h2 className="dashboard-section-title">Set Monthly Budget</h2>
                <BudgetForm />
              </div>
              <div className="chart-section" style={{ padding: '10px 20px 20px 20px', minWidth: '300px', flex: '1 1 300px' }}>
                <h2 className="dashboard-section-title">Monthly Overview</h2>
                <Chart />
              </div>
            </div>
          </section>
        </div>

        <section className="dashboard-expenses">
          <h2 className="dashboard-section-title">Recent Expenses</h2>
          <ExpenseList filterCategory={selectedCategory} />
        </section>

      </div>
    </ExpenseProvider>
  );
};

export default Dashboard;
