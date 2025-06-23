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

        <BalanceCard />

        <section style={{ marginTop: 30 }}>
          <h2 className="dashboard-section-title">Category Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <CategoryCard category="Food" />
            <CategoryCard category="Transport" />
            <CategoryCard category="Shopping" />
            <CategoryCard category="Other" />
          </div>
        </section>

        <section style={{ marginTop: 30 }}>
          <h2 className="dashboard-section-title">Monthly Overview</h2>
          <Chart />
        </section>

        <section style={{ marginTop: 30 }}>
          <h2 className="dashboard-section-title">Recent Expenses</h2>
          <ExpenseList />
        </section>

        <BudgetForm />

      </div>
    </ExpenseProvider>
  );
};

export default Dashboard;
