const express = require("express");
const router = express.Router();
const PasswordReset = require("../Model/PasswordReset");
const admin = require("../firebaseAdmin");
const { sendResetEmail } = require("../services/emailService");

// Helper: Generate random password (A-Z, a-z only)
const generatePassword = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

router.post("/reset", async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ error: "Identifier (Email or Phone) is required" });
    }

    // 1. Rate-limit validation (24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingReset = await PasswordReset.findOne({
      identifier,
      resetDate: { $gte: oneDayAgo }
    });

    if (existingReset) {
      return res.status(429).json({ error: "You can use this option only once per day." });
    }

    // 2. Find Firebase User
    let firebaseUser;
    const isEmail = identifier.includes("@");

    try {
      if (isEmail) {
        firebaseUser = await admin.auth().getUserByEmail(identifier);
      } else {
        firebaseUser = await admin.auth().getUserByPhoneNumber(identifier);
      }
    } catch (firebaseErr) {
      console.error("Firebase Auth Error:", firebaseErr);
      return res.status(404).json({ error: "User not found in authentication system" });
    }

    // 3. Generate Password
    const newPassword = generatePassword(10);

    // 4. Update Firebase password
    await admin.auth().updateUser(firebaseUser.uid, { password: newPassword });

    // 5. Store PasswordReset record
    const resetRecord = new PasswordReset({
      identifier,
      temporaryPassword: newPassword
    });
    await resetRecord.save();

    // 6. Send password
    if (isEmail) {
      // Send via Nodemailer
      await sendResetEmail(identifier, newPassword);
    } else {
      // Mock SMS
      console.log(`[MOCK SMS] To: ${identifier} | Your new temporary password is: ${newPassword}`);
    }

    res.status(200).json({ message: "A temporary password has been sent." });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
