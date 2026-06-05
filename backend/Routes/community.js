const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const Post = require("../Model/Post");
const Comment = require("../Model/Comment");
const FriendRequest = require("../Model/FriendRequest");

// ==========================================
// Middleware: Posting Limit Enforcement
// ==========================================
const enforcePostingLimit = async (req, res, next) => {
  try {
    const { uid } = req.body; // Assuming frontend sends firebase uid
    if (!uid) return res.status(400).json({ error: "Missing uid" });

    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const friendCount = user.friends.length;
    
    // Calculate posts created today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const postsToday = await Post.countDocuments({
      user: user._id,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    let limit = 0;
    if (friendCount === 1) limit = 1;
    else if (friendCount === 2) limit = 2;
    else if (friendCount >= 3 && friendCount <= 10) limit = friendCount;
    else if (friendCount > 10) limit = Infinity;

    if (friendCount === 0) {
      return res.status(403).json({ error: "Add friends to start posting." });
    }

    if (postsToday >= limit) {
      return res.status(403).json({ error: `Posting limit reached. Your friend count (${friendCount}) allows ${limit} post(s) per day.` });
    }

    req.dbUser = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// User Routes
// ==========================================

// Sync Firebase UID -> MongoDB
router.post("/users/sync", async (req, res) => {
  try {
    const { uid, name, email, photo } = req.body;
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, name, email, photo });
      await user.save();
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search users
router.get("/users/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    const users = await User.find({ name: { $regex: query, $options: "i" } }).limit(10);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Friend Routes
// ==========================================

// Send Friend Request
router.post("/friends/request", async (req, res) => {
  try {
    const { senderUid, receiverId } = req.body;
    const sender = await User.findOne({ uid: senderUid });
    
    const existingReq = await FriendRequest.findOne({ sender: sender._id, receiver: receiverId });
    if (existingReq) return res.status(400).json({ error: "Request already sent" });

    const friendReq = new FriendRequest({ sender: sender._id, receiver: receiverId });
    await friendReq.save();
    res.status(201).json(friendReq);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept Friend Request
router.put("/friends/accept", async (req, res) => {
  try {
    const { requestId } = req.body;
    const friendReq = await FriendRequest.findById(requestId);
    if (!friendReq) return res.status(404).json({ error: "Request not found" });

    friendReq.status = "accepted";
    await friendReq.save();

    await User.findByIdAndUpdate(friendReq.sender, { $addToSet: { friends: friendReq.receiver } });
    await User.findByIdAndUpdate(friendReq.receiver, { $addToSet: { friends: friendReq.sender } });

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject Friend Request
router.put("/friends/reject", async (req, res) => {
  try {
    const { requestId } = req.body;
    const friendReq = await FriendRequest.findById(requestId);
    if (!friendReq) return res.status(404).json({ error: "Request not found" });

    friendReq.status = "rejected";
    await friendReq.save();
    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Pending Friend Requests for a user
router.get("/friends/requests/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const requests = await FriendRequest.find({ receiver: user._id, status: "pending" })
      .populate("sender", "name photo");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// Post Routes
// ==========================================

// Create Post (with limit enforcement)
router.post("/posts", enforcePostingLimit, async (req, res) => {
  try {
    const { text, image, video } = req.body;
    
    // Backend character limits
    if (text && text.length > 1000) {
      return res.status(400).json({ error: "Post text exceeds maximum limit of 1000 characters." });
    }

    const post = new Post({
      user: req.dbUser._id,
      text,
      image,
      video
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Feed
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name photo")
      .populate({
        path: "comments",
        populate: { path: "user", select: "name photo" }
      })
      .sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like Post
router.put("/posts/:postId/like", async (req, res) => {
  try {
    const { uid } = req.body;
    const user = await User.findOne({ uid });
    const post = await Post.findById(req.params.postId);
    
    if (post.likes.includes(user._id)) {
      post.likes.pull(user._id);
    } else {
      post.likes.push(user._id);
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comment on Post
router.post("/posts/:postId/comment", async (req, res) => {
  try {
    const { uid, text } = req.body;
    const user = await User.findOne({ uid });
    
    const comment = new Comment({
      post: req.params.postId,
      user: user._id,
      text
    });
    await comment.save();

    await Post.findByIdAndUpdate(req.params.postId, {
      $push: { comments: comment._id }
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
