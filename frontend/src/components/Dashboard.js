"use client"

import { useState, useEffect } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import "./Dashboard.css"

const Dashboard = ({ user, token }) => {
  const [expenses, setExpenses] = useState([])
  const [budgets, setBudgets] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddBudget, setShowAddBudget] = useState(false)
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  })

  const categories = [
    "Food",
    "Transportation",
    "Housing",
    "Entertainment",
    "Healthcare",
    "Shopping",
    "Utilities",
    "Education",
    "Travel",
    "Other",
  ]

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FFC658",
    "#FF7C7C",
    "#8DD1E1",
    "#D084D0",
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }

      // Fetch expenses
      const expensesResponse = await fetch("http://127.0.0.1:5000/api/expenses", { headers })
      const expensesData = await expensesResponse.json()

      // Fetch budgets
      const budgetsResponse = await fetch("http://127.0.0.1:5000/api/budgets", { headers })
      const budgetsData = await budgetsResponse.json()

      // Fetch analytics
      const analyticsResponse = await fetch("http://127.0.0.1:5000/api/analytics/summary", { headers })
      const analyticsData = await analyticsResponse.json()

      if (expensesResponse.ok) setExpenses(expensesData.expenses || [])
      if (budgetsResponse.ok) setBudgets(budgetsData.budgets || [])
      if (analyticsResponse.ok) setAnalytics(analyticsData)
    } catch (err) {
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://127.0.0.1:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newExpense,
          amount: Number.parseFloat(newExpense.amount),
        }),
      })

      if (response.ok) {
        setNewExpense({
          description: "",
          amount: "",
          category: "",
          date: new Date().toISOString().split("T")[0],
        })
        setShowAddExpense(false)
        fetchData()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to add expense")
      }
    } catch (err) {
      setError("Failed to add expense")
    }
  }

  const handleAddBudget = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://127.0.0.1:5000/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newBudget,
          amount: Number.parseFloat(newBudget.amount),
        }),
      })

      if (response.ok) {
        setNewBudget({
          category: "",
          amount: "",
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        })
        setShowAddBudget(false)
        fetchData()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to add budget")
      }
    } catch (err) {
      setError("Failed to add budget")
    }
  }

  const handleDeleteExpense = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/expenses/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          fetchData()
        } else {
          setError("Failed to delete expense")
        }
      } catch (err) {
        setError("Failed to delete expense")
      }
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}!</h1>
        <p>Here's your financial overview</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Expenses</h3>
            <p className="card-amount">${analytics?.total_expenses?.toFixed(2) || "0.00"}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <h3>Total Budget</h3>
            <p className="card-amount">${analytics?.total_budget?.toFixed(2) || "0.00"}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Remaining Budget</h3>
            <p className={`card-amount ${analytics?.remaining_budget < 0 ? "negative" : ""}`}>
              ${analytics?.remaining_budget?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon">📝</div>
          <div className="card-content">
            <h3>Total Transactions</h3>
            <p className="card-amount">{analytics?.expense_count || 0}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>Expense Categories</h3>
          {analytics?.category_breakdown?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.category_breakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, amount }) => `${category}: $${amount.toFixed(2)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {analytics.category_breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No expense data available</div>
          )}
        </div>

        <div className="chart-container">
          <h3>Budget vs Actual</h3>
          {budgets.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgets}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Budget" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No budget data available</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="btn btn-primary" onClick={() => setShowAddExpense(true)}>
          Add Expense
        </button>
        <button className="btn btn-secondary" onClick={() => setShowAddBudget(true)}>
          Set Budget
        </button>
      </div>

      {/* Recent Expenses */}
      <div className="recent-expenses">
        <h3>Recent Expenses</h3>
        {expenses.length > 0 ? (
          <div className="expenses-list">
            {expenses.slice(0, 5).map((expense) => (
              <div key={expense.id} className="expense-item">
                <div className="expense-info">
                  <h4>{expense.description}</h4>
                  <p>
                    {expense.category} • {expense.date}
                  </p>
                </div>
                <div className="expense-amount">${expense.amount.toFixed(2)}</div>
                <button className="btn-delete" onClick={() => handleDeleteExpense(expense.id)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">No expenses found</div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Expense</h3>
              <button className="modal-close" onClick={() => setShowAddExpense(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="modal-form">
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddExpense(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Budget Modal */}
      {showAddBudget && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Set Budget</h3>
              <button className="modal-close" onClick={() => setShowAddBudget(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleAddBudget} className="modal-form">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={newBudget.amount}
                  onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Month</label>
                <select
                  value={newBudget.month}
                  onChange={(e) => setNewBudget({ ...newBudget, month: Number.parseInt(e.target.value) })}
                  required
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("default", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Year</label>
                <input
                  type="number"
                  value={newBudget.year}
                  onChange={(e) => setNewBudget({ ...newBudget, year: Number.parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddBudget(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Set Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
