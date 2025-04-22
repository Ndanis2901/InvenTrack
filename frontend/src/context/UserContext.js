// File: frontend/src/context/UserContext.js
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

// Create context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // Function to fetch all users
  const fetchUsers = async () => {
    if (!user || user.role !== "admin") {
      console.log("User not admin or not logged in, skipping fetch");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching users from:", `${API_URL}/users`);
      console.log("With token:", user.token);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.get(`${API_URL}/users`, config);
      console.log("Users API response:", response);

      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      console.error("Error details:", error.response || error.message);
      setError(error.response?.data?.message || "Failed to fetch users");
      setLoading(false);
    }
  };

  // Load users when component mounts or user changes
  useEffect(() => {
    console.log("UserContext useEffect triggered, user:", user);
    if (user && user.role === "admin") {
      console.log("User is admin, fetching users");
      fetchUsers();
    } else {
      console.log("User not admin or not logged in");
      setUsers([]);
      setLoading(false);
    }
  }, [user]);

  // Create a user
  const addUser = async (userData) => {
    try {
      setLoading(true);
      console.log("Adding user:", userData);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.post(`${API_URL}/users`, userData, config);
      console.log("Add user response:", response);

      setUsers([...users, response.data]);
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error adding user:", error);
      console.error("Error details:", error.response || error.message);
      setError(error.response?.data?.message || "Failed to add user");
      setLoading(false);
      throw error;
    }
  };

  // Update a user
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      console.log("Updating user:", id, userData);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.put(
        `${API_URL}/users/${id}`,
        userData,
        config
      );
      console.log("Update user response:", response);

      setUsers(users.map((u) => (u._id === id ? response.data : u)));
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error);
      console.error("Error details:", error.response || error.message);
      setError(error.response?.data?.message || "Failed to update user");
      setLoading(false);
      throw error;
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      console.log("Deleting user:", id);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.delete(`${API_URL}/users/${id}`, config);
      console.log("Delete user response:", response);

      setUsers(users.filter((u) => u._id !== id));
      setLoading(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      console.error("Error details:", error.response || error.message);
      setError(error.response?.data?.message || "Failed to delete user");
      setLoading(false);
      throw error;
    }
  };

  // Manually refresh users
  const refreshUsers = () => {
    console.log("Manual refresh triggered");
    fetchUsers();
  };

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        error,
        addUser,
        updateUser,
        deleteUser,
        refreshUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
