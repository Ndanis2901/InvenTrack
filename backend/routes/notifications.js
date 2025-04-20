const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
} = require("../controllers/notificationController");
const { protect, admin } = require("../middleware/auth");

// @route   GET /api/notifications
// @desc    Get all notifications for the user
// @access  Private
router.get("/", protect, getNotifications);

// @route   PUT /api/notifications/:id
// @desc    Mark a notification as read
// @access  Private
router.put("/:id", protect, markAsRead);

// @route   PUT /api/notifications/mark-all
// @desc    Mark all notifications as read
// @access  Private
router.put("/mark-all", protect, markAllAsRead);

// @route   POST /api/notifications
// @desc    Create a notification
// @access  Private/Admin
router.post("/", protect, admin, createNotification);

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private/Admin
router.delete("/:id", protect, admin, deleteNotification);

module.exports = router;
