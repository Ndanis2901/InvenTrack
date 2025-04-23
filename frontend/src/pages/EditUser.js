// frontend/src/pages/EditUser.js
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import Layout from "../components/Layout";
import "../assets/styles/ProductForm.css"; // Reuse ProductForm CSS

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { users, updateUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    password: "", // Optional for updates
  });

  // Load user data when component mounts
  useEffect(() => {
    if (!user || user.role !== "admin") {
      return;
    }

    // Find the user in the users array
    const userToEdit = users.find((u) => u._id === id);

    if (userToEdit) {
      setFormData({
        name: userToEdit.name || "",
        email: userToEdit.email || "",
        role: userToEdit.role || "user",
        password: "", // Don't display password
      });
      setLoading(false);
    } else {
      setError("User not found");
      setLoading(false);
    }
  }, [id, user, users]);

  // Only admin should be able to access this page
  if (!user || user.role !== "admin") {
    return (
      <Layout>
        <div className="access-denied">
          <i className="fas fa-lock"></i>
          <h2>Access Denied</h2>
          <p>You do not have permission to access this page.</p>
        </div>
      </Layout>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (
      formData.password &&
      formData.password.length > 0 &&
      formData.password.length < 6
    ) {
      errors.password = "Password must be at least 6 characters";
    }

    setError(errors.name || errors.email || errors.password || null);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // If password is empty, remove it from the form data
    const userData = { ...formData };
    if (!userData.password) {
      delete userData.password;
    }

    setLoading(true);
    try {
      await updateUser(id, userData);
      navigate("/users");
    } catch (err) {
      setError(err.message || "Failed to update user");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading user data...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="product-form-page">
        <div className="page-header">
          <div className="header-left">
            <Link to="/users" className="btn-back">
              <i className="fas fa-arrow-left"></i> Back to Users
            </Link>
            <h1>Edit User</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {error && <div className="error-message form-error">{error}</div>}

          <div className="form-section">
            <h2>User Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">
                  Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">User Role</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="user">Regular User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <Link to="/users" className="btn-cancel">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditUser;
