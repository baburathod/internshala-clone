const mongoose = require("mongoose");
const Internshipschema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  category: String,
  aboutCompany: String,
  aboutInternship: String,
  whoCanApply: String,
  perks: Array,
  numberOfOpening: String,
  stipend: String,
  startDate: String,
  additionalInfo: String,
  workFromHome: { type: Boolean, default: false },
  partTime: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports=mongoose.model("Internship",Internshipschema)
