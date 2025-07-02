import React, { useContext, useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import UserProfile from './UserProfile';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const [showWelcome, setShowWelcome] = useState(true);

  const toggleProfile = () => {
    console.log('Profile icon clicked, toggling profileOpen from', profileOpen, 'to', !profileOpen);
    setProfileOpen(!profileOpen);
  };

  // Close profile dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto hide welcome alert after 3 seconds
  useEffect(() => {
    if (user) {
      setShowWelcome(true);
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <nav className="navbar" style={{ position: 'relative' }}>
      <div className="navbar-title"></div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginLeft: 'auto', position: 'relative' }}>
        {showWelcome && user && (
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '0',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontWeight: '600',
            fontSize: '14px',
            zIndex: 1000,
            whiteSpace: 'nowrap',
          }}>
            Welcome, {user.username}!
          </div>
        )}
        {user && location.pathname !== '/' && (
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
            Dashboard
          </NavLink>
        )}
        {user ? (
          <>
            <button onClick={logout} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', cursor: 'pointer' }}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="navbar-link">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
