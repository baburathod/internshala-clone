const mongoose = require("mongoose");

const PasswordResetSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  temporaryPassword: { type: String, required: true },
  resetDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PasswordReset", PasswordResetSchema);
