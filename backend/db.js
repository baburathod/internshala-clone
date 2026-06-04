const mongoose=require("mongoose")
require('dotenv').config()
const url = process.env.MONGO_URI;
module.exports.connect=()=>{
    mongoose.connect(url,console.log("Databse is connected"))
}