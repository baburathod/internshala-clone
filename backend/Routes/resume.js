const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Resume = require("../Model/Resume");
const User = require("../Model/User");
const { sendResetEmail, transporter } = require("../services/emailService");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_12345',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_12345',
});

// 1. Save Draft & Send OTP
router.post("/draft", async (req, res) => {
  try {
    const { uid, personalDetails, education, experience, skills } = req.body;
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const resume = new Resume({
      user: user._id,
      personalDetails,
      education,
      experience,
      skills,
      otp: { code: otpCode, expiresAt },
      otpAttempts: 0
    });
    await resume.save();

    // Send OTP via Nodemailer
    const mailOptions = {
      from: '"Internshala Clone" <no-reply@internshalaclone.com>',
      to: personalDetails.email || user.email,
      subject: "Resume Builder OTP Verification",
      text: `Your OTP for generating your resume is: ${otpCode}. It expires in 10 minutes.`
    };
    
    // Attempt sending, non-blocking for mock tests if needed
    transporter.sendMail(mailOptions).catch(err => console.error("OTP Email Error:", err));
    console.log(`[MOCK EMAIL SENT] To: ${personalDetails.email || user.email} | OTP: ${otpCode}`);

    res.status(200).json({ message: "Draft saved and OTP sent", resumeId: resume._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { resumeId, otpCode } = req.body;
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    if (resume.otpAttempts >= 3) {
      return res.status(403).json({ error: "Maximum OTP attempts exceeded" });
    }

    if (new Date() > resume.otp.expiresAt) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (resume.otp.code !== otpCode) {
      resume.otpAttempts += 1;
      await resume.save();
      return res.status(400).json({ error: "Invalid OTP" });
    }

    resume.isEmailVerified = true;
    await resume.save();

    res.status(200).json({ message: "OTP Verified Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Create Razorpay Order
router.post("/create-order", async (req, res) => {
  try {
    const { resumeId } = req.body;
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    if (!resume.isEmailVerified) return res.status(403).json({ error: "Email not verified" });

    const amount = 5000; // ₹50 in paise

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_resume_${resumeId}`
    };

    const order = await razorpay.orders.create(options);
    
    resume.paymentAmount = 50;
    resume.paymentId = order.id;
    resume.paymentStatus = 'pending';
    await resume.save();

    res.status(200).json({ order, key_id: razorpay.key_id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Verify Razorpay Payment
router.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, resumeId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'secret_12345')
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const resume = await Resume.findById(resumeId);
      resume.paymentStatus = 'paid';
      await resume.save();
      res.status(200).json({ message: "Payment verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Attach Resume Profile
router.put("/attach", async (req, res) => {
  try {
    const { resumeId, resumeUrl } = req.body;
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "Resume not found" });
    
    // Only allow attachment if paid
    if (resume.paymentStatus !== 'paid') {
      return res.status(403).json({ error: "Payment not completed" });
    }

    resume.resumeUrl = resumeUrl;
    await resume.save();

    // Attach to user profile
    await User.findByIdAndUpdate(resume.user, { resumeUrl });

    res.status(200).json({ message: "Resume attached to profile successfully", resumeUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
