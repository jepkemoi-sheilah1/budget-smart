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
            <div ref={profileRef} style={{ position: 'relative', cursor: 'pointer' }} onClick={toggleProfile} aria-label="User Profile">
              <svg xmlns="http://www.w3.org/2000/svg" fill="#2563eb" viewBox="0 0 24 24" width="24" height="24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              {profileOpen && <UserProfile user={user} onClose={() => setProfileOpen(false)} logout={logout} />}
            </div>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
