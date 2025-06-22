import React from 'react';
import BalanceCard from '../components/BalanceCard';
import CategoryCard from '../components/CategoryCard';
import Chart from '../components/Chart';
import ExpenseList from '../components/ExpenseList';
import Navbar from '../components/Navbar';
import { ExpenseProvider } from '../context/ExpenseContext';

const Dashboard = () => {
  return (
    <ExpenseProvider>
      <div className="dashboard-container" style={{ maxWidth: 400, margin: '0 auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h1 style={{ margin: 0 }}>Expense Tracker</h1>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span role="img" aria-label="user">👤</span>
          </div>
        </header>

        <BalanceCard />

        <section style={{ marginTop: 30 }}>
          <h2 style={{ fontSize: 18, marginBottom: 10 }}>Category Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <CategoryCard category="Food" amount={0} />
            <CategoryCard category="Transport" amount={0} />
            <CategoryCard category="Shopping" amount={0} />
            <CategoryCard category="Other" amount={0} />
          </div>
        </section>

        <section style={{ marginTop: 30 }}>
          <h2 style={{ fontSize: 18, marginBottom: 10 }}>Monthly Overview</h2>
          <Chart />
        </section>

        <section style={{ marginTop: 30 }}>
          <h2 style={{ fontSize: 18, marginBottom: 10 }}>Recent Expenses</h2>
          <ExpenseList />
        </section>

        <Navbar />
      </div>
    </ExpenseProvider>
  );
};

export default Dashboard;
