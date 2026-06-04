const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Razorpay = require("razorpay");
const User = require("../Model/User");
const Subscription = require("../Model/Subscription");
const { transporter } = require("../services/emailService");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_12345',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_12345',
});

// Helper: Convert to IST
const getISTTime = () => {
  const date = new Date();
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 5.5)); // +5:30
};

// Middleware: Time Restriction (10:00 AM to 10:59:59 AM IST)
const restrictPaymentTime = (req, res, next) => {
  const istDate = getISTTime();
  const hours = istDate.getHours();
  
  if (hours !== 10) {
    return res.status(403).json({ error: "Payments are only accepted between 10:00 AM and 11:00 AM IST." });
  }
  next();
};

const PLAN_PRICES = {
  Bronze: 100,
  Silver: 300,
  Gold: 1000
};

router.post("/create-order", restrictPaymentTime, async (req, res) => {
  try {
    const { uid, plan } = req.body;
    if (!PLAN_PRICES[plan]) return res.status(400).json({ error: "Invalid plan" });

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const amount = PLAN_PRICES[plan] * 100; // paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_sub_${user._id}`
    });

    const sub = new Subscription({
      user: user._id,
      plan,
      amount: PLAN_PRICES[plan],
      razorpayOrderId: order.id,
      status: "pending"
    });
    await sub.save();

    res.status(200).json({ order, key_id: razorpay.key_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, uid } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_12345')
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const sub = await Subscription.findOne({ razorpayOrderId: razorpay_order_id });
      sub.razorpayPaymentId = razorpay_payment_id;
      sub.status = "paid";
      await sub.save();

      const user = await User.findOne({ uid });
      user.subscriptionPlan = sub.plan;
      user.subscriptionStartDate = new Date();
      
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      user.subscriptionEndDate = endDate;
      
      await user.save();

      // Send Invoice Email
      const invoiceHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #007bff;">Subscription Invoice</h2>
          <p>Hi ${user.name || 'User'},</p>
          <p>Thank you for upgrading to the <strong>${sub.plan} Plan</strong>.</p>
          <table style="width: 100%; max-width: 400px; border-collapse: collapse; margin-top: 15px;">
            <tr style="border-bottom: 1px solid #ccc;">
              <td style="padding: 8px 0;"><strong>Amount Paid:</strong></td>
              <td style="padding: 8px 0; text-align: right;">₹${sub.amount}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ccc;">
              <td style="padding: 8px 0;"><strong>Transaction ID:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${sub.razorpayPaymentId}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ccc;">
              <td style="padding: 8px 0;"><strong>Valid Until:</strong></td>
              <td style="padding: 8px 0; text-align: right;">${endDate.toLocaleDateString()}</td>
            </tr>
          </table>
          <br/>
          <p>Thanks,<br/>Internshala Clone Team</p>
        </div>
      `;

      transporter.sendMail({
        from: '"Internshala Clone" <no-reply@internshalaclone.com>',
        to: user.email,
        subject: "Your Subscription Invoice",
        html: invoiceHtml
      }).catch(err => console.error("Invoice Email Error:", err));

      res.status(200).json({ message: "Payment verified successfully", plan: sub.plan });
    } else {
      res.status(400).json({ error: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
