import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    if (user) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
          <span className="text-xl font-bold text-slate-900">Spent<span className="text-blue-600">wise</span></span>

          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {user && showWelcome && (
              <span className="text-sm text-slate-500 font-medium">
                👋 Welcome, <span className="text-blue-600 font-semibold">{user.username}</span>
              </span>
            )}
            {user && location.pathname !== '/' && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 font-semibold text-sm"
                    : "text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"
                }
              >
                Dashboard
              </NavLink>
            )}
            {user ? (
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/login"
                  className="text-slate-600 hover:text-blue-600 font-medium text-sm transition-colors"
                >
                  Log In
                </NavLink>
                <NavLink to="/register">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                    Get Started
                  </button>
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-slate-600 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 flex flex-col gap-4">
          {user && (
            <span className="text-sm text-slate-500">
              👋 Welcome, <span className="text-blue-600 font-semibold">{user.username}</span>
            </span>
          )}
          {user && (
            <NavLink to="/dashboard" className="text-slate-700 font-medium text-sm" onClick={() => setMenuOpen(false)}>
              Dashboard
            </NavLink>
          )}
          {user ? (
            <button
              onClick={() => { logout(); setMenuOpen(false); }}
              className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg w-full"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" className="text-slate-700 font-medium text-sm" onClick={() => setMenuOpen(false)}>
                Log In
              </NavLink>
              <NavLink to="/register" onClick={() => setMenuOpen(false)}>
                <button className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg w-full">
                  Get Started
                </button>
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;