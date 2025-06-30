const API_BASE_URL = process.env.NODE_ENV === "production" ? "https://your-backend-url.com" : "http://localhost:5000"

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Network error" }))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }
    return response.json()
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password }),
    })
    return this.handleResponse(response)
  }

  async register(username: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ username, email, password }),
    })
    return this.handleResponse(response)
  }

  async forgotPassword(email: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email }),
    })
    return this.handleResponse(response)
  }

  async resetPassword(token: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ token, password }),
    })
    return this.handleResponse(response)
  }

  // User Management
  async getUserProfile() {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async updateProfile(data: { username?: string; email?: string }) {
    const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/api/user/change-password`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    return this.handleResponse(response)
  }

  async exportData() {
    const response = await fetch(`${API_BASE_URL}/api/user/export-data`, {
      headers: this.getAuthHeaders(),
    })
    if (!response.ok) {
      throw new Error("Failed to export data")
    }
    return response.blob()
  }

  async deleteAccount() {
    const response = await fetch(`${API_BASE_URL}/api/user/delete-account`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // Budget Management
  async getBudgets(month?: number, year?: number) {
    const params = new URLSearchParams()
    if (month) params.append("month", month.toString())
    if (year) params.append("year", year.toString())

    const response = await fetch(`${API_BASE_URL}/api/budgets?${params}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async setBudget(category: string, amount: number, month?: number, year?: number) {
    const response = await fetch(`${API_BASE_URL}/api/budgets`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ category, amount, month, year }),
    })
    return this.handleResponse(response)
  }

  // Expense Management
  async getExpenses(filters?: { category?: string; start_date?: string; end_date?: string }) {
    const params = new URLSearchParams()
    if (filters?.category) params.append("category", filters.category)
    if (filters?.start_date) params.append("start_date", filters.start_date)
    if (filters?.end_date) params.append("end_date", filters.end_date)

    const response = await fetch(`${API_BASE_URL}/api/expenses?${params}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  async addExpense(data: { description: string; amount: number; category: string; date?: string }) {
    const response = await fetch(`${API_BASE_URL}/api/expenses`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async updateExpense(id: number, data: { description?: string; amount?: number; category?: string; date?: string }) {
    const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })
    return this.handleResponse(response)
  }

  async deleteExpense(id: number) {
    const response = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }

  // Analytics
  async getSummary(month?: number, year?: number) {
    const params = new URLSearchParams()
    if (month) params.append("month", month.toString())
    if (year) params.append("year", year.toString())

    const response = await fetch(`${API_BASE_URL}/api/analytics/summary?${params}`, {
      headers: this.getAuthHeaders(),
    })
    return this.handleResponse(response)
  }
}

export const apiClient = new ApiClient()
