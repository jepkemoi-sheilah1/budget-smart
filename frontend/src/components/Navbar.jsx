import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">Budget Smart</div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <NavLink to="/" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
          Dashboard
        </NavLink>
        <NavLink to="/login" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
          Log in
        </NavLink>
        <NavLink to="/register" className={({ isActive }) => isActive ? "navbar-link active" : "navbar-link"}>
          <button className="navbar-button">
            Sign up
          </button>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
