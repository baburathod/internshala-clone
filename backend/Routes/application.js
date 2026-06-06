const express = require("express");
const router = express.Router();
const application = require("../Model/Application");
const User = require("../Model/User");
const requireAuth = require("../middleware/requireAuth");

// Middleware to enforce subscription limits
const enforceSubscriptionLimits = async (req, res, next) => {
  try {
    // req.user is now populated by requireAuth middleware
    const user = req.user;
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check plan expiration
    if (user.subscriptionEndDate && new Date() > user.subscriptionEndDate) {
      user.subscriptionPlan = 'Free';
      user.subscriptionStartDate = null;
      user.subscriptionEndDate = null;
    }

    // Handle Monthly Reset
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    if (user.lastApplicationMonth !== currentMonth) {
      user.applicationsUsedThisMonth = 0;
      user.lastApplicationMonth = currentMonth;
    }

    // Determine limits
    const planLimits = {
      'Free': 1,
      'Bronze': 3,
      'Silver': 5,
      'Gold': Infinity
    };
    
    const limit = planLimits[user.subscriptionPlan] || 1;

    if (user.applicationsUsedThisMonth >= limit) {
      await user.save(); // save the potential resets from above
      return res.status(403).json({ 
        error: `Application limit reached for ${user.subscriptionPlan} plan. Please upgrade to apply for more internships.` 
      });
    }

    // Attach to request for later save
    req.dbUser = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

router.post("/", requireAuth, enforceSubscriptionLimits, async (req, res) => {
  const applicationipdata = new application({
    company: req.body.company,
    category: req.body.category,
    coverLetter: req.body.coverLetter,
    user: req.body.user,
    Application: req.body.Application,
    body: req.body.body,
  });

  try {
    const data = await applicationipdata.save();
    
    // Increment tracking after successful save
    const user = req.dbUser;
    user.applicationsUsedThisMonth += 1;
    await user.save();

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to save application" });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await application.find();
    res.json(data).status(200);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await application.findById(id);
    if (!data) {
      res.status(404).json({ error: "application not found" });
    }
    res.json(data).status(200);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  let status;
  if (action === "accepted") {
    status = "accepted";
  } else if (action === "rejected") {
    status = "rejected";
  } else {
    res.status(404).json({ error: "Invalid action" });
    return;
  }
  try {
    const updateapplication = await application.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    if (!updateapplication) {
      res.status(404).json({ error: "Not able to update the application" });
      return;
    }
    res.status(200).json({ sucess: true, data: updateapplication });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
