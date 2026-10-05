import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // 👇 Test if REACT_APP_API_URL is loaded or not
  console.log("ENV → REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
  console.log("ENV → REACT_APP_ML_SERVICE_URL:", process.env.REACT_APP_ML_SERVICE_URL);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    console.log("Fetching user from:", `${process.env.REACT_APP_API_URL}/api/auth/me`);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`);
      setUser(res.data.user);
    } catch (error) {
      localStorage.removeItem('token');
      setToken(null);
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    console.log("Login URL:", `${process.env.REACT_APP_API_URL}/api/auth/login`);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        email,
        password
      });
      const { token: newToken, user } = res.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const register = async (userData) => {
    console.log("Register URL:", `${process.env.REACT_APP_API_URL}/api/auth/register`);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, userData);
      const { token: newToken, user } = res.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.info('Logged out successfully');
    // Force full reload to clear all state and context
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
