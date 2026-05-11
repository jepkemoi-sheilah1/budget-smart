import React from 'react';
import { NavLink } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-sm font-medium px-4 py-2 rounded-full mb-6">
            💰 Smart Budget Tracking
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Take Control of <span className="text-blue-600">Your Money</span>
          </h1>
          <p className="text-xl text-slate-500 mb-10 max-w-xl mx-auto">
            Spentwise helps you track expenses, set budgets, and visualize your spending — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="/register">
              <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                Get Started Free
              </button>
            </NavLink>
            <NavLink to="/login">
              <button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-blue-600 font-semibold px-8 py-4 rounded-xl text-lg border-2 border-blue-600 transition-all duration-200">
                Log In
              </button>
            </NavLink>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full px-4">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4">
              📊
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Track Expenses</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Log your daily expenses by category and stay on top of where your money goes.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl mb-4">
              🎯
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Set Budgets</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Define monthly budgets and get a clear picture of your remaining balance at any time.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl mb-4">
              📈
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Visual Reports</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              See your spending patterns through charts and make smarter financial decisions.
            </p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default LandingPage;