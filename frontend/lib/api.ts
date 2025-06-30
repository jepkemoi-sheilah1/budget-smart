const API_BASE_URL = "http://localhost:5000/api"

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token")
  }
  return null
}

// Set auth token in localStorage
const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token)
  }
}

// Remove auth token from localStorage
const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token")
  }
}

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Network error" }))
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    if (data.access_token) {
      setAuthToken(data.access_token)
    }

    return data
  },

  register: async (username: string, email: string, password: string) => {
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    })

    if (data.access_token) {
      setAuthToken(data.access_token)
    }

    return data
  },

  logout: () => {
    removeAuthToken()
  },

  forgotPassword: async (email: string) => {
    return apiRequest("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },

  resetPassword: async (token: string, password: string) => {
    return apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
    })
  },

  verifyToken: async () => {
    return apiRequest("/auth/verify")
  },
}

// User API functions
export const userAPI = {
  getProfile: async () => {
    return apiRequest("/user/profile")
  },

  updateProfile: async (username: string, email: string) => {
    return apiRequest("/user/profile", {
      method: "PUT",
      body: JSON.stringify({ username, email }),
    })
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    return apiRequest("/user/change-password", {
      method: "POST",
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    })
  },

  exportData: async () => {
    return apiRequest("/user/export-data")
  },

  deleteAccount: async (password: string) => {
    return apiRequest("/user/delete-account", {
      method: "DELETE",
      body: JSON.stringify({ password }),
    })
  },
}

// Expense API functions
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

    const endpoint = `/expenses${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    return apiRequest(endpoint)
  },

  createExpense: async (expense: {
    description: string
    amount: number
    category: string
    date?: string
  }) => {
    return apiRequest("/expenses", {
      method: "POST",
      body: JSON.stringify(expense),
    })
  },

  updateExpense: async (
    id: number,
    expense: {
      description?: string
      amount?: number
      category?: string
      date?: string
    },
  ) => {
    return apiRequest(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(expense),
    })
  },

  deleteExpense: async (id: number) => {
    return apiRequest(`/expenses/${id}`, {
      method: "DELETE",
    })
  },
}

// Budget API functions
export const budgetAPI = {
  getBudgets: async (params?: {
    month?: number
    year?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const endpoint = `/budgets${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    return apiRequest(endpoint)
  },

  createBudget: async (budget: {
    category: string
    amount: number
    month: number
    year: number
  }) => {
    return apiRequest("/budgets", {
      method: "POST",
      body: JSON.stringify(budget),
    })
  },

  updateBudget: async (
    id: number,
    budget: {
      category?: string
      amount?: number
      month?: number
      year?: number
    },
  ) => {
    return apiRequest(`/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(budget),
    })
  },

  deleteBudget: async (id: number) => {
    return apiRequest(`/budgets/${id}`, {
      method: "DELETE",
    })
  },
}

// Analytics API functions
export const analyticsAPI = {
  getSummary: async (params?: {
    month?: number
    year?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
    }

    const endpoint = `/analytics/summary${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
    return apiRequest(endpoint)
  },

  getTrends: async () => {
    return apiRequest("/analytics/trends")
  },
}

// Health check
export const healthCheck = async () => {
  return apiRequest("/health")
}
