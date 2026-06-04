const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plan: { type: String, enum: ['Bronze', 'Silver', 'Gold'] },
  amount: Number,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
