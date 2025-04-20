import { createContext, useState, useEffect, useContext } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../services/notificationService";
import { AuthContext } from "./AuthContext";

// Create context
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  // Load notifications on initial render and when user changes
  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          setLoading(true);
          const data = await getNotifications();
          setNotifications(data);
          setLoading(false);
        } catch (error) {
          setError(error.message || "Failed to fetch notifications");
          setLoading(false);
        }
      } else {
        setNotifications([]);
        setLoading(false);
      }
    };

    fetchNotifications();

    // Refresh notifications every minute
    const intervalId = setInterval(fetchNotifications, 60000);

    return () => clearInterval(intervalId);
  }, [user]);

  // Mark a notification as read
  const markNotificationAsRead = async (id) => {
    try {
      const updatedNotification = await markAsRead(id);
      setNotifications(
        notifications.map((n) => (n._id === id ? updatedNotification : n))
      );
      return updatedNotification;
    } catch (error) {
      setError(error.message || "Failed to mark notification as read");
      throw error;
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      setError(error.message || "Failed to mark all notifications as read");
      throw error;
    }
  };

  // Get unread notifications count
  const getUnreadCount = () => {
    return notifications.filter((n) => !n.isRead).length;
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        getUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
