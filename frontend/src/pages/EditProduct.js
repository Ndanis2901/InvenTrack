import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ProductContext } from "../context/ProductContext";
import Layout from "../components/Layout";
import "../assets/styles/ProductForm.css";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchProductById, editProduct, loading } = useContext(ProductContext);
  const [categories, setCategories] = useState([
    "Electronics",
    "Clothing",
    "Home Goods",
    "Office Supplies",
    "Food & Beverage",
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
  });

  const [originalProduct, setOriginalProduct] = useState(null);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await fetchProductById(id);

        if (product) {
          setOriginalProduct(product);

          // Format the data for the form
          setFormData({
            name: product.name || "",
            sku: product.sku || "",
            category: product.category || "",
            price: product.price?.toString() || "",
            quantity: product.quantity?.toString() || "",
            lowStockThreshold: product.lowStockThreshold?.toString() || "5",
            description: product.description || "",
            location: product.location || "",
            status: product.status || "active",
            image: product.image || "",
          });

          if (product.image) {
            setPreviewImage(product.image);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setIsLoading(false);
        setErrors({ fetch: "Failed to load product data. Please try again." });
      }
    };

    fetchProduct();
  }, [id, fetchProductById]);

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

    // Convert numeric strings to numbers
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      costPrice: parseFloat(formData.price) * 0.7, // Add costPrice if it's required
    };

    try {
      await editProduct(id, productData);
      navigate(`/products/${id}`);
    } catch (error) {
      console.error("Failed to update product:", error);
      setErrors({ submit: "Failed to update product. Please try again." });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="loading">Loading product data...</div>
      </Layout>
    );
  }

  if (!originalProduct && !isLoading) {
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
          {errors.fetch && (
            <div className="form-error-message">{errors.fetch}</div>
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
                  />
                  <button type="button" className="btn-upload">
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
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditProduct;
