const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  costPrice: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
  },
  supplier: {
    type: String,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "discontinued", "seasonal", "limited"],
    default: "active",
  },
  // Add fields for the additional data from frontend
  seasonalTrend: {
    type: String,
    enum: [
      "stable",
      "winter-high",
      "summer-high",
      "spring-high",
      "fall-high",
      "holiday",
    ],
    default: "stable",
  },
  expirationDate: {
    type: Date,
  },
  ingredients: {
    type: String,
  },
  location: {
    type: String,
  },
  // Store any other custom fields
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field on save
ProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
