const express = require("express");
const router = express.Router();
const Message = require("../Model/Message");
const User = require("../Model/User");

// Get chat history between two users
router.get("/:uid1/:uid2", async (req, res) => {
  try {
    const user1 = await User.findOne({ uid: req.params.uid1 });
    const user2 = await User.findOne({ uid: req.params.uid2 });

    if (!user1 || !user2) return res.status(404).json({ error: "User not found" });

    const messages = await Message.find({
      $or: [
        { sender: user1._id, receiver: user2._id },
        { sender: user2._id, receiver: user1._id }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark messages as read
router.put("/read/:uid1/:uid2", async (req, res) => {
  try {
    const senderUser = await User.findOne({ uid: req.params.uid1 });
    const receiverUser = await User.findOne({ uid: req.params.uid2 });
    
    if (!senderUser || !receiverUser) return res.status(404).json({ error: "User not found" });

    await Message.updateMany(
      { sender: senderUser._id, receiver: receiverUser._id, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
