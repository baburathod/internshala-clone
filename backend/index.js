require("dotenv").config();
const bodyparser = require("body-parser");
const express = require("express");
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

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
const messageRoutes = require("./Routes/message");
const Message = require("./Model/Message");
const User = require("./Model/User");

app.use("/api", communityRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/messages", messageRoutes);
const userRoutes = require("./Routes/user");
app.use("/api/users", userRoutes);
const adminRoutes = require("./Routes/admin");
app.use("/api/admin", adminRoutes);
app.use("/api/language", languageRoutes);
connect();
app.use((req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// --- SOCKET.IO SETUP ---
const activeUsers = new Map(); // uid -> socketId

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("register", (uid) => {
    activeUsers.set(uid, socket.id);
    console.log("User registered:", uid);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { senderUid, receiverUid, text } = data;
      const senderUser = await User.findOne({ uid: senderUid });
      const receiverUser = await User.findOne({ uid: receiverUid });

      if (senderUser && receiverUser) {
        const msg = new Message({
          sender: senderUser._id,
          receiver: receiverUser._id,
          text
        });
        await msg.save();

        const receiverSocketId = activeUsers.get(receiverUid);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", {
            ...msg.toObject(),
            sender: senderUser // populate sender details
          });
        }
      }
    } catch (error) {
      console.error("Socket send message error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (let [uid, id] of activeUsers.entries()) {
      if (id === socket.id) {
        activeUsers.delete(uid);
        break;
      }
    }
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
