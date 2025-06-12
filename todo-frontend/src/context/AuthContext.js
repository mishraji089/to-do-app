// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for token on app load
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      // Potentially validate token here (e.g., check expiry)
      // For now, just assume presence means authenticated
      setIsAuthenticated(true);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { token, id, username: loggedInUsername, roles } = response.data;

      localStorage.setItem('jwtToken', token);
      localStorage.setItem('user', JSON.stringify({ id, username: loggedInUsername, roles }));

      setIsAuthenticated(true);
      setUser({ id, username: loggedInUsername, roles });
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/register', { username, password });
      return { success: true, message: response.data };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };


  const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const getAuthHeader = () => {
    const token = localStorage.getItem('jwtToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  if (loading) {
    return <div>Loading authentication...</div>; // Simple loading indicator
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);