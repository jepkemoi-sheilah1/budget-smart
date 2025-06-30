"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const Dashboard = ({ user }) => {
  const [expenses, setExpenses] = useState([])
  const [budgets, setBudgets] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "Housing",
    date: new Date().toISOString().split("T")[0],
  })
  const [budgetForm, setBudgetForm] = useState({
    category: "Housing",
    amount: "",
  })
  const [filterCategory, setFilterCategory] = useState("All")

  const CATEGORIES = ["Housing", "Food", "Transportation", "Entertainment", "Healthcare", "Shopping"]
  const COLORS = ["#2563eb", "#7c3aed", "#dc2626", "#ea580c", "#059669", "#d97706"]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token")

      // Fetch expenses
      const expensesResponse = await fetch("/api/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Fetch budgets
      const budgetsResponse = await fetch("/api/budgets", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (expensesResponse.ok && budgetsResponse.ok) {
        const expensesData = await expensesResponse.json()
        const budgetsData = await budgetsResponse.json()

        setExpenses(expensesData)
        setBudgets(budgetsData)
      } else {
        setError("Failed to load data")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const addExpense = async (e) => {
    e.preventDefault()
    if (!newExpense.description || !newExpense.amount) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: newExpense.description,
          amount: Number.parseFloat(newExpense.amount),
          category: newExpense.category,
          date: newExpense.date,
        }),
      })

      if (response.ok) {
        const newExpenseData = await response.json()
        setExpenses((prev) => [newExpenseData, ...prev])
        setNewExpense({
          description: "",
          amount: "",
          category: "Housing",
          date: new Date().toISOString().split("T")[0],
        })
      }
    } catch (err) {
      setError("Failed to add expense")
    }
  }

  const updateBudget = async (e) => {
    e.preventDefault()
    if (!budgetForm.amount) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          category: budgetForm.category,
          amount: Number.parseFloat(budgetForm.amount),
        }),
      })

      if (response.ok) {
        setBudgets((prev) => ({
          ...prev,
          [budgetForm.category]: Number.parseFloat(budgetForm.amount),
        }))
        setBudgetForm({ category: "Housing", amount: "" })
      }
    } catch (err) {
      setError("Failed to update budget")
    }
  }

  const deleteExpense = async (id) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setExpenses((prev) => prev.filter((exp) => exp.id !== id))
      }
    } catch (err) {
      setError("Failed to delete expense")
    }
  }

  // Calculate totals
  const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0)
  const totalBudget = Object.values(budgets).reduce((total, amount) => total + amount, 0)
  const remaining = totalBudget - totalSpent

  // Calculate spending per category
  const spentPerCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {})

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => filterCategory === "All" || expense.category === filterCategory)

  // Chart data
  const pieData = CATEGORIES.map((category, index) => ({
    name: category,
    value: spentPerCategory[category] || 0,
    color: COLORS[index],
  })).filter((item) => item.value > 0)

  const barData = CATEGORIES.map((category, index) => ({
    name: category,
    budget: budgets[category] || 0,
    spent: spentPerCategory[category] || 0,
    color: COLORS[index],
  }))

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your financial dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Welcome back, {user?.username}! 👋</h1>
          <p>Here's your financial overview for this month</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Overview Cards */}
        <div className="overview-grid">
          <div className="overview-card budget-card">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <h3>Total Budget</h3>
              <p className="amount">${totalBudget.toFixed(2)}</p>
              <span className="subtitle">Monthly allocation</span>
            </div>
          </div>

          <div className="overview-card spent-card">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>Total Spent</h3>
              <p className="amount">${totalSpent.toFixed(2)}</p>
              <span className="subtitle">This month</span>
            </div>
          </div>

          <div className="overview-card remaining-card">
            <div className="card-icon">💵</div>
            <div className="card-content">
              <h3>Remaining</h3>
              <p className="amount">${remaining.toFixed(2)}</p>
              <span className="subtitle">Available to spend</span>
            </div>
          </div>
        </div>

        {/* Budget Alert */}
        {totalSpent >= 0.9 * totalBudget && totalBudget > 0 && (
          <div className="alert alert-warning">
            ⚠️ Warning: You're close to exceeding your budget! You've spent ${totalSpent.toFixed(2)} of your $
            {totalBudget.toFixed(2)} budget.
          </div>
        )}

        <div className="dashboard-grid">
          {/* Budget Management */}
          <div className="card">
            <div className="card-header">
              <h2>Set Monthly Budget</h2>
              <p>Set your spending limits for each category</p>
            </div>
            <div className="card-body">
              <form onSubmit={updateBudget} className="budget-form">
                <div className="form-row">
                  <select
                    value={budgetForm.category}
                    onChange={(e) => setBudgetForm((prev) => ({ ...prev, category: e.target.value }))}
                    className="form-input"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={budgetForm.amount}
                    onChange={(e) => setBudgetForm((prev) => ({ ...prev, amount: e.target.value }))}
                    className="form-input"
                    step="0.01"
                  />
                  <button type="submit" className="btn btn-primary">
                    Set Budget
                  </button>
                </div>
              </form>

              <div className="budget-list">
                {CATEGORIES.map((category, index) => {
                  const budget = budgets[category] || 0
                  const spent = spentPerCategory[category] || 0
                  const percentage = budget > 0 ? (spent / budget) * 100 : 0

                  return (
                    <div key={category} className="budget-item">
                      <div className="budget-info">
                        <span className="category-name" style={{ color: COLORS[index] }}>
                          {category}
                        </span>
                        <div className="budget-amounts">
                          <span className="spent">${spent.toFixed(2)}</span>
                          <span className="separator">/</span>
                          <span className="budget">${budget.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                            backgroundColor: COLORS[index],
                          }}
                        ></div>
                      </div>
                      <span className="percentage">{percentage.toFixed(1)}%</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="card">
            <div className="card-header">
              <h2>Financial Overview</h2>
            </div>
            <div className="card-body">
              <div className="chart-tabs">
                <div className="chart-section">
                  <h3>Spending Distribution</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, value }) => `${name}: $${value.toFixed(0)}`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-section">
                  <h3>Budget vs Spending</h3>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, ""]} />
                        <Bar dataKey="budget" fill="#e5e7eb" name="Budget" />
                        <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Expense */}
        <div className="card">
          <div className="card-header">
            <h2>Add New Expense</h2>
          </div>
          <div className="card-body">
            <form onSubmit={addExpense} className="expense-form">
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, description: e.target.value }))}
                  className="form-input"
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, amount: e.target.value }))}
                  className="form-input"
                  step="0.01"
                  required
                />
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, category: e.target.value }))}
                  className="form-input"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense((prev) => ({ ...prev, date: e.target.value }))}
                  className="form-input"
                />
                <button type="submit" className="btn btn-primary">
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Expense List */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Expenses</h2>
            <div className="filter-section">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="form-input filter-select"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="card-body">
            <div className="expense-list">
              {filteredExpenses.length === 0 ? (
                <div className="empty-state">
                  <p>No expenses found</p>
                </div>
              ) : (
                filteredExpenses.map((expense) => (
                  <div key={expense.id} className="expense-item">
                    <div className="expense-info">
                      <div className="expense-description">{expense.description}</div>
                      <div className="expense-meta">
                        <span className="expense-category">{expense.category}</span>
                        <span className="expense-date">{expense.date}</span>
                      </div>
                    </div>
                    <div className="expense-actions">
                      <span className="expense-amount">${expense.amount.toFixed(2)}</span>
                      <button onClick={() => deleteExpense(expense.id)} className="btn btn-danger btn-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
