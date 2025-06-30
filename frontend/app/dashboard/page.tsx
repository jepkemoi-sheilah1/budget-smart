"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { authAPI, expenseAPI, budgetAPI, analyticsAPI } from "@/lib/api"

interface User {
  id: number
  username: string
  email: string
  created_at: string
}

interface Expense {
  id: number
  description: string
  amount: number
  category: string
  date: string
  created_at: string
}

interface Budget {
  id: number
  category: string
  amount: number
  month: number
  year: number
  created_at: string
}

interface Summary {
  total_expenses: number
  total_budget: number
  remaining_budget: number
  month: number
  year: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
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
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Verify token and get user
      const userResponse = await authAPI.verifyToken()
      setUser(userResponse.user)

      // Load expenses
      const expensesResponse = await expenseAPI.getExpenses({ limit: 10 })
      setExpenses(expensesResponse.expenses)

      // Load budgets
      const budgetsResponse = await budgetAPI.getBudgets()
      setBudgets(budgetsResponse.budgets)

      // Load summary
      const summaryResponse = await analyticsAPI.getSummary()
      setSummary(summaryResponse.summary)
    } catch (err) {
      console.error("Dashboard load error:", err)
      setError("Failed to load dashboard data")
      // If token is invalid, redirect to login
      if (err instanceof Error && err.message.includes("401")) {
        authAPI.logout()
        router.push("/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    authAPI.logout()
    router.push("/login")
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
      loadDashboardData() // Reload data
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
      setBudgetForm(false)
      loadDashboardData() // Reload data
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add budget")
    }
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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Budget Smart</h1>
              <p className="text-gray-600">Welcome back, {user?.username}!</p>
            </div>
            <div className="flex space-x-4">
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

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Expenses</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">${summary.total_expenses.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Budget</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">${summary.total_budget.toFixed(2)}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Remaining Budget</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-3xl font-bold ${summary.remaining_budget >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  ${summary.remaining_budget.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Expenses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </div>
              <Button onClick={() => setShowExpenseForm(!showExpenseForm)}>Add Expense</Button>
            </CardHeader>
            <CardContent>
              {showExpenseForm && (
                <form onSubmit={handleAddExpense} className="space-y-4 mb-6 p-4 border rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">Add Expense</Button>
                    <Button type="button" variant="outline" onClick={() => setShowExpenseForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {expenses.length > 0 ? (
                  expenses.map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-gray-600">{expense.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">${expense.amount.toFixed(2)}</p>
                        <Badge variant="secondary">{expense.category}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No expenses yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Budgets */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Budgets</CardTitle>
                <CardDescription>Your spending limits</CardDescription>
              </div>
              <Button onClick={() => setShowBudgetForm(!showBudgetForm)}>Add Budget</Button>
            </CardHeader>
            <CardContent>
              {showBudgetForm && (
                <form onSubmit={handleAddBudget} className="space-y-4 mb-6 p-4 border rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budgetCategory">Category</Label>
                      <Input
                        id="budgetCategory"
                        value={budgetForm.category}
                        onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="budgetAmount">Amount</Label>
                      <Input
                        id="budgetAmount"
                        type="number"
                        step="0.01"
                        value={budgetForm.amount}
                        onChange={(e) => setBudgetForm({ ...budgetForm, amount: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budgetMonth">Month</Label>
                      <Input
                        id="budgetMonth"
                        type="number"
                        min="1"
                        max="12"
                        value={budgetForm.month}
                        onChange={(e) => setBudgetForm({ ...budgetForm, month: Number.parseInt(e.target.value) })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="budgetYear">Year</Label>
                      <Input
                        id="budgetYear"
                        type="number"
                        value={budgetForm.year}
                        onChange={(e) => setBudgetForm({ ...budgetForm, year: Number.parseInt(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit">Add Budget</Button>
                    <Button type="button" variant="outline" onClick={() => setShowBudgetForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {budgets.length > 0 ? (
                  budgets.map((budget) => (
                    <div key={budget.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{budget.category}</p>
                        <p className="text-sm text-gray-600">
                          {budget.month}/{budget.year}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">${budget.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No budgets set yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
