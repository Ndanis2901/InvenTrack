// frontend/src/services/userService.js
import axios from "axios";
import { getCurrentUser } from "./authService";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

// Get auth header
const getAuthHeader = () => {
  const user = getCurrentUser();
  if (!user || !user.token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "application/json",
    },
  };
};

// Get all users
export const getAllUsers = async () => {
  try {
    console.log("Getting all users with URL:", `${API_URL}/users`);
    console.log("Auth header:", getAuthHeader());

    const response = await axios.get(`${API_URL}/users`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error in getAllUsers:", error.response || error);
    throw (
      error.response?.data || {
        message: error.message || "Failed to fetch users",
      }
    );
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error in getUserById:", error.response || error);
    throw (
      error.response?.data || {
        message: error.message || "Failed to fetch user",
      }
    );
  }
};

// Create user
export const createUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/users`,
      userData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error in createUser:", error.response || error);
    throw (
      error.response?.data || {
        message: error.message || "Failed to create user",
      }
    );
  }
};

// Update user
export const updateUser = async (id, userData) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/${id}`,
      userData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error in updateUser:", error.response || error);
    throw (
      error.response?.data || {
        message: error.message || "Failed to update user",
      }
    );
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    console.log(`Deleting user with ID: ${id}`);
    const response = await axios.delete(
      `${API_URL}/users/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error in deleteUser:", error.response || error);
    throw (
      error.response?.data || {
        message: error.message || "Failed to delete user",
      }
    );
  }
};
