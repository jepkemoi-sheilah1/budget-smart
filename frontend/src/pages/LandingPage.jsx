import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/temp-styles.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1 className="landing-title">Welcome to Budget Smart</h1>
      <p className="landing-subtitle">Please log in or register to continue.</p>
      <div className="landing-buttons">
        <NavLink to="/login">
          <button className="landing-button">Log In</button>
        </NavLink>
        <NavLink to="/register">
          <button className="landing-button">Register</button>
        </NavLink>
      </div>
    </div>
  );
};

export default LandingPage;
