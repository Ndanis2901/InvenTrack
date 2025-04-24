const express = require("express");
const router = express.Router();
const {
  recordSale,
  getSalesHistory,
  getAggregatedSales,
} = require("../controllers/salesHistoryController");
const { protect, admin } = require("../middleware/auth");

// @route   POST /api/sales
// @desc    Record a new sales transaction
// @access  Private/Admin
router.post("/", protect, admin, recordSale);

// @route   GET /api/sales/product/:id
// @desc    Get sales history for a product
// @access  Private
router.get("/product/:id", protect, getSalesHistory);

// @route   GET /api/sales/aggregate/:id
// @desc    Get aggregated sales data by month
// @access  Private
router.get("/aggregate/:id", protect, getAggregatedSales);

module.exports = router;
