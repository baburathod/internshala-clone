const express = require("express");
const router = express.Router();
const UAParser = require("ua-parser-js");
const User = require("../Model/User");
const LoginHistory = require("../Model/LoginHistory");
const LoginOtp = require("../Model/LoginOtp");
const { transporter } = require("../services/emailService");

// Helper to normalize IP
const getClientIp = (req) => {
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    const ips = xForwardedFor.split(',');
    return ips[0].trim();
  }
  return req.socket.remoteAddress || 'Unknown';
};

// Helper: Convert to IST
const getISTTime = () => {
  const date = new Date();
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * 5.5)); // +5:30
};

router.post("/sync", async (req, res) => {
  try {
    const { uid, name, email, photo } = req.body;
    if (!uid || !email) return res.status(400).json({ error: "Missing required fields" });
    
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, name, email, photo });
      await user.save();
    } else {
      user.name = name || user.name;
      user.photo = photo || user.photo;
      await user.save();
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/verify-login", async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return res.status(400).json({ error: "Missing uid" });

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Backend Device Verification
    const userAgent = req.headers['user-agent'];
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";
    const deviceType = parser.getDevice().type === 'mobile' || parser.getDevice().type === 'tablet' 
                       ? 'Mobile' 
                       : (os.includes('Android') || os.includes('iOS') ? 'Mobile' : 'Desktop');
    const ipAddress = getClientIp(req);

    // 1. Mobile Time Restriction (10:00 AM to 1:00 PM IST)
    if (deviceType === 'Mobile') {
      const istDate = getISTTime();
      const hours = istDate.getHours();
      
      // Allowed if hours is 10, 11, or 12. (13:00 is technically hour 13, but "to 1:00 PM" usually means until 12:59:59)
      if (hours < 10 || hours >= 13) {
        await LoginHistory.create({
          user: user._id, browser, os, deviceType, ipAddress, status: 'Failed_TimeRestriction'
        });
        return res.status(403).json({ error: "Mobile logins are only allowed between 10:00 AM and 1:00 PM IST." });
      }
    }

    // 2. Chrome Users OTP Logic
    if (browser.includes('Chrome')) {
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

      // Save OTP independently
      await LoginOtp.create({
        user: user._id,
        code: otpCode,
        expiresAt
      });

      // Immutable Audit Trail
      await LoginHistory.create({
        user: user._id, browser, os, deviceType, ipAddress, status: 'OTP_Pending'
      });

      // Send Email
      transporter.sendMail({
        from: '"Internshala Clone Security" <no-reply@internshalaclone.com>',
        to: user.email,
        subject: "Chrome Login Verification Code",
        text: `Your OTP for Chrome login is: ${otpCode}. It expires in 10 minutes.`
      }).catch(err => console.error("Chrome OTP Email Error:", err));
      console.log(`[MOCK CHROME OTP] To: ${user.email} | OTP: ${otpCode}`);

      return res.status(401).json({ error: "OTP_REQUIRED", message: "OTP sent to your email." });
    }

    // 3. Success for others (e.g. Firefox Desktop)
    await LoginHistory.create({
      user: user._id, browser, os, deviceType, ipAddress, status: 'Success'
    });
    
    return res.status(200).json({ message: "Login verified." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { uid, otpCode } = req.body;
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Backend Device Verification for Audit Trail
    const userAgent = req.headers['user-agent'];
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser().name || "Unknown";
    const os = parser.getOS().name || "Unknown";
    const deviceType = parser.getDevice().type === 'mobile' || parser.getDevice().type === 'tablet' 
                       ? 'Mobile' 
                       : (os.includes('Android') || os.includes('iOS') ? 'Mobile' : 'Desktop');
    const ipAddress = getClientIp(req);

    // Find the latest valid OTP for this user
    const otpRecord = await LoginOtp.findOne({ user: user._id, code: otpCode }).sort({ createdAt: -1 });

    if (!otpRecord) {
      await LoginHistory.create({ user: user._id, browser, os, deviceType, ipAddress, status: 'Failed_InvalidOTP' });
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (new Date() > otpRecord.expiresAt) {
      await LoginHistory.create({ user: user._id, browser, os, deviceType, ipAddress, status: 'Failed_InvalidOTP' });
      return res.status(400).json({ error: "OTP expired" });
    }

    // Delete used OTP
    await LoginOtp.deleteOne({ _id: otpRecord._id });

    // Immutable Audit Trail - Log final success
    await LoginHistory.create({ user: user._id, browser, os, deviceType, ipAddress, status: 'Success' });
    
    res.status(200).json({ message: "OTP Verified Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/history/:uid", async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const history = await LoginHistory.find({ user: user._id }).sort({ timestamp: -1 }).limit(20);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
