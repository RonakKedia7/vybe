import express from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import loopRouter from "./routes/loop.route.js";
import storyRouter from "./routes/story.route.js";
import messageRouter from "./routes/message.route.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("API WORKING ✅");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/loop", loopRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

app.listen(port, () => {
  connectDB();
  console.log(`API Started ✅`);
});
