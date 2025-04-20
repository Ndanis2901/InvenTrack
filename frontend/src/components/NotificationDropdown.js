import React, { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import "../assets/styles/NotificationDropdown.css";

const NotificationDropdown = ({ onClose }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    loading,
  } = useContext(NotificationContext);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case "info":
        return "notification-info";
      case "warning":
        return "notification-warning";
      case "error":
        return "notification-error";
      case "success":
        return "notification-success";
      default:
        return "";
    }
  };

  const handleMarkAsRead = (id) => {
    markNotificationAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("notification-dropdown-overlay")) {
      onClose();
    }
  };

  return (
    <div className="notification-dropdown-overlay" onClick={handleOutsideClick}>
      <div className="notification-dropdown">
        <div className="notification-header">
          <h3>Notifications</h3>
          <div>
            <button onClick={handleMarkAllAsRead}>Mark all as read</button>
            <button onClick={onClose} className="close-btn">
              &times;
            </button>
          </div>
        </div>

        <div className="notification-body">
          {loading ? (
            <div className="notification-loading">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="no-notifications">No notifications</div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item ${
                  notification.isRead ? "read" : "unread"
                } ${getNotificationClass(notification.type)}`}
                onClick={() => handleMarkAsRead(notification._id)}
              >
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDropdown;
