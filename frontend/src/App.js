"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import "./App.css"

// Import components
import Dashboard from "./components/Dashboard"
import Login from "./components/Login"
import Register from "./components/Register"
import ForgotPassword from "./components/ForgotPassword"
import Profile from "./components/Profile"
import Navbar from "./components/Navbar"
import LoadingScreen from "./components/LoadingScreen"

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          const response = await fetch("/api/user/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
            setIsLoggedIn(true)
          } else {
            localStorage.removeItem("token")
          }
        } catch (error) {
          console.error("Auth check failed:", error)
          localStorage.removeItem("token")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token)
    setUser(userData)
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setIsLoggedIn(false)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Router>
      <div className="App">
        {isLoggedIn && <Navbar user={user} onLogout={handleLogout} />}

        <main className="main-content">
          <Routes>
            {/* Public routes */}
            <Route
              path="/login"
              element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" replace />}
            />
            <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/dashboard" replace />} />
            <Route
              path="/forgot-password"
              element={!isLoggedIn ? <ForgotPassword /> : <Navigate to="/dashboard" replace />}
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/profile"
              element={isLoggedIn ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" replace />}
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
