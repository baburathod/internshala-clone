const express = require("express");
const router = express.Router();
const Notification = require("../Model/Notification");
const User = require("../Model/User");

// Get all notifications for a user
router.get("/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const notifications = await Notification.find({ user: user._id })
      .populate("relatedUser", "name photo")
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.put("/:id/read", async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notification) return res.status(404).json({ error: "Notification not found" });
    
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all notifications as read for a user
router.put("/mark-all-read/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    await Notification.updateMany({ user: user._id, isRead: false }, { $set: { isRead: true } });
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper to create a notification (used internally by other routes)
router.createNotification = async (userId, type, message, relatedUserId = null, link = null) => {
  try {
    const notif = new Notification({
      user: userId,
      type,
      message,
      relatedUser: relatedUserId,
      link
    });
    await notif.save();
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};

module.exports = router;
