const mongoose = require("mongoose");

const LoginOtpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  code: String,
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("LoginOtp", LoginOtpSchema);
