const express = require("express");
const router = express.Router();
const {
  generateForecast,
  getSeasonalPatterns,
} = require("../controllers/forecastController");
const { protect } = require("../middleware/auth");

// IMPORTANT: Route order matters! Specific routes must come before parameter routes
// @route   GET /api/forecast/seasonal-patterns
// @desc    Get seasonal patterns for all products
// @access  Private
router.get("/seasonal-patterns", protect, getSeasonalPatterns);

// @route   GET /api/forecast/:id
// @desc    Generate forecast for a product
// @access  Private
router.get("/:id", protect, generateForecast);

module.exports = router;
