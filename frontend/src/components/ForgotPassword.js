"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:5000/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("If an account with that email exists, a password reset link has been sent.")
      } else {
        setError(data.error || "Failed to send reset email")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">$</div>
            <h1 className="auth-title">Budget Smart</h1>
          </div>
          <p className="auth-subtitle">Reset your password</p>
        </div>

        <div className="auth-form">
          {error && <div className="alert alert-danger">{error}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login" className="auth-link">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
