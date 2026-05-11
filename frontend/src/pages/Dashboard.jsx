import React, { useState, useContext } from 'react';
import Chart from '../components/Chart';
import ExpenseList from '../components/ExpenseList';
import BudgetForm from '../components/BudgetForm';
import ExpenseForm from '../components/ExpenseForm';
import { ExpenseProvider, ExpenseContext } from '../context/ExpenseContext';
import { AuthContext } from '../context/AuthContext';

const DashboardContent = () => {
  const { user } = useContext(AuthContext);
  const { totalSpent, totalBudget, remaining, expenses } = useContext(ExpenseContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'expenses', label: 'Expenses', icon: '💸' },
    { id: 'budget', label: 'Budget', icon: '🎯' },
  ];

  return (
   <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
     <aside className={`
  fixed top-0 left-0 h-screen w-64 bg-slate-900 z-30 transform transition-transform duration-300 flex flex-col
  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
  md:relative md:translate-x-0 md:flex
`}>
      
        {/* Sidebar Header */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-700">
          <span className="text-2xl">💰</span>
          <span className="text-lg font-bold text-white">
            Spent<span className="text-blue-400">wise</span>
          </span>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{user?.username}</p>
              <p className="text-slate-400 text-xs">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="px-4 py-4 flex flex-col gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left
                ${activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        {/* Sidebar Footer */}
        <div className="mt-auto px-4 py-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            &copy; {new Date().getFullYear()} Spentwise
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              className="md:hidden text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                {navItems.find(n => n.id === activeTab)?.icon}{' '}
                {navItems.find(n => n.id === activeTab)?.label}
              </h1>
              <p className="text-xs text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-auto">

          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Total Budget</p>
                  <p className="text-2xl font-bold text-slate-900">KSh {totalBudget.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 mt-1">This month</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-red-500">KSh {totalSpent.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 mt-1">{expenses.length} transactions</p>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Remaining</p>
                  <p className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    KSh {remaining.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {remaining >= 0 ? '✅ On track' : '⚠️ Over budget'}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">Monthly Overview</h2>
                <Chart />
              </div>

              {/* Recent Expenses */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">Recent Expenses</h2>
                <ExpenseList />
              </div>

            </div>
          )}

          {/* EXPENSES TAB */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">Add New Expense</h2>
                <ExpenseForm />
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h2 className="text-sm font-semibold text-slate-700 mb-4">All Expenses</h2>
                <ExpenseList />
              </div>
            </div>
          )}

          {/* BUDGET TAB */}
          {activeTab === 'budget' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-sm font-semibold text-slate-700 mb-4">Set Monthly Budget</h2>
              <BudgetForm />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <ExpenseProvider>
      <DashboardContent />
    </ExpenseProvider>
  );
};

export default Dashboard;