const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The user receiving the notification
  type: { type: String, enum: ['Like', 'Comment', 'FriendRequest', 'FriendAccept', 'ApplicationUpdate', 'System'], required: true },
  message: { type: String, required: true },
  relatedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional, user who triggered the event
  link: { type: String }, // Optional, URL to redirect to
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", NotificationSchema);
