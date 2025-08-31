import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "./../middlewares/multer.js";
import {
  addCommentToLoop,
  createLoop,
  getALlLoops,
  toggleLikeLoop,
} from "./../controllers/loop.controller.js";

const loopRouter = express.Router();

loopRouter.post("/upload", isAuth, upload.single("media"), createLoop);
loopRouter.get("/getAll", isAuth, getALlLoops);
loopRouter.get("/like/:loopId", isAuth, toggleLikeLoop);
loopRouter.post("/comment/:loopId", isAuth, addCommentToLoop);

export default loopRouter;
