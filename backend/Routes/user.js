const express = require("express");
const router = express.Router();
const User = require("../Model/User");

// Sync or fetch single user by UID
router.get("/sync", async (req, res) => {
  try {
    const { uid } = req.query;
    if (!uid) return res.status(400).json({ error: "Missing uid" });
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search users (returns all for messaging list demo)
router.get("/search", async (req, res) => {
  try {
    const q = req.query.q || "";
    const users = await User.find({ name: { $regex: q, $options: "i" } }).select("-__v");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
