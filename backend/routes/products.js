const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/auth");

// @route   GET /api/products
// @desc    Get all products
// @access  Private
router.get("/", protect, getProducts);

// @route   GET /api/products/:id
// @desc    Get a single product
// @access  Private
router.get("/:id", protect, getProductById);

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post("/", protect, admin, createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put("/:id", protect, admin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
