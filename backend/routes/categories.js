// File: backend/routes/categories.js
const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");

// This is a simple implementation since we don't have a full categories controller yet
router.get("/", protect, (req, res) => {
  // Return a list of predefined categories
  const categories = [
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
  ];

  res.json(categories);
});

module.exports = router;
