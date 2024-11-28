import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import path from "path";
import http from "http";
import { chatModel } from "./src/user.schema.js";

export const app = express();

app.use(cors());
app.use(express.static(path.resolve("public")));

export const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const onlineUsers = {};
io.on("connection", async (socket) => {
  console.log("connection established");
  // This is to display the previous messages in the chat
  const premsgs = await chatModel.find({});
  if (premsgs) {
    socket.emit("displaymessage", premsgs);
  }

  socket.on("login", (data) => {
    socket.join(data.room);
    // Emit a welcome message to the user who joined
    onlineUsers[socket.id] = data.user;

    io.to(data.room).emit("welcomeMessage", {
      text: `Welcome, ${data.user}!`,
    });
    // Emiting onlin users
    io.emit("onlineUsers", Object.values(onlineUsers));
  });

  // This is the new messages that user inputs
  socket.on("usermessage", async (data) => {
    let msgarray = [];
    const newMessage = new chatModel({
      username: data.user,
      message: data.userInputValue,
      room: data.room,
      profilepic: data.profile
        ? data.profile
        : "https://img.freepik.com/premium-vector/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-vector-illustration_561158-4215.jpg?semt=ais_hybrid",
      createdAt: new Date(),
    });
    const sendMsg = await newMessage.save();
    msgarray.push(sendMsg);
    io.emit("displaymessage", msgarray);
  });

  // This is to listen for typing
  socket.on("typing", (data) => {
    socket.broadcast.emit("displayTyping", { username: data.username });
  });

  socket.on("stoptyping", () => {
    socket.broadcast.emit("hideTyping");
  });

  socket.on("disconnect", () => {
    delete onlineUsers[socket.id];
    io.emit("onlineUsers", Object.values(onlineUsers));
    console.log("connection disconnected");
  });
});
