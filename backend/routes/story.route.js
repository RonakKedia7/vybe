import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "./../middlewares/multer.js";
import {
  getAllStories,
  getStoryByUsername,
  uploadStory,
  viewStory,
} from "../controllers/story.controller.js";

const storyRouter = express.Router();

storyRouter.post("/upload", isAuth, upload.single("media"), uploadStory);
storyRouter.get("/view/:storyId", isAuth, viewStory);
storyRouter.get("/getByUserName/:userName", isAuth, getStoryByUsername);
storyRouter.get("/getAll", isAuth, getAllStories);

export default storyRouter;
