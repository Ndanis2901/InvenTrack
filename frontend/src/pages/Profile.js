import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";
import "../assets/styles/Profile.css";

const Profile = () => {
  const { user, updateUser, changePassword } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
    avatar: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
        department: user.department || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });

    // Clear errors when field changes
    if (profileErrors[name]) {
      setProfileErrors({ ...profileErrors, [name]: null });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({ ...passwordForm, [name]: value });

    // Clear errors when field changes
    if (passwordErrors[name]) {
      setPasswordErrors({ ...passwordErrors, [name]: null });
    }
  };

  const validateProfileForm = () => {
    const errors = {};

    if (!profileForm.name.trim()) {
      errors.name = "Name is required";
    }

    if (!profileForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      errors.email = "Email is invalid";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateProfileForm()) return;

    setLoading(true);
    try {
      await updateUser(profileForm);
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      setProfileErrors({
        submit: "Failed to update profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validatePasswordForm()) return;

    setLoading(true);
    try {
      await changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      setSuccessMessage("Password changed successfully!");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordErrors({
        submit:
          "Failed to change password. Please check your current password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For demo purposes, we're just using URL.createObjectURL
      const avatarUrl = URL.createObjectURL(file);
      setProfileForm({ ...profileForm, avatar: avatarUrl });
    }
  };

  return (
    <Layout>
      <div className="profile-page">
        <div className="page-header">
          <h1>My Profile</h1>
        </div>

        <div className="profile-content">
          <div className="profile-tabs">
            <button
              className={`tab-button ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fas fa-user"></i>
              Profile Information
            </button>
            <button
              className={`tab-button ${
                activeTab === "password" ? "active" : ""
              }`}
              onClick={() => setActiveTab("password")}
            >
              <i className="fas fa-lock"></i>
              Change Password
            </button>
          </div>

          <div className="profile-form-container">
            {successMessage && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                {successMessage}
              </div>
            )}

            {activeTab === "profile" && (
              <form className="profile-form" onSubmit={handleProfileSubmit}>
                {profileErrors.submit && (
                  <div className="form-error-message">
                    {profileErrors.submit}
                  </div>
                )}

                <div className="avatar-section">
                  <div className="avatar-container">
                    {profileForm.avatar ? (
                      <img
                        src={profileForm.avatar}
                        alt="User avatar"
                        className="avatar-image"
                      />
                    ) : (
                      <div className="avatar-placeholder">
                        <i className="fas fa-user"></i>
                      </div>
                    )}
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      className="change-avatar-btn"
                      onClick={() => document.getElementById("avatar").click()}
                    >
                      <i className="fas fa-camera"></i>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    className={profileErrors.name ? "error" : ""}
                  />
                  {profileErrors.name && (
                    <div className="error-message">{profileErrors.name}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    className={profileErrors.email ? "error" : ""}
                  />
                  {profileErrors.email && (
                    <div className="error-message">{profileErrors.email}</div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={profileForm.role}
                      disabled
                      className="disabled"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="department">Department</label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={profileForm.department}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "password" && (
              <form className="password-form" onSubmit={handlePasswordSubmit}>
                {passwordErrors.submit && (
                  <div className="form-error-message">
                    {passwordErrors.submit}
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.currentPassword ? "error" : ""}
                  />
                  {passwordErrors.currentPassword && (
                    <div className="error-message">
                      {passwordErrors.currentPassword}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.newPassword ? "error" : ""}
                  />
                  {passwordErrors.newPassword && (
                    <div className="error-message">
                      {passwordErrors.newPassword}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.confirmPassword ? "error" : ""}
                  />
                  {passwordErrors.confirmPassword && (
                    <div className="error-message">
                      {passwordErrors.confirmPassword}
                    </div>
                  )}
                </div>

                <div className="password-requirements">
                  <h4>Password Requirements:</h4>
                  <ul>
                    <li>Minimum 6 characters long</li>
                    <li>Include at least one number</li>
                    <li>Include at least one special character</li>
                  </ul>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
