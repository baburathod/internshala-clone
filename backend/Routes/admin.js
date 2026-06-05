const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const Job = require("../Model/Job");
const Internship = require("../Model/Internship");
const Application = require("../Model/Application");
const Subscription = require("../Model/Subscription");
const Post = require("../Model/Post");

const adminuser = "admin";
const adminpass = "admin";

router.post("/adminlogin", (req, res) => {
  const { username, password } = req.body;
  if (username === adminuser && password === adminpass) {
    res.status(200).json({ token: "admin_token_123" });
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

// Analytics
router.get("/analytics", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalInternships = await Internship.countDocuments();
    const totalApplications = await Application.countDocuments();
    
    // Revenue (Sum of all paid subscriptions)
    const paidSubscriptions = await Subscription.find({ status: "paid" });
    const totalRevenue = paidSubscriptions.reduce((acc, sub) => acc + (sub.amount || 0), 0);

    res.status(200).json({
      totalUsers,
      totalJobs,
      totalInternships,
      totalApplications,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users CRUD
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Jobs CRUD
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete("/jobs/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Job deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Internships CRUD
router.get("/internships", async (req, res) => {
  try {
    const internships = await Internship.find();
    res.status(200).json(internships);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete("/internships/:id", async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Internship deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Posts CRUD
router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name email");
    res.status(200).json(posts);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

router.delete("/posts/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted" });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Subscriptions CRUD
router.get("/subscriptions", async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate("user", "name email");
    res.status(200).json(subscriptions);
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
