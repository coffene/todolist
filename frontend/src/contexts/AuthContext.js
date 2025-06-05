import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetchUser(userId);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('userId');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password
      });
      setUser(response.data);
      localStorage.setItem('userId', response.data._id);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users', {
        username,
        email,
        password
      });
      setUser(response.data);
      localStorage.setItem('userId', response.data._id);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  const updateUserSettings = async (settings) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${user._id}`, {
        settings
      });
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update settings' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateUserSettings
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 