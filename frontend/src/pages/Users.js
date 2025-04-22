// File: frontend/src/pages/Users.js
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserContext } from "../context/UserContext";
import Layout from "../components/Layout";
import "../assets/styles/Products.css";

const Users = () => {
  const { user } = useContext(AuthContext);
  const { users, loading, error, deleteUser, refreshUsers } =
    useContext(UserContext);

  // Refresh users when component mounts
  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId);
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Failed to delete user. Please try again.");
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
            <button onClick={refreshUsers} className="btn-refresh">
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
            <Link to="/users/add" className="btn-add">
              <i className="fas fa-plus"></i> Add User
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : error ? (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i> {error}
            <button onClick={refreshUsers} className="btn-retry">
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
                        {u._id !== user._id && (
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
