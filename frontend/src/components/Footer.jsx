import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span className="text-lg font-bold text-white">
              Spent<span className="text-blue-400">wise</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <NavLink to="/" className="hover:text-blue-400 transition-colors">Home</NavLink>
            <NavLink to="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</NavLink>
            <NavLink to="/login" className="hover:text-blue-400 transition-colors">Login</NavLink>
            <NavLink to="/register" className="hover:text-blue-400 transition-colors">Register</NavLink>
          </div>

          {/* Copyright */}
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Spentwise. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;