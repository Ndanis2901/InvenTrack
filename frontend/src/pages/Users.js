// frontend/src/pages/Users.js
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import Layout from "../components/Layout";
import "../assets/styles/Products.css";

const Users = () => {
  const { user } = useContext(AuthContext);
  const { users, loading, error, deleteUser, refreshUsers } =
    useContext(UserContext);
  const [deleteError, setDeleteError] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Refresh users when component mounts
  useEffect(() => {
    if (user && user.role === "admin") {
      handleRefresh();
    }
  }, [user]);

  const handleRefresh = async () => {
    try {
      setApiError(null);
      await refreshUsers();
    } catch (err) {
      console.error("Error refreshing users:", err);
      setApiError(`Failed to load users: ${err.message || "Unknown error"}`);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setDeleteError(null);
    try {
      await deleteUser(userId);
      // Refresh the list after deletion
      handleRefresh();
    } catch (err) {
      console.error("Failed to delete user:", err);
      setDeleteError(err.message || "Failed to delete user. Please try again.");
    }
  };

  // If not admin, show access denied
  if (user && user.role !== "admin") {
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

  return (
    <Layout>
      <div className="products-page">
        <div className="page-header">
          <h1>System Users</h1>
          <div className="header-actions">
            <button onClick={handleRefresh} className="btn-refresh">
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
            <Link to="/users/add" className="btn-add">
              <i className="fas fa-plus"></i> Add User
            </Link>
          </div>
        </div>

        {apiError && (
          <div
            className="error-message"
            style={{
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#ffe6e6",
              border: "1px solid #ff9999",
              borderRadius: "4px",
            }}
          >
            <i className="fas fa-exclamation-circle"></i> {apiError}
            <button
              onClick={() => {
                setApiError(null);
                handleRefresh();
              }}
              className="btn-retry"
              style={{
                marginLeft: "10px",
                padding: "3px 8px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #ddd",
                borderRadius: "3px",
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {deleteError && (
          <div
            className="error-message"
            style={{
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#ffe6e6",
              border: "1px solid #ff9999",
              borderRadius: "4px",
            }}
          >
            <i className="fas fa-exclamation-circle"></i> {deleteError}
            <button
              onClick={() => setDeleteError(null)}
              className="btn-retry"
              style={{
                marginLeft: "10px",
                padding: "3px 8px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #ddd",
                borderRadius: "3px",
              }}
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div
            className="loading"
            style={{ textAlign: "center", padding: "20px" }}
          >
            <i className="fas fa-spinner fa-spin"></i> Loading users...
          </div>
        ) : error ? (
          <div
            className="error-message"
            style={{
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#ffe6e6",
              border: "1px solid #ff9999",
              borderRadius: "4px",
            }}
          >
            <i className="fas fa-exclamation-circle"></i> {error}
            <button
              onClick={handleRefresh}
              className="btn-retry"
              style={{
                marginLeft: "10px",
                padding: "3px 8px",
                backgroundColor: "#f8f9fa",
                border: "1px solid #ddd",
                borderRadius: "3px",
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td className="actions">
                        <Link to={`/users/edit/${u._id}`} className="btn-edit">
                          <i className="fas fa-edit"></i>
                        </Link>
                        {user && u._id !== user._id && (
                          <button
                            className="btn-delete"
                            onClick={() => handleDeleteUser(u._id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-results">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Users;
