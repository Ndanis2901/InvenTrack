const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["info", "warning", "error", "success"],
    default: "info",
  },
  relatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "onModel",
  },
  onModel: {
    type: String,
    enum: ["Product", "User"],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  forUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", NotificationSchema);
