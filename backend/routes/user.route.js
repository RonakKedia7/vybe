import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  editProfile,
  getCurrentUser,
  getFollowingUsers,
  getProfile,
  getUserById,
  search,
  suggestedUsers,
  toggleFollow,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/get/:userId", isAuth, getUserById);
userRouter.get("/suggested", isAuth, suggestedUsers);
userRouter.get("/search", isAuth, search);
userRouter.get("/getProfile/:userName", isAuth, getProfile);
userRouter.get("/follow/:targetUserId", isAuth, toggleFollow);
userRouter.get("/getFollowing", isAuth, getFollowingUsers);
userRouter.post(
  "/editProfile",
  isAuth,
  upload.single("profileImage"),
  editProfile
);
export default userRouter;
