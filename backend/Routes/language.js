const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const LoginOtp = require("../Model/LoginOtp");
const { transporter } = require("../services/emailService");

router.post("/request-french", async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "Missing uid" });

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Reuse LoginOtp for language verification
    await LoginOtp.create({
      user: user._id,
      code: otpCode,
      expiresAt
    });

    // Send Email
    transporter.sendMail({
      from: '"Internshala Clone Security" <no-reply@internshalaclone.com>',
      to: user.email,
      subject: "French Language Verification Code",
      text: `Your OTP to activate the French language is: ${otpCode}. It expires in 10 minutes.`
    }).catch(err => console.error("French OTP Email Error:", err));
    
    console.log(`[MOCK FRENCH OTP] To: ${user.email} | OTP: ${otpCode}`);

    return res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/verify-french", async (req, res) => {
  try {
    const { uid, otpCode } = req.body;
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const otpRecord = await LoginOtp.findOne({ user: user._id, code: otpCode }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ error: "OTP expired" });
    }

    // Delete used OTP
    await LoginOtp.deleteOne({ _id: otpRecord._id });
    
    res.status(200).json({ message: "French Language Verified Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
