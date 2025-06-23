import React from 'react';
import BalanceCard from '../components/BalanceCard';
import CategoryCard from '../components/CategoryCard';
import Chart from '../components/Chart';
import ExpenseList from '../components/ExpenseList';
import BudgetForm from '../components/BudgetForm';
import { ExpenseProvider } from '../context/ExpenseContext';

const Dashboard = () => {
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
          <aside style={{ display: 'flex' }}>
            <nav className="category-menu" style={{ width: '200px', borderRight: '1px solid #ccc', paddingRight: '10px' }}>
              <h2 className="dashboard-section-title">Categories</h2>
              <ul className="category-list-vertical" style={{ listStyle: 'none', padding: 0 }}>
                <li className="category-item selected" style={{ padding: '8px 0', cursor: 'pointer' }}>Housing</li>
                <li className="category-item" style={{ padding: '8px 0', cursor: 'pointer' }}>Food</li>
                <li className="category-item" style={{ padding: '8px 0', cursor: 'pointer' }}>Transportation</li>
                <li className="category-item" style={{ padding: '8px 0', cursor: 'pointer' }}>Entertainment</li>
              </ul>
            </nav>
            <div style={{ flex: 1, paddingLeft: '20px' }}>
              <h2 className="dashboard-section-title">Set Monthly Budget</h2>
              <BudgetForm />
            </div>
          </aside>

          <section className="dashboard-center-section">
            <div className="budget-total-row">
              <div className="budget-section">
                <h2 className="dashboard-section-title">Budget</h2>
                <BalanceCard />
              </div>
            </div>

            <div className="chart-section">
              <h2 className="dashboard-section-title">Monthly Overview</h2>
              <Chart />
            </div>
          </section>
        </div>

        <section className="dashboard-expenses">
          <h2 className="dashboard-section-title">Recent Expenses</h2>
          <ExpenseList />
        </section>

      </div>
    </ExpenseProvider>
  );
};

export default Dashboard;
