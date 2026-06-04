const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID
  name: String,
  email: String,
  photo: String,
  resumeUrl: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  subscriptionPlan: { type: String, enum: ['Free', 'Bronze', 'Silver', 'Gold'], default: 'Free' },
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  applicationsUsedThisMonth: { type: Number, default: 0 },
  lastApplicationMonth: String, // format YYYY-MM
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
