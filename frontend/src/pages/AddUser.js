// File: frontend/src/pages/AddUser.js
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";
import "../assets/styles/ProductForm.css"; // Reuse the ProductForm CSS

const AddUser = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState({});

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

    // Clear error for this field if any
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password && formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.post(`${API_URL}/users`, formData, config);
      navigate("/users");
    } catch (error) {
      console.error("Failed to add user:", error);
      setErrors({
        submit:
          error.response?.data?.message ||
          "Failed to add user. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="product-form-page">
        <div className="page-header">
          <div className="header-left">
            <Link to="/users" className="btn-back">
              <i className="fas fa-arrow-left"></i> Back to Users
            </Link>
            <h1>Add New User</h1>
          </div>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="form-error-message">{errors.submit}</div>
          )}

          <div className="form-group">
            <label htmlFor="name">Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="role">Role*</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Adding..." : "Add User"}
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

export default AddUser;
