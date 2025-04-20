import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Register user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);

    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Login user
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });

    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("user");
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const response = await axios.get(`${API_URL}/auth/profile`, config);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const response = await axios.put(
      `${API_URL}/auth/profile`,
      userData,
      config
    );

    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get current user from localStorage
export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
