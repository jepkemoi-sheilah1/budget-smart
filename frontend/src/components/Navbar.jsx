import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeStyle = {
    fontWeight: 'bold',
    color: 'blue',
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      borderBottom: '1px solid #ccc',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ fontWeight: 'bold', fontSize: 24 }}>
        Expense Tracker
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
          Dashboard
        </NavLink>
        <NavLink to="/login" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
          Log in
        </NavLink>
        <NavLink to="/register" style={({ isActive }) => (isActive ? activeStyle : undefined)}>
          <button style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: 16
          }}>
            Sign up
          </button>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
