const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personalDetails: {
    fullName: String,
    email: String,
    phone: String,
    linkedin: String
  },
  education: [{ degree: String, institution: String, year: String }],
  experience: [{ title: String, company: String, duration: String, description: String }],
  skills: [String],
  
  // Storage
  resumeUrl: String,
  
  // OTP Flow tracking
  otp: { code: String, expiresAt: Date },
  otpAttempts: { type: Number, default: 0 },
  isEmailVerified: { type: Boolean, default: false },
  
  // Payment Tracking
  paymentId: String,
  paymentAmount: Number,
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Resume", ResumeSchema);
