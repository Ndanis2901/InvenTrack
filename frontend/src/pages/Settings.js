import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";
import "../assets/styles/Settings.css";

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("general");

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "InvenTrack",
    email: "admin@inventrack.com",
    phone: "(123) 456-7890",
    address: "123 Inventory St, Warehouse City, 12345",
    lowStockThreshold: 5,
    currencySymbol: "$",
    dateFormat: "MM/DD/YYYY",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    lowStockAlerts: true,
    activitySummary: true,
    priceChanges: false,
    systemUpdates: true,
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({ ...generalSettings, [name]: value });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({ ...notificationSettings, [name]: checked });
  };

  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage("General settings updated successfully!");
      setLoading(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }, 800);
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage("Notification settings updated successfully!");
      setLoading(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }, 800);
  };

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <Layout>
        <div className="settings-page">
          <div className="access-denied">
            <i className="fas fa-lock"></i>
            <h2>Access Denied</h2>
            <p>You do not have permission to access this page.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="settings-page">
        <div className="page-header">
          <h1>System Settings</h1>
        </div>

        <div className="settings-content">
          <div className="settings-tabs">
            <button
              className={`tab-button ${
                activeTab === "general" ? "active" : ""
              }`}
              onClick={() => setActiveTab("general")}
            >
              <i className="fas fa-cog"></i>
              General
            </button>
            <button
              className={`tab-button ${
                activeTab === "notifications" ? "active" : ""
              }`}
              onClick={() => setActiveTab("notifications")}
            >
              <i className="fas fa-bell"></i>
              Notifications
            </button>
            <button
              className={`tab-button ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              <i className="fas fa-users"></i>
              Users
            </button>
            <button
              className={`tab-button ${
                activeTab === "integrations" ? "active" : ""
              }`}
              onClick={() => setActiveTab("integrations")}
            >
              <i className="fas fa-plug"></i>
              Integrations
            </button>
          </div>

          <div className="settings-form-container">
            {successMessage && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                {successMessage}
              </div>
            )}

            {activeTab === "general" && (
              <form className="settings-form" onSubmit={handleGeneralSubmit}>
                <h2>General Settings</h2>

                <div className="form-group">
                  <label htmlFor="companyName">Company Name</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={generalSettings.companyName}
                    onChange={handleGeneralChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={generalSettings.email}
                      onChange={handleGeneralChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={generalSettings.phone}
                      onChange={handleGeneralChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={generalSettings.address}
                    onChange={handleGeneralChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="lowStockThreshold">
                      Default Low Stock Threshold
                    </label>
                    <input
                      type="number"
                      id="lowStockThreshold"
                      name="lowStockThreshold"
                      min="0"
                      value={generalSettings.lowStockThreshold}
                      onChange={handleGeneralChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="currencySymbol">Currency Symbol</label>
                    <input
                      type="text"
                      id="currencySymbol"
                      name="currencySymbol"
                      value={generalSettings.currencySymbol}
                      onChange={handleGeneralChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="dateFormat">Date Format</label>
                  <select
                    id="dateFormat"
                    name="dateFormat"
                    value={generalSettings.dateFormat}
                    onChange={handleGeneralChange}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "notifications" && (
              <form
                className="settings-form"
                onSubmit={handleNotificationSubmit}
              >
                <h2>Notification Settings</h2>

                <div className="checkbox-group">
                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      name="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onChange={handleNotificationChange}
                    />
                    <label htmlFor="emailNotifications">
                      <span className="checkbox-title">
                        Email Notifications
                      </span>
                      <span className="checkbox-description">
                        Receive notifications via email
                      </span>
                    </label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="lowStockAlerts"
                      name="lowStockAlerts"
                      checked={notificationSettings.lowStockAlerts}
                      onChange={handleNotificationChange}
                    />
                    <label htmlFor="lowStockAlerts">
                      <span className="checkbox-title">Low Stock Alerts</span>
                      <span className="checkbox-description">
                        Get notified when products reach low stock threshold
                      </span>
                    </label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="activitySummary"
                      name="activitySummary"
                      checked={notificationSettings.activitySummary}
                      onChange={handleNotificationChange}
                    />
                    <label htmlFor="activitySummary">
                      <span className="checkbox-title">Activity Summary</span>
                      <span className="checkbox-description">
                        Receive daily summary of inventory activities
                      </span>
                    </label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="priceChanges"
                      name="priceChanges"
                      checked={notificationSettings.priceChanges}
                      onChange={handleNotificationChange}
                    />
                    <label htmlFor="priceChanges">
                      <span className="checkbox-title">Price Changes</span>
                      <span className="checkbox-description">
                        Get notified when product prices are updated
                      </span>
                    </label>
                  </div>

                  <div className="checkbox-item">
                    <input
                      type="checkbox"
                      id="systemUpdates"
                      name="systemUpdates"
                      checked={notificationSettings.systemUpdates}
                      onChange={handleNotificationChange}
                    />
                    <label htmlFor="systemUpdates">
                      <span className="checkbox-title">System Updates</span>
                      <span className="checkbox-description">
                        Receive notifications about system updates and
                        maintenance
                      </span>
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "users" && (
              <div className="settings-placeholder">
                <i className="fas fa-users"></i>
                <h3>User Management</h3>
                <p>User management functionality will be implemented here.</p>
              </div>
            )}

            {activeTab === "integrations" && (
              <div className="settings-placeholder">
                <i className="fas fa-plug"></i>
                <h3>Integrations</h3>
                <p>Third-party integrations will be configured here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
