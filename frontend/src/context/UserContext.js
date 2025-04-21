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
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.get(`${API_URL}/users`, config);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message || "Failed to fetch users");
      setLoading(false);
    }
  };

  // Load users when component mounts or user changes
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchUsers();
    } else {
      setUsers([]);
      setLoading(false);
    }
  }, [user]);

  // Create a user
  const addUser = async (userData) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.post(`${API_URL}/users`, userData, config);
      setUsers([...users, response.data]);
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.message || "Failed to add user");
      setLoading(false);
      throw error;
    }
  };

  // Update a user
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
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
      setUsers(users.map((u) => (u._id === id ? response.data : u)));
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.message || "Failed to update user");
      setLoading(false);
      throw error;
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`${API_URL}/users/${id}`, config);
      setUsers(users.filter((u) => u._id !== id));
      setLoading(false);
    } catch (error) {
      setError(error.message || "Failed to delete user");
      setLoading(false);
      throw error;
    }
  };

  // Manually refresh users
  const refreshUsers = () => {
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
