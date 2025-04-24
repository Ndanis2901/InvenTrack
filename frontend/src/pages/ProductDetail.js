import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";
import "../assets/styles/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockHistory] = useState([
    { date: "2023-04-15", change: -5, reason: "Order #1024" },
    { date: "2023-04-10", change: 20, reason: "Inventory restocking" },
    { date: "2023-04-01", change: -2, reason: "Order #1018" },
  ]);

  // Load product directly from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Get user token
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.token) {
          throw new Error("You must be logged in");
        }

        const response = await axios.get(
          `http://localhost:5001/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to load product"
        );
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Handle product deletion
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // Get user token
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.token) {
          throw new Error("You must be logged in");
        }

        await axios.delete(`http://localhost:5001/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        navigate("/products");
      } catch (err) {
        console.error("Error deleting product:", err);
        alert(
          `Failed to delete product: ${
            err.response?.data?.message || err.message || "Unknown error"
          }`
        );
      }
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "active":
        return "status-active";
      case "low-stock":
        return "status-low";
      case "out-of-stock":
        return "status-out";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading product details...</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="product-not-found">
          <h2>Error Loading Product</h2>
          <p>{error}</p>
          <Link to="/products" className="btn-back">
            Return to Products
          </Link>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="product-not-found">
          <h2>Product Not Found</h2>
          <p>The requested product could not be found or has been removed.</p>
          <Link to="/products" className="btn-back">
            Return to Products
          </Link>
        </div>
      </Layout>
    );
  }

  // Check if user is admin
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.role === "admin";

  return (
    <Layout>
      <div className="product-detail-page">
        <div className="page-header">
          <div className="header-left">
            <Link to="/products" className="btn-back">
              <i className="fas fa-arrow-left"></i> Back to Products
            </Link>
            <h1>{product.name}</h1>
          </div>
          <div className="header-actions">
            {/* Add the Forecast button */}
            <Link to={`/products/forecast/${id}`} className="btn-forecast">
              <i className="fas fa-chart-line"></i> View Forecast
            </Link>

            {isAdmin && (
              <>
                <Link to={`/products/edit/${id}`} className="btn-edit">
                  <i className="fas fa-edit"></i> Edit
                </Link>
                <button className="btn-delete" onClick={handleDelete}>
                  <i className="fas fa-trash"></i> Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="product-detail-content">
          <div className="product-main-info">
            <div className="product-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="no-image">
                  <i className="fas fa-box"></i>
                  <span>No Image</span>
                </div>
              )}
            </div>

            <div className="product-info">
              <div className="info-group">
                <h3>Basic Information</h3>
                <div className="info-row">
                  <span className="label">SKU:</span>
                  <span className="value">{product.sku}</span>
                </div>
                <div className="info-row">
                  <span className="label">Category:</span>
                  <span className="value">{product.category}</span>
                </div>
                <div className="info-row">
                  <span className="label">Price:</span>
                  <span className="value">${product.price?.toFixed(2)}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span
                    className={`status-badge ${getStatusClass(product.status)}`}
                  >
                    {product.status}
                  </span>
                </div>
              </div>

              <div className="info-group">
                <h3>Inventory Information</h3>
                <div className="info-row">
                  <span className="label">Current Stock:</span>
                  <span
                    className={`value ${
                      product.quantity < product.lowStockThreshold
                        ? "low-stock"
                        : ""
                    }`}
                  >
                    {product.quantity} units
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Low Stock Threshold:</span>
                  <span className="value">
                    {product.lowStockThreshold} units
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Location:</span>
                  <span className="value">
                    {product.location || "Not specified"}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Seasonal Trend:</span>
                  <span className="value">
                    {product.seasonalTrend || "Stable"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="product-details-section">
            <div className="description-section">
              <h3>Description</h3>
              <p>{product.description || "No description available."}</p>

              {product.ingredients && (
                <>
                  <h4>Ingredients</h4>
                  <p>{product.ingredients}</p>
                </>
              )}
            </div>

            <div className="stock-history-section">
              <h3>Stock History</h3>
              <table className="stock-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Change</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {stockHistory.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.date}</td>
                      <td
                        className={entry.change > 0 ? "positive" : "negative"}
                      >
                        {entry.change > 0 ? "+" : ""}
                        {entry.change}
                      </td>
                      <td>{entry.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
