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
        <header className="dashboard-header">
          <h1 className="dashboard-title">Budget Smart</h1>
          <div className="dashboard-user-icon">
            <span role="img" aria-label="user">👤</span>
          </div>
        </header>

        <div className="dashboard-main-content">
          <aside className="dashboard-aside">
            <CategoryList selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
          </aside>

          <section className="dashboard-center-section">
            <div className="budget-total-row">
              <div className="budget-section">
                <h2 className="dashboard-section-title">Set Monthly Budget</h2>
                <BudgetForm />
              </div>
              <div className="chart-section">
                <h2 className="dashboard-section-title">Monthly Overview</h2>
                <Chart />
              </div>
            </div>
          </section>
        </div>

        <section className="dashboard-expenses">
          <h2 className="dashboard-section-title">Recent Expenses</h2>
          <ExpenseList filterCategory={selectedCategory} />
          <ExpenseForm />
        </section>

      </div>
    </ExpenseProvider>
  );
};

export default Dashboard;
