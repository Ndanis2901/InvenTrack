// File: frontend/src/pages/Categories.js
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { ProductContext } from "../context/ProductContext";
import Layout from "../components/Layout";
import "../assets/styles/Products.css"; // We can reuse the Products CSS

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { products } = useContext(ProductContext); // Use the products from ProductContext
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      const token = user ? user.token : "";
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(`${API_URL}/categories`, config);
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setLoading(false);
    }
  };

  // Count products in each category
  const getProductCount = (category) => {
    return products.filter((product) => product.category === category).length;
  };

  useEffect(() => {
    if (user) {
      fetchCategories();
    }
  }, [API_URL, user]);

  return (
    <Layout>
      <div className="products-page">
        <div className="page-header">
          <h1>Pet Food Categories</h1>
          {user && user.role === "admin" && (
            <Link to="/categories/add" className="btn-add">
              <i className="fas fa-plus"></i> Add Category
            </Link>
          )}
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Category Name</th>
                  <th>Number of Products</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <tr key={index}>
                      <td>{category}</td>
                      <td>{getProductCount(category)}</td>
                      <td className="actions">
                        {user && user.role === "admin" && (
                          <>
                            <button className="btn-edit">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn-delete">
                              <i className="fas fa-trash"></i>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="no-results">
                      No categories found.
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

export default Categories;
