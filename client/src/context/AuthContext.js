import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to get user from localStorage on initial load
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verify token on initial load
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      setLoading(true);
      const response = await auth.verifyToken();
      
      console.log('Token Verification Full Response:', {
        user: response.data.user ? 'Present' : 'Missing',
        fullResponse: response.data
      });

      if (response.data.user) {
        // Merge existing user data with verified data
        const existingUserData = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...existingUserData,
          ...response.data.user,
          // Ensure name is preserved
          name: response.data.user.name || existingUserData.name || ''
        };

        console.log('Updated User Data:', {
          name: updatedUser.name,
          username: updatedUser.username
        });

        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token verification failed:', {
        error: error.message,
        response: error.response
      });
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    console.log('Login Context - User Data:', {
      name: userData.name,
      username: userData.username
    });
    
    // Ensure user data is saved to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token || '');
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear all authentication-related data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    
    // Optional: Redirect to login page
    window.location.href = '/login';
  };

  const updateProfile = async (profileData) => {
    try {
      console.log('AuthContext Update Profile:', {
        payloadKeys: Object.keys(profileData),
        payloadSize: profileData.size
      });

      const response = await auth.updateProfile(profileData);
      
      // Update user in localStorage and context
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      
      // If unauthorized, force logout
      if (error.response && error.response.status === 401) {
        logout();
      }
      
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      login, 
      logout,
      updateProfile,
      verifyToken
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
