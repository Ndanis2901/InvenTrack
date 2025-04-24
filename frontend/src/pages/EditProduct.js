import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import "../assets/styles/ProductForm.css";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [categories] = useState([
    "Dry Dog Food",
    "Wet Dog Food",
    "Dry Cat Food",
    "Wet Cat Food",
    "Puppy Food",
    "Kitten Food",
    "Senior Pet Food",
    "Pet Treats",
    "Prescription Diet",
    "Organic Pet Food",
  ]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    quantity: "",
    lowStockThreshold: "",
    description: "",
    location: "",
    status: "active",
    image: "",
    seasonalTrend: "stable",
    costPrice: "",
    expirationDate: "",
    ingredients: "",
  });

  const [originalProduct, setOriginalProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load product directly from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
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

        const product = response.data;
        setOriginalProduct(product);

        // Set form data
        setFormData({
          name: product.name || "",
          sku: product.sku || "",
          category: product.category || "",
          price: product.price !== undefined ? product.price.toString() : "",
          quantity:
            product.quantity !== undefined ? product.quantity.toString() : "",
          lowStockThreshold: product.lowStockThreshold
            ? product.lowStockThreshold.toString()
            : "5",
          description: product.description || "",
          location: product.location || "",
          status: product.status || "active",
          image: product.image || "",
          seasonalTrend: product.seasonalTrend || "stable",
          costPrice: product.costPrice ? product.costPrice.toString() : "",
          expirationDate: product.expirationDate
            ? new Date(product.expirationDate).toISOString().split("T")[0]
            : "",
          ingredients: product.ingredients || "",
        });

        if (product.image) {
          setPreviewImage(product.image);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setErrors({
          fetch:
            err.response?.data?.message ||
            err.message ||
            "Failed to load product data",
        });
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field if any
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For demo purposes, we're just storing file URL in memory
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (!formData.category) newErrors.category = "Category is required";

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.quantity) {
      newErrors.quantity = "Quantity is required";
    } else if (isNaN(formData.quantity) || parseInt(formData.quantity) < 0) {
      newErrors.quantity = "Quantity must be a positive number";
    }

    if (!formData.lowStockThreshold) {
      newErrors.lowStockThreshold = "Low stock threshold is required";
    } else if (
      isNaN(formData.lowStockThreshold) ||
      parseInt(formData.lowStockThreshold) < 0
    ) {
      newErrors.lowStockThreshold =
        "Low stock threshold must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      // Get user token
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        throw new Error("You must be logged in");
      }

      // Convert numeric strings to numbers
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        costPrice: parseFloat(formData.price) * 0.7, // Add costPrice if it's required
      };

      // Update product via API
      await axios.put(`http://localhost:5001/api/products/${id}`, productData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      navigate(`/products/${id}`);
    } catch (err) {
      console.error("Failed to update product:", err);
      setErrors({
        submit:
          err.response?.data?.message ||
          err.message ||
          "Failed to update product",
      });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="loading">Loading product data...</div>
      </Layout>
    );
  }

  if (errors.fetch) {
    return (
      <Layout>
        <div className="product-not-found">
          <h2>Error Loading Product</h2>
          <p>{errors.fetch}</p>
          <Link to="/products" className="btn-back">
            Return to Products
          </Link>
        </div>
      </Layout>
    );
  }

  if (!originalProduct) {
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

  return (
    <Layout>
      <div className="product-form-page">
        <div className="page-header">
          <div className="header-left">
            <Link to={`/products/${id}`} className="btn-back">
              <i className="fas fa-arrow-left"></i> Back to Product
            </Link>
            <h1>Edit Product</h1>
          </div>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          {errors.submit && (
            <div className="form-error-message">{errors.submit}</div>
          )}

          <div className="form-columns">
            <div className="form-column">
              <div className="form-group">
                <label htmlFor="name">Product Name*</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                />
                {errors.name && (
                  <div className="error-message">{errors.name}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="sku">SKU*</label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className={errors.sku ? "error" : ""}
                />
                {errors.sku && (
                  <div className="error-message">{errors.sku}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="category">Category*</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? "error" : ""}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <div className="error-message">{errors.category}</div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price ($)*</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className={errors.price ? "error" : ""}
                  />
                  {errors.price && (
                    <div className="error-message">{errors.price}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="discontinued">Discontinued</option>
                    <option value="seasonal">Seasonal</option>
                    <option value="limited">Limited</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="seasonalTrend">Seasonal Trend</label>
                <select
                  id="seasonalTrend"
                  name="seasonalTrend"
                  value={formData.seasonalTrend}
                  onChange={handleChange}
                >
                  <option value="stable">Stable (Year-round)</option>
                  <option value="winter-high">Winter High Demand</option>
                  <option value="summer-high">Summer High Demand</option>
                  <option value="spring-high">Spring High Demand</option>
                  <option value="fall-high">Fall High Demand</option>
                  <option value="holiday">Holiday Seasonal</option>
                </select>
              </div>
            </div>

            <div className="form-column">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quantity">Quantity*</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={errors.quantity ? "error" : ""}
                  />
                  {errors.quantity && (
                    <div className="error-message">{errors.quantity}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lowStockThreshold">Low Stock Alert</label>
                  <input
                    type="number"
                    id="lowStockThreshold"
                    name="lowStockThreshold"
                    min="0"
                    value={formData.lowStockThreshold}
                    onChange={handleChange}
                    className={errors.lowStockThreshold ? "error" : ""}
                  />
                  {errors.lowStockThreshold && (
                    <div className="error-message">
                      {errors.lowStockThreshold}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="location">Storage Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="ingredients">Ingredients</label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  rows="4"
                  value={formData.ingredients}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="expirationDate">Expiration Date</label>
                <input
                  type="date"
                  id="expirationDate"
                  name="expirationDate"
                  value={formData.expirationDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">Product Image</label>
                <div className="image-upload-container">
                  <div className="image-preview">
                    {previewImage ? (
                      <img src={previewImage} alt="Product preview" />
                    ) : (
                      <div className="no-image">
                        <i className="fas fa-image"></i>
                        <span>No image selected</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <button
                    type="button"
                    className="btn-upload"
                    onClick={() => document.getElementById("image").click()}
                  >
                    <i className="fas fa-upload"></i>{" "}
                    {previewImage ? "Change Image" : "Upload Image"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(`/products/${id}`)}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditProduct;
