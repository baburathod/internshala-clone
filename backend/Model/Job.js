const mongoose = require("mongoose");
const JobShcema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  Experience: String,
  category: String,
  aboutCompany: String,
  aboutJob: String,
  whoCanApply: String,
  perks: Array,
  AdditionalInfo: String,
  CTC: String,
  StartDate: String,
  workFromHome: { type: Boolean, default: false },
  partTime: { type: Boolean, default: false },
  createAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Job", JobShcema);
