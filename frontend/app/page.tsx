"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import {
  Home,
  Car,
  Utensils,
  Gamepad2,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  LogOut,
  Settings,
  ShoppingBag,
  Heart,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"

interface Expense {
  id: number
  description: string
  amount: number
  category: string
  date: string
}

interface Budget {
  [key: string]: number
}

const CATEGORIES = ["Housing", "Food", "Transportation", "Entertainment", "Healthcare", "Shopping"]
const CATEGORY_ICONS = {
  Housing: Home,
  Food: Utensils,
  Transportation: Car,
  Entertainment: Gamepad2,
  Healthcare: Heart,
  Shopping: ShoppingBag,
}
const COLORS = ["#2563eb", "#7c3aed", "#dc2626", "#ea580c", "#059669", "#d97706"]

export default function Dashboard() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<any | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "Housing",
    date: new Date().toISOString().split("T")[0],
  })
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [budgetForm, setBudgetForm] = useState({
    category: "Housing",
    amount: "",
  })
  const [filterCategory, setFilterCategory] = useState("All")
  const [filterStartDate, setFilterStartDate] = useState("")
  const [filterEndDate, setFilterEndDate] = useState("")

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      fetchData()
    }
  }, [isLoggedIn])

  const checkAuth = async () => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        setUserData(user)
        setIsLoggedIn(true)
      } catch (err) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/login")
      }
    } else {
      router.push("/login")
    }
    setLoading(false)
  }

  const fetchData = async () => {
    try {
      setError("")

      // Fetch expenses and budgets in parallel
      const [expensesData, budgetsData] = await Promise.all([apiClient.getExpenses(), apiClient.getBudgets()])

      setExpenses(expensesData)
      setBudgets(budgetsData)
    } catch (err: any) {
      setError(err.message || "Failed to load data")
      if (err.message.includes("Token") || err.message.includes("401")) {
        handleLogout()
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setUserData(null)
    router.push("/login")
  }

  const addExpense = async () => {
    if (!newExpense.description || !newExpense.amount) return

    try {
      setError("")
      const expenseData = await apiClient.addExpense({
        description: newExpense.description,
        amount: Number.parseFloat(newExpense.amount),
        category: newExpense.category,
        date: newExpense.date,
      })

      setExpenses((prev) => [expenseData, ...prev])
      setNewExpense({
        description: "",
        amount: "",
        category: "Housing",
        date: new Date().toISOString().split("T")[0],
      })
      setSuccess("Expense added successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to add expense")
    }
  }

  const updateExpense = async (updatedExpense: Expense) => {
    try {
      setError("")
      await apiClient.updateExpense(updatedExpense.id, {
        description: updatedExpense.description,
        amount: updatedExpense.amount,
        category: updatedExpense.category,
        date: updatedExpense.date,
      })

      setExpenses((prev) => prev.map((exp) => (exp.id === updatedExpense.id ? updatedExpense : exp)))
      setEditingExpense(null)
      setSuccess("Expense updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to update expense")
    }
  }

  const deleteExpense = async (id: number) => {
    if (!confirm("Are you sure you want to delete this expense?")) return

    try {
      setError("")
      await apiClient.deleteExpense(id)
      setExpenses((prev) => prev.filter((exp) => exp.id !== id))
      setSuccess("Expense deleted successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to delete expense")
    }
  }

  const updateBudget = async () => {
    if (!budgetForm.amount) return

    try {
      setError("")
      await apiClient.setBudget(budgetForm.category, Number.parseFloat(budgetForm.amount))

      setBudgets((prev) => ({
        ...prev,
        [budgetForm.category]: Number.parseFloat(budgetForm.amount),
      }))
      setBudgetForm({ category: "Housing", amount: "" })
      setSuccess("Budget updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to update budget")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // Will redirect to login
  }

  const totalSpent = expenses.reduce((total, expense) => total + expense.amount, 0)
  const totalBudget = Object.values(budgets).reduce((total, amount) => total + amount, 0)
  const remaining = totalBudget - totalSpent

  const spentPerCategory = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const startDate = filterStartDate ? new Date(filterStartDate) : null
    const endDate = filterEndDate ? new Date(filterEndDate) : null

    const categoryMatch = filterCategory === "All" || expense.category === filterCategory
    const startDateMatch = !startDate || expenseDate >= startDate
    const endDateMatch = !endDate || expenseDate <= endDate

    return categoryMatch && startDateMatch && endDateMatch
  })

  const chartData = CATEGORIES.map((category, index) => ({
    name: category,
    budget: budgets[category] || 0,
    spent: spentPerCategory[category] || 0,
    color: COLORS[index],
  }))

  const pieData = CATEGORIES.map((category, index) => ({
    name: category,
    value: spentPerCategory[category] || 0,
    color: COLORS[index],
  })).filter((item) => item.value > 0)

  const isNearBudgetLimit = totalSpent >= 0.9 * totalBudget && totalBudget > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Budget Smart
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {userData?.username}!</span>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Take Control of Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financial Future
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track expenses, set budgets, and achieve your financial goals with our intelligent budgeting platform.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Budget Alert */}
        {isNearBudgetLimit && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              Warning: You are close to exceeding your budget! You've spent ${totalSpent.toFixed(2)} of your $
              {totalBudget.toFixed(2)} budget.
            </AlertDescription>
          </Alert>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
              <p className="text-xs text-blue-200">Monthly allocation</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-100">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
              <p className="text-xs text-red-200">This month</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Remaining</CardTitle>
              <DollarSign className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${remaining.toFixed(2)}</div>
              <p className="text-xs text-green-200">Available to spend</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Management */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Set Monthly Budget</CardTitle>
              <CardDescription>Set your spending limits for each category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Select
                  value={budgetForm.category}
                  onValueChange={(value) => setBudgetForm((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center">
                          {React.createElement(CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS], {
                            className: "w-4 h-4 mr-2",
                          })}
                          {category}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Amount"
                  value={budgetForm.amount}
                  onChange={(e) => setBudgetForm((prev) => ({ ...prev, amount: e.target.value }))}
                  className="flex-1"
                />
                <Button
                  onClick={updateBudget}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Set
                </Button>
              </div>

              <div className="space-y-2">
                {CATEGORIES.map((category, index) => {
                  const Icon = CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]
                  const budget = budgets[category] || 0
                  const spent = spentPerCategory[category] || 0
                  const percentage = budget > 0 ? (spent / budget) * 100 : 0

                  return (
                    <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" style={{ color: COLORS[index] }} />
                        <span className="font-medium">{category}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          ${spent.toFixed(2)} / ${budget.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">{percentage.toFixed(1)}% used</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pie" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pie">Distribution</TabsTrigger>
                  <TabsTrigger value="bar">Budget vs Spent</TabsTrigger>
                </TabsList>
                <TabsContent value="pie" className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
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
                </TabsContent>
                <TabsContent value="bar" className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, ""]} />
                      <Bar dataKey="budget" fill="#e5e7eb" name="Budget" />
                      <Bar dataKey="spent" fill="#3b82f6" name="Spent" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Add Expense */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Add New Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense((prev) => ({ ...prev, description: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Amount"
                value={newExpense.amount}
                onChange={(e) => setNewExpense((prev) => ({ ...prev, amount: e.target.value }))}
              />
              <Select
                value={newExpense.category}
                onValueChange={(value) => setNewExpense((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      <div className="flex items-center">
                        {React.createElement(CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS], {
                          className: "w-4 h-4 mr-2",
                        })}
                        {category}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense((prev) => ({ ...prev, date: e.target.value }))}
              />
              <Button
                onClick={addExpense}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Expense List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Expenses</CardTitle>
            <CardDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  placeholder="Start date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="w-40"
                />
                <Input
                  type="date"
                  placeholder="End date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="w-40"
                />
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredExpenses.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No expenses found</p>
              ) : (
                filteredExpenses.map((expense) => {
                  const Icon = CATEGORY_ICONS[expense.category as keyof typeof CATEGORY_ICONS]
                  const isEditing = editingExpense?.id === expense.id

                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {isEditing ? (
                        <div className="flex items-center space-x-4 flex-1">
                          <Input
                            value={editingExpense.description}
                            onChange={(e) =>
                              setEditingExpense((prev) => (prev ? { ...prev, description: e.target.value } : null))
                            }
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            value={editingExpense.amount}
                            onChange={(e) =>
                              setEditingExpense((prev) =>
                                prev ? { ...prev, amount: Number.parseFloat(e.target.value) } : null,
                              )
                            }
                            className="w-24"
                          />
                          <Input
                            type="date"
                            value={editingExpense.date}
                            onChange={(e) =>
                              setEditingExpense((prev) => (prev ? { ...prev, date: e.target.value } : null))
                            }
                            className="w-40"
                          />
                          <div className="flex space-x-2">
                            <Button size="sm" onClick={() => updateExpense(editingExpense)}>
                              Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingExpense(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center space-x-4">
                            <Icon className="w-5 h-5 text-gray-600" />
                            <div>
                              <div className="font-medium">{expense.description}</div>
                              <div className="text-sm text-gray-500">
                                {expense.category} • {expense.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-semibold text-lg">${expense.amount.toFixed(2)}</span>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => setEditingExpense(expense)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => deleteExpense(expense.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
