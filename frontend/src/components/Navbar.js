"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/dashboard" className="navbar-brand">
            <div className="brand-icon">$</div>
            <span className="brand-text">Budget Smart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-nav desktop-nav">
            <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
              Dashboard
            </Link>
            <Link to="/profile" className={`nav-link ${isActive("/profile") ? "active" : ""}`}>
              Profile
            </Link>
          </div>

          {/* User Menu */}
          <div className="navbar-user">
            <div className="user-info">
              <div className="user-avatar">{user?.username?.charAt(0).toUpperCase() || "U"}</div>
              <span className="user-name desktop-only">{user?.username}</span>
            </div>
            <button onClick={onLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-nav">
            <Link
              to="/dashboard"
              className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`nav-link ${isActive("/profile") ? "active" : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
