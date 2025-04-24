const mongoose = require("mongoose");

const SalesHistorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  },
  isHoliday: {
    type: Boolean,
    default: false,
  },
  holidayName: {
    type: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Index for faster queries
SalesHistorySchema.index({ productId: 1, date: 1 });

module.exports = mongoose.model("SalesHistory", SalesHistorySchema);
