import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on mount
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');
    
    if (token && role) {
      setUser({ token, role, username, userId });
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const res = await authService.login(username, password);
    // JWT contains userId in real life, but our mock DTO doesn't expose it directly yet. 
    // We'll parse it from the token payload (Base64)
    const payload = JSON.parse(atob(res.token.split('.')[1]));
    
    const loggedInUser = {
      token: res.token,
      role: res.role,
      username: username,
      userId: payload.userId
    };

    localStorage.setItem('token', res.token);
    localStorage.setItem('role', res.role);
    localStorage.setItem('username', username);
    localStorage.setItem('userId', payload.userId);
    
    setUser(loggedInUser);
    return loggedInUser;
  };

  const signup = async (username, password, captcha, firstName, lastName, email) => {
    const res = await authService.signup(username, password, captcha, firstName, lastName, email);
    const payload = JSON.parse(atob(res.token.split('.')[1]));
    
    const newUser = {
      token: res.token,
      role: res.role,
      username: username,
      userId: payload.userId
    };

    localStorage.setItem('token', res.token);
    localStorage.setItem('role', res.role);
    localStorage.setItem('username', username);
    localStorage.setItem('userId', payload.userId);
    
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
