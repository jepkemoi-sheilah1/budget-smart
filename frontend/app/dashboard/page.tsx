"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { expenseAPI, budgetAPI, analyticsAPI } from "@/lib/api"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

interface User {
  id: number
  username: string
  email: string
}

interface Expense {
  id: number
  description: string
  amount: number
  category: string
  date: string
}

interface Budget {
  id: number
  category: string
  amount: number
  month: number
  year: number
}

interface Summary {
  total_expenses: number
  total_budget: number
  remaining_budget: number
  expense_count: number
  month: number
  year: number
}

interface CategoryData {
  category: string
  amount: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Form states
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [expenseForm, setExpenseForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [budgetForm, setBudgetForm] = useState({
    category: "",
    amount: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  })

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    loadDashboardData()
  }, [router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load all data in parallel
      const [expensesRes, budgetsRes, summaryRes] = await Promise.all([
        expenseAPI.getExpenses({ limit: 10 }),
        budgetAPI.getBudgets({
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        }),
        analyticsAPI.getSummary(),
      ])

      setExpenses(expensesRes.expenses)
      setBudgets(budgetsRes.budgets)
      setSummary(summaryRes.summary)
      setCategoryData(summaryRes.category_breakdown)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard data")
      if (err instanceof Error && err.message.includes("401")) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await expenseAPI.createExpense({
        description: expenseForm.description,
        amount: Number.parseFloat(expenseForm.amount),
        category: expenseForm.category,
        date: expenseForm.date,
      })

      setExpenseForm({
        description: "",
        amount: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
      })
      setShowExpenseForm(false)
      loadDashboardData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add expense")
    }
  }

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await budgetAPI.createBudget({
        category: budgetForm.category,
        amount: Number.parseFloat(budgetForm.amount),
        month: budgetForm.month,
        year: budgetForm.year,
      })

      setBudgetForm({
        category: "",
        amount: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      })
      setShowBudgetForm(false)
      loadDashboardData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add budget")
    }
  }

  const handleDeleteExpense = async (id: number) => {
    try {
      await expenseAPI.deleteExpense(id)
      loadDashboardData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete expense")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Budget Smart</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username}</span>
              <Button variant="outline" onClick={() => router.push("/profile")}>
                Profile
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">${summary.total_expenses.toFixed(2)}</div>
                <p className="text-xs text-gray-500 mt-1">{summary.expense_count} transactions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">${summary.total_budget.toFixed(2)}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {summary.month}/{summary.year}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Remaining Budget</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${summary.remaining_budget >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  ${summary.remaining_budget.toFixed(2)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {summary.total_budget > 0
                    ? `${((summary.total_expenses / summary.total_budget) * 100).toFixed(1)}% used`
                    : "No budget set"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Budget Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant={summary.remaining_budget >= 0 ? "default" : "destructive"} className="text-sm">
                  {summary.remaining_budget >= 0 ? "On Track" : "Over Budget"}
                </Badge>
                <p className="text-xs text-gray-500 mt-2">Current month status</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Current month breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  No expense data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Budget Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Progress</CardTitle>
              <CardDescription>Current month budget vs expenses</CardDescription>
            </CardHeader>
            <CardContent>
              {budgets.length > 0 ? (
                <div className="space-y-4">
                  {budgets.map((budget) => {
                    const spent = categoryData.find((c) => c.category === budget.category)?.amount || 0
                    const percentage = (spent / budget.amount) * 100

                    return (
                      <div key={budget.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{budget.category}</span>
                          <span>
                            ${spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              percentage > 100 ? "bg-red-500" : percentage > 80 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">{percentage.toFixed(1)}% used</div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-gray-500">
                  No budgets set for this month
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Add Expense</CardTitle>
              <CardDescription>Add a new expense quickly</CardDescription>
            </CardHeader>
            <CardContent>
              {!showExpenseForm ? (
                <Button onClick={() => setShowExpenseForm(true)} className="w-full">
                  Add New Expense
                </Button>
              ) : (
                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={expenseForm.description}
                      onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={expenseForm.amount}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={expenseForm.category}
                      onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">Add Expense</Button>
                    <Button type="button" variant="outline" onClick={() => setShowExpenseForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Add Budget</CardTitle>
              <CardDescription>Set a budget for a category</CardDescription>
            </CardHeader>
            <CardContent>
              {!showBudgetForm ? (
                <Button onClick={() => setShowBudgetForm(true)} className="w-full">
                  Add New Budget
                </Button>
              ) : (
                <form onSubmit={handleAddBudget} className="space-y-4">
                  <div>
                    <Label htmlFor="budget-category">Category</Label>
                    <Input
                      id="budget-category"
                      value={budgetForm.category}
                      onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget-amount">Amount</Label>
                    <Input
                      id="budget-amount"
                      type="number"
                      step="0.01"
                      value={budgetForm.amount}
                      onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget-month">Month</Label>
                    <Input
                      id="budget-month"
                      type="number"
                      min="1"
                      max="12"
                      value={budgetForm.month}
                      onChange={(e) => setBudgetForm({ ...budgetForm, month: Number.parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget-year">Year</Label>
                    <Input
                      id="budget-year"
                      type="number"
                      min="2000"
                      value={budgetForm.year}
                      onChange={(e) => setBudgetForm({ ...budgetForm, year: Number.parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">Add Budget</Button>
                    <Button type="button" variant="outline" onClick={() => setShowBudgetForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-gray-500">
                            {expense.category} • {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-bold text-red-600">-${expense.amount.toFixed(2)}</span>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteExpense(expense.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">No expenses found. Add your first expense above!</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
