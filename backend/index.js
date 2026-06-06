require("dotenv").config();
const bodyparser = require("body-parser");
const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("./db");
const router = require("./Routes/index");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello this is internshala backend");
});
app.use("/api", router);
const communityRoutes = require("./Routes/community");
const passwordRoutes = require("./Routes/password");
const resumeRoutes = require("./Routes/resume");
const subscriptionRoutes = require("./Routes/subscription");
const authRoutes = require("./Routes/auth");
const languageRoutes = require("./Routes/language");
const notificationRoutes = require("./Routes/notification");
app.use("/api", communityRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
const adminRoutes = require("./Routes/admin");
app.use("/api/admin", adminRoutes);
app.use("/api/language", languageRoutes);
connect();
app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
  next();
});
app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
