const mongoose = require("mongoose");

const LoginHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  browser: String,         // e.g., "Chrome", "Firefox"
  os: String,              // e.g., "Windows", "Android", "iOS"
  deviceType: String,      // "Mobile", "Tablet", "Desktop"
  ipAddress: String,       // IPv4 / IPv6
  status: { type: String, enum: ['Success', 'Failed_TimeRestriction', 'OTP_Pending', 'Failed_InvalidOTP'] },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LoginHistory", LoginHistorySchema);
