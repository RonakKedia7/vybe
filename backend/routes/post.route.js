import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "./../middlewares/multer.js";
import {
  addCommentToPost,
  createPost,
  getAllPosts,
  toggleLikePost,
  toggleSavePost,
} from "../controllers/post.controller.js";

const postRouter = express.Router();

postRouter.post("/upload", isAuth, upload.single("media"), createPost);
postRouter.get("/getAll", isAuth, getAllPosts);
postRouter.get("/like/:postId", isAuth, toggleLikePost);
postRouter.get("/saved/:postId", isAuth, toggleSavePost);
postRouter.post("/comment/:postId", isAuth, addCommentToPost);

export default postRouter;
