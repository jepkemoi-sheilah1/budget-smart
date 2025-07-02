import React, { createContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Example: check if user is logged in on mount (could be improved with real auth check)
  useEffect(() => {
    // TODO: Implement real user session check, e.g. fetch current user from backend
    setUser(null);
  }, []);

  const login = async (credentials) => {
    const userData = await loginService(credentials);
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
