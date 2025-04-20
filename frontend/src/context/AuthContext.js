import { createContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  login,
  logout,
  register,
  updateUserProfile,
} from "../services/authService";

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const user = getCurrentUser();
    setUser(user);
    setLoading(false);
  }, []);

  // Register user
  const registerUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await register(userData);
      setUser(data);
      setLoading(false);
      return data;
    } catch (error) {
      setError(error.message || "Registration failed");
      setLoading(false);
      throw error;
    }
  };

  // Login user
  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(email, password);
      setUser(data);
      setLoading(false);
      return data;
    } catch (error) {
      setError(error.message || "Login failed");
      setLoading(false);
      throw error;
    }
  };

  // Logout user
  const logoutUser = () => {
    logout();
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateUserProfile(userData);
      setUser(data);
      setLoading(false);
      return data;
    } catch (error) {
      setError(error.message || "Update failed");
      setLoading(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        registerUser,
        loginUser,
        logoutUser,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
