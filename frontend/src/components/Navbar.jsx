import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const activeStyle = {
    fontWeight: 'bold',
    color: '#004080', // dark blue
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 20px',
      borderBottom: '1px solid #3399ff', // lighter blue
      backgroundColor: '#cce6ff', // very light blue
      fontFamily: 'Arial, sans-serif',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ fontWeight: 'bold', fontSize: 24, color: '#003366' /* dark navy blue */ }}>
        Budget Smart
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : {color: '#0066cc'})}>
          Dashboard
        </NavLink>
        <NavLink to="/login" style={({ isActive }) => (isActive ? activeStyle : {color: '#0066cc'})}>
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
