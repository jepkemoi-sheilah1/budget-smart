"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Password reset instructions have been sent to your email.")
        setEmailSent(true)
      } else {
        setError(data.error || "Failed to send reset email")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="success-icon">✉️</div>
            <h1 className="auth-title">Check your email</h1>
            <p className="auth-subtitle">We've sent password reset instructions to {email}</p>
          </div>

          <div className="auth-form">
            <div className="alert alert-success">{message}</div>

            <div className="auth-links">
              <p>Didn't receive the email? Check your spam folder or</p>
              <button
                onClick={() => {
                  setEmailSent(false)
                  setEmail("")
                  setMessage("")
                }}
                className="auth-link"
              >
                try again
              </button>
            </div>

            <Link to="/login" className="btn btn-secondary btn-lg">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">$</div>
            <h1 className="auth-title">Forgot Password?</h1>
          </div>
          <p className="auth-subtitle">Enter your email address and we'll send you a link to reset your password</p>
        </div>

        <div className="auth-form">
          {error && <div className="alert alert-danger">{error}</div>}

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
                autoComplete="email"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Instructions"}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login" className="auth-link">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
