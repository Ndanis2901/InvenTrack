// frontend/src/context/UserContext.js
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
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

  // Function to fetch all users - using useCallback to prevent infinite loops
  const fetchUsers = useCallback(async () => {
    if (!user || user.role !== "admin") {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.get(`${API_URL}/users`, config);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.message || "Failed to fetch users");
      setLoading(false);
    }
  }, [user, API_URL]);

  // Load users when component mounts or user changes
  useEffect(() => {
    if (user && user.role === "admin") {
      fetchUsers();
    } else {
      setUsers([]);
      setLoading(false);
    }
  }, [user, fetchUsers]);

  // Create a user
  const addUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);

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
      setError(error.response?.data?.message || "Failed to add user");
      setLoading(false);
      throw error;
    }
  };

  // Update a user
  const updateUser = async (id, userData) => {
    try {
      setLoading(true);
      setError(null);

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
      setError(error.response?.data?.message || "Failed to update user");
      setLoading(false);
      throw error;
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      await axios.delete(`${API_URL}/users/${id}`, config);
      setUsers(users.filter((u) => u._id !== id));
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete user");
      setLoading(false);
      throw error;
    }
  };

  // Manually refresh users
  const refreshUsers = useCallback(() => {
    fetchUsers();
  }, [fetchUsers]);

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
