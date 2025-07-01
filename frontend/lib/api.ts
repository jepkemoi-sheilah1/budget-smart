const API_BASE_URL = "http://127.0.0.1:5000/api"

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Network error" }))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse(response)
  },

  register: async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
    return handleResponse(response)
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    return handleResponse(response)
  },

  resetPassword: async (token: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })
    return handleResponse(response)
  },

  verifyToken: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },
}

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  updateProfile: async (data: { username?: string; email?: string }) => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/user/change-password`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    })
    return handleResponse(response)
  },

  exportData: async () => {
    const response = await fetch(`${API_BASE_URL}/user/export-data`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  deleteAccount: async (password: string) => {
    const response = await fetch(`${API_BASE_URL}/user/delete-account`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: JSON.stringify({ password }),
    })
    return handleResponse(response)
  },
}

// Expense API
export const expenseAPI = {
  getExpenses: async (params?: {
    category?: string
    start_date?: string
    end_date?: string
    limit?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(`${API_BASE_URL}/expenses?${queryParams}`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  createExpense: async (data: {
    description: string
    amount: number
    category: string
    date?: string
  }) => {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  updateExpense: async (
    id: number,
    data: {
      description?: string
      amount?: number
      category?: string
      date?: string
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  deleteExpense: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/expenses/categories`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },
}

// Budget API
export const budgetAPI = {
  getBudgets: async (params?: { month?: number; year?: number }) => {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(`${API_BASE_URL}/budgets?${queryParams}`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  createBudget: async (data: {
    category: string
    amount: number
    month: number
    year: number
  }) => {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  updateBudget: async (
    id: number,
    data: {
      category?: string
      amount?: number
      month?: number
      year?: number
    },
  ) => {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  deleteBudget: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/budgets/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },
}

// Analytics API
export const analyticsAPI = {
  getSummary: async (params?: { month?: number; year?: number }) => {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(`${API_BASE_URL}/analytics/summary?${queryParams}`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  getMonthlyAnalytics: async (year?: number) => {
    const queryParams = year ? `?year=${year}` : ""
    const response = await fetch(`${API_BASE_URL}/analytics/monthly${queryParams}`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },

  getBudgetVsActual: async (params?: { month?: number; year?: number }) => {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const response = await fetch(`${API_BASE_URL}/analytics/budget-vs-actual?${queryParams}`, {
      headers: getAuthHeaders(),
    })
    return handleResponse(response)
  },
}

// Health check
export const healthAPI = {
  check: async () => {
    const response = await fetch(`${API_BASE_URL}/health`)
    return handleResponse(response)
  },
}
