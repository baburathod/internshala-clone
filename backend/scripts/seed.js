const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Job = require("../Model/Job");
const Internship = require("../Model/Internship");

dotenv.config({ path: "../.env" });

const MONGODB_URI = process.env.MONGO_URI || "mongodb+srv://user:pass@cluster.mongodb.net/dbname";

const categories = ["Engineering", "Marketing", "Design", "Data Science", "Media", "Finance", "HR", "Sales"];
const locations = ["Mumbai", "Bangalore", "Delhi", "Pune", "Hyderabad", "Remote"];
const companies = ["TechCorp", "Innovate LLC", "Global Solutions", "Big Brands Inc", "StartUp Nation", "Enterprise Systems"];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seedData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully.");

    console.log("Clearing existing jobs and internships...");
    await Job.deleteMany({});
    await Internship.deleteMany({});

    const jobs = [];
    for (let i = 1; i <= 25; i++) {
      const isWfh = Math.random() > 0.5;
      jobs.push({
        title: `${randomChoice(categories)} Specialist ${i}`,
        company: randomChoice(companies),
        location: isWfh ? "Remote" : randomChoice(locations),
        Experience: `${Math.floor(Math.random() * 5)} - ${Math.floor(Math.random() * 5) + 3} Years`,
        category: randomChoice(categories),
        aboutCompany: "We are a fast-growing company looking for passionate individuals.",
        aboutJob: "You will be responsible for building cutting-edge solutions and driving growth.",
        whoCanApply: "Anyone with relevant skills and a proactive mindset.",
        perks: ["Health Insurance", "Flexible Hours", "Gym Membership"],
        AdditionalInfo: "Looking for immediate joiners.",
        CTC: `₹${Math.floor(Math.random() * 15) + 5}L - ₹${Math.floor(Math.random() * 25) + 15}L`,
        StartDate: "Immediately",
        workFromHome: isWfh,
        partTime: Math.random() > 0.8
      });
    }

    const internships = [];
    for (let i = 1; i <= 25; i++) {
      const isWfh = Math.random() > 0.5;
      internships.push({
        title: `${randomChoice(categories)} Intern ${i}`,
        company: randomChoice(companies),
        location: isWfh ? "Remote" : randomChoice(locations),
        category: randomChoice(categories),
        aboutCompany: "A dynamic startup offering great learning opportunities.",
        aboutInternship: "Learn the ropes from industry veterans and work on live projects.",
        whoCanApply: "Students currently in their pre-final or final year.",
        perks: ["Certificate", "Letter of Recommendation", "Flexible Work Hours"],
        numberOfOpening: `${Math.floor(Math.random() * 5) + 1}`,
        stipend: `₹${Math.floor(Math.random() * 10) + 5}K / month`,
        startDate: "Immediately",
        additionalInfo: "Pre-placement offer (PPO) available based on performance.",
        workFromHome: isWfh,
        partTime: Math.random() > 0.7
      });
    }

    console.log("Seeding 25 Jobs...");
    await Job.insertMany(jobs);
    
    console.log("Seeding 25 Internships...");
    await Internship.insertMany(internships);

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedData();
