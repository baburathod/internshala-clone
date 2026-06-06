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

// Employer: Get applications for their company
router.get("/employer/:uid", async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user || !user.companyName) {
      return res.status(400).json({ error: "User is not associated with a company" });
    }
    
    // Using RegExp for case-insensitive match
    const data = await application.find({ company: new RegExp(`^${user.companyName}$`, 'i') });
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
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

// We export notification directly or require it
const notificationRouter = require("./notification");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "internshalaclone.auth@gmail.com", // use a dummy or real env
    pass: "dummy_password", // Ideally use process.env.EMAIL_PASS
  },
});

router.put("/status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const validStatuses = ["pending", "reviewing", "interview", "hired", "rejected"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const updateapplication = await application.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    
    if (!updateapplication) {
      return res.status(404).json({ error: "Not able to update the application" });
    }

    // Trigger Notification for candidate
    if (updateapplication.user && updateapplication.user.uid) {
      const candidateUser = await User.findOne({ uid: updateapplication.user.uid });
      if (candidateUser) {
        await notificationRouter.createNotification(
          candidateUser._id,
          'ApplicationUpdate',
          `Your application for ${updateapplication.company} has been updated to: ${status.toUpperCase()}`,
          null,
          '/userapplication'
        );

        // Send Email
        if (candidateUser.email) {
          const mailOptions = {
            from: "internshalaclone.auth@gmail.com",
            to: candidateUser.email,
            subject: `Application Status Update: ${updateapplication.company}`,
            html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #008bdc;">Internshala Clone</h2>
                <p>Hello ${candidateUser.name},</p>
                <p>Your application status for the position at <strong>${updateapplication.company}</strong> has been updated to: <strong style="color: #2c3e50; text-transform: uppercase;">${status}</strong>.</p>
                <p>Log in to your Candidate Dashboard to view the details.</p>
                <br/>
                <p>Best regards,<br/>The Internshala Clone Team</p>
              </div>
            `,
          };
          // Don't await transporter to avoid blocking the response, or catch error silently
          transporter.sendMail(mailOptions).catch(err => console.error("Email send failed:", err));
        }
      }
    }

    res.status(200).json({ success: true, data: updateapplication });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
