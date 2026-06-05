const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const express = require('express');
const request = require('supertest');
const Job = require('./Model/Job');
const Internship = require('./Model/Internship');
const LoginHistory = require('./Model/LoginHistory');
const User = require('./Model/User');
const jobRouter = require('./Routes/job');
const internshipRouter = require('./Routes/internship');
const authRouter = require('./Routes/auth');

async function runVerification() {
  console.log("1. Starting MongoDB Memory Server...");
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  console.log("2. Connecting Mongoose to in-memory DB...");
  await mongoose.connect(uri);

  console.log("3. Running seed operations...");
  const categories = ["Engineering", "Marketing", "Design", "Data Science"];
  const locations = ["Mumbai", "Bangalore", "Delhi", "Remote"];
  const companies = ["TechCorp", "Innovate LLC", "Global Solutions"];

  const jobs = [];
  const internships = [];
  for (let i = 1; i <= 25; i++) {
    jobs.push({
      title: `Job ${i}`,
      company: companies[i % companies.length],
      location: locations[i % locations.length],
      category: categories[i % categories.length],
      aboutCompany: "Test",
      aboutJob: "Test",
      whoCanApply: "Test",
      perks: ["Test"],
      AdditionalInfo: "Test",
      CTC: "Test",
      StartDate: "Test"
    });
    internships.push({
      title: `Internship ${i}`,
      company: companies[i % companies.length],
      location: locations[i % locations.length],
      category: categories[i % categories.length],
      aboutCompany: "Test",
      aboutInternship: "Test",
      whoCanApply: "Test",
      perks: ["Test"],
      stipend: "Test",
      startDate: "Test",
      numberOfOpening: "1"
    });
  }
  await Job.insertMany(jobs);
  await Internship.insertMany(internships);

  const mockUser = await User.create({ name: "Test User", email: "test@example.com", uid: "test12345" });
  await LoginHistory.create({
    user: mockUser._id,
    browser: "Chrome",
    os: "Windows",
    deviceType: "Desktop",
    ipAddress: "127.0.0.1",
    status: "Success"
  });

  console.log("\n=================== VERIFICATION EVIDENCE ===================");
  const jobCount = await Job.countDocuments();
  const internCount = await Internship.countDocuments();
  const historyCount = await LoginHistory.countDocuments();

  console.log(`\ndb.jobs.countDocuments() => ${jobCount}`);
  console.log(`db.internships.countDocuments() => ${internCount}`);
  console.log(`db.loginhistories.countDocuments() => ${historyCount}`);

  console.log("\n--- Mocking Express API ---");
  const app = express();
  app.use(express.json());
  app.use("/api/job", jobRouter);
  app.use("/api/internship", internshipRouter);
  app.use("/api/auth", authRouter);

  console.log("\nExecuting GET /api/job...");
  const jobRes = await request(app).get('/api/job');
  console.log(`Status: ${jobRes.status}`);
  console.log(`Jobs returned via API: ${jobRes.body.length}`);
  console.log(`Sample Job: ${JSON.stringify(jobRes.body[0], null, 2)}`);

  console.log("\nExecuting GET /api/auth/history/test12345...");
  const historyRes = await request(app).get('/api/auth/history/test12345');
  console.log(`Status: ${historyRes.status}`);
  console.log(`History records returned: ${historyRes.body.length}`);
  console.log(`Sample History: ${JSON.stringify(historyRes.body[0], null, 2)}`);

  console.log("=============================================================");

  await mongoose.disconnect();
  await mongod.stop();
  process.exit(0);
}

runVerification();
