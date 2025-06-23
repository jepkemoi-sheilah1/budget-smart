import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeStyle = {
    fontWeight: 'bold',
    color: 'blue',
  };

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
      borderTop: '1px solid #ccc',
      backgroundColor: '#fff',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      fontSize: 24
    }}>
      <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : undefined)} aria-label="home">
        🏠
      </NavLink>
      <NavLink to="/register" style={({ isActive }) => (isActive ? activeStyle : undefined)} aria-label="register">
        ➕
      </NavLink>
      <NavLink to="/login" style={({ isActive }) => (isActive ? activeStyle : undefined)} aria-label="login">
        ⏰
      </NavLink>
      <NavLink to="/settings" style={({ isActive }) => (isActive ? activeStyle : undefined)} aria-label="settings">
        ⚙️
      </NavLink>
    </nav>
  );
};

export default Navbar;
