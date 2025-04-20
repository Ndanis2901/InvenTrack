import axios from "axios";
import { getCurrentUser } from "./authService";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Get auth header
const getAuthHeader = () => {
  const user = getCurrentUser();
  return {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
};

// Get all notifications
export const getNotifications = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/notifications`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Mark notification as read
export const markAsRead = async (id) => {
  try {
    const response = await axios.put(
      `${API_URL}/notifications/${id}`,
      {},
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  try {
    const response = await axios.put(
      `${API_URL}/notifications/mark-all`,
      {},
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Create notification (admin only)
export const createNotification = async (notificationData) => {
  try {
    const response = await axios.post(
      `${API_URL}/notifications`,
      notificationData,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete notification (admin only)
export const deleteNotification = async (id) => {
  try {
    const response = await axios.delete(
      `${API_URL}/notifications/${id}`,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
