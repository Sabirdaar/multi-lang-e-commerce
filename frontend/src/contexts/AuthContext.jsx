import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/apiService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setUserProfile(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authService.getProfile();
      setUserProfile(response.data);
      setCurrentUser(response.data);
      localStorage.setItem('userData', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError('');
      const response = await authService.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      setCurrentUser(user);
      setUserProfile(user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      const response = await authService.register(userData);
      const { token, user } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      setCurrentUser(user);
      setUserProfile(user);
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setCurrentUser(null);
      setUserProfile(null);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      setUserProfile(response.data);
      localStorage.setItem('userData', JSON.stringify(response.data));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Profile update failed';
      return { success: false, error: message };
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}