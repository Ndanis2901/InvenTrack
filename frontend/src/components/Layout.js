import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { NotificationContext } from "../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";
import "../assets/styles/Layout.css";

const Layout = ({ children }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const { getUnreadCount } = useContext(NotificationContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="layout">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <button className="menu-toggle" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <Link to="/" className="logo">
            InvenTrack
          </Link>
        </div>

        {user && (
          <div className="header-right">
            <div className="notification-icon" onClick={toggleNotifications}>
              <i className="fas fa-bell"></i>
              {getUnreadCount() > 0 && (
                <span className="notification-badge">{getUnreadCount()}</span>
              )}
            </div>
            <div className="user-dropdown">
              <span className="user-name">{user.name}</span>
              <div className="dropdown-content">
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
            {showNotifications && (
              <NotificationDropdown
                onClose={() => setShowNotifications(false)}
              />
            )}
          </div>
        )}
      </header>

      <div className="main-container">
        {/* Sidebar */}
        {user && (
          <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <nav>
              <ul>
                <li>
                  <Link to="/dashboard">
                    <i className="fas fa-tachometer-alt"></i>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/products">
                    <i className="fas fa-boxes"></i>
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/categories">
                    <i className="fas fa-tags"></i>
                    Categories
                  </Link>
                </li>
                {user.role === "admin" && (
                  <>
                    <li>
                      <Link to="/users">
                        <i className="fas fa-users"></i>
                        Users
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings">
                        <i className="fas fa-cog"></i>
                        Settings
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
