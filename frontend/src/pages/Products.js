import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import { AuthContext } from "../context/AuthContext";
import Layout from "../components/Layout";
import "../assets/styles/Products.css";

const Products = () => {
  const { products, loading, removeProduct } = useContext(ProductContext);
  const { user } = useContext(AuthContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [categories, setCategories] = useState([]);

  // Set filtered products on initial load and when products, search, or filters change
  useEffect(() => {
    if (products) {
      // Extract unique categories
      const uniqueCategories = [...new Set(products.map((p) => p.category))];
      setCategories(uniqueCategories);

      // Apply search term and category filter
      let filtered = [...products];

      if (searchTerm) {
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (p.description &&
              p.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      if (filterCategory) {
        filtered = filtered.filter((p) => p.category === filterCategory);
      }

      // Apply sorting
      filtered.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        // Handle numeric values vs string values
        if (typeof aVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
        return 0;
      });

      setFilteredProducts(filtered);
    }
  }, [products, searchTerm, filterCategory, sortBy, sortDir]);

  const handleSort = (field) => {
    if (field === sortBy) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      removeProduct(id);
    }
  };

  const getSortIndicator = (field) => {
    if (field === sortBy) {
      return sortDir === "asc" ? " ▲" : " ▼";
    }
    return "";
  };

  return (
    <Layout>
      <div className="products-page">
        <div className="page-header">
          <h1>Product Management</h1>
          {user && user.role === "admin" && (
            <Link to="/products/add" className="btn-add">
              <i className="fas fa-plus"></i> Add Product
            </Link>
          )}
        </div>

        {/* Search and Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>

          <div className="filter-selection">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")}>
                    Product Name{getSortIndicator("name")}
                  </th>
                  <th onClick={() => handleSort("sku")}>
                    SKU{getSortIndicator("sku")}
                  </th>
                  <th onClick={() => handleSort("category")}>
                    Category{getSortIndicator("category")}
                  </th>
                  <th onClick={() => handleSort("price")}>
                    Price{getSortIndicator("price")}
                  </th>
                  <th onClick={() => handleSort("quantity")}>
                    Quantity{getSortIndicator("quantity")}
                  </th>
                  <th onClick={() => handleSort("status")}>
                    Status{getSortIndicator("status")}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product._id}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>{product.category}</td>
                      <td>${product.price.toFixed(2)}</td>
                      <td
                        className={
                          product.quantity < product.lowStockThreshold
                            ? "low-stock"
                            : ""
                        }
                      >
                        {product.quantity}
                      </td>
                      <td>
                        <span className={`status-badge ${product.status}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="actions">
                        <Link
                          to={`/products/${product._id}`}
                          className="btn-view"
                        >
                          <i className="fas fa-eye"></i>
                        </Link>
                        {user && user.role === "admin" && (
                          <>
                            <Link
                              to={`/products/edit/${product._id}`}
                              className="btn-edit"
                            >
                              <i className="fas fa-edit"></i>
                            </Link>
                            <button
                              className="btn-delete"
                              onClick={() => handleDelete(product._id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-results">
                      No products found.
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

export default Products;
