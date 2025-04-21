import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import Layout from "../components/Layout";
import "../assets/styles/ProductForm.css";

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct, loading } = useContext(ProductContext);
  const [categories, setCategories] = useState([
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
    lowStockThreshold: "10",
    description: "",
    location: "",
    status: "active",
    image: "",
    seasonalTrend: "stable",
    expirationDate: "",
    ingredients: "",
  });

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  // Generate a unique SKU when component mounts
  useEffect(() => {
    const generateSKU = () => {
      const prefix = "PET";
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");
      return `${prefix}-${timestamp}-${random}`;
    };

    setFormData((prev) => ({ ...prev, sku: generateSKU() }));
  }, []);

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
      newErrors.lowStockThreshold = "Stock threshold is required";
    } else if (
      isNaN(formData.lowStockThreshold) ||
      parseInt(formData.lowStockThreshold) < 0
    ) {
      newErrors.lowStockThreshold = "Stock threshold must be a positive number";
    }

    if (!formData.seasonalTrend) {
      newErrors.seasonalTrend = "Seasonal trend is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Convert numeric strings to numbers and prepare data for backend
    const productData = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      description: formData.description,
      price: parseFloat(formData.price),
      // Add costPrice field required by backend model
      costPrice: parseFloat(formData.price) * 0.7, // Example: 70% of selling price
      quantity: parseInt(formData.quantity),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      // Map frontend fields to backend expected fields
      supplier: "Default Supplier", // You could add this field to your form
      status: formData.status,
      image: formData.image,
      // Additional fields from your form
      seasonalTrend: formData.seasonalTrend,
      expirationDate: formData.expirationDate,
      ingredients: formData.ingredients,
      location: formData.location,
    };

    try {
      await addProduct(productData);
      navigate("/products");
    } catch (error) {
      console.error("Failed to add product:", error);
      setErrors({ submit: "Failed to add product. Please try again." });
    }
  };

  return (
    <Layout>
      <div className="product-form-page">
        <div className="page-header">
          <div className="header-left">
            <Link to="/products" className="btn-back">
              <i className="fas fa-arrow-left"></i> Back to Products
            </Link>
            <h1>Add New Pet Food Product</h1>
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
                <label htmlFor="category">Pet Food Category*</label>
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
                    value={formData.price}
                    onChange={handleChange}
                    className={errors.price ? "error" : ""}
                  />
                  {errors.price && (
                    <div className="error-message">{errors.price}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Stock Quantity*</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={errors.quantity ? "error" : ""}
                  />
                  {errors.quantity && (
                    <div className="error-message">{errors.quantity}</div>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="lowStockThreshold">Minimum Stock*</label>
                  <input
                    type="number"
                    id="lowStockThreshold"
                    name="lowStockThreshold"
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

                <div className="form-group">
                  <label htmlFor="status">Product Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="discontinued">Discontinued</option>
                    <option value="seasonal">Seasonal</option>
                    <option value="limited">Limited Edition</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="seasonalTrend">Seasonal Trend*</label>
                <select
                  id="seasonalTrend"
                  name="seasonalTrend"
                  value={formData.seasonalTrend}
                  onChange={handleChange}
                  className={errors.seasonalTrend ? "error" : ""}
                >
                  <option value="stable">Stable (Year-round)</option>
                  <option value="winter-high">Winter High Demand</option>
                  <option value="summer-high">Summer High Demand</option>
                  <option value="spring-high">Spring High Demand</option>
                  <option value="fall-high">Fall High Demand</option>
                  <option value="holiday">Holiday Seasonal</option>
                </select>
                {errors.seasonalTrend && (
                  <div className="error-message">{errors.seasonalTrend}</div>
                )}
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label htmlFor="description">Product Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
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
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {previewImage && (
                  <div className="image-preview">
                    <img src={previewImage} alt="Product preview" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </button>
            <Link to="/products" className="btn-cancel">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddProduct;
