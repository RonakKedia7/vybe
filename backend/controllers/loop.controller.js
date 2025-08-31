import mongoose from "mongoose";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Loop from "../models/loop.model.js";

export const createLoop = async (req, res) => {
  try {
    const { caption } = req.body;

    if (!req.file) {
      return res.json({
        success: false,
        message: "Please upload an image or video.",
      });
    }

    const mediaUrl = await uploadOnCloudinary(req.file.path);

    const newLoop = await Loop.create({
      caption: caption?.trim() || "",
      media: mediaUrl,
      author: req.userId,
    });

    await User.findByIdAndUpdate(req.userId, { $push: { loops: newLoop._id } });

    const populatedLoop = await Loop.findById(newLoop._id).populate(
      "author",
      "name userName profileImage"
    );

    res.json({
      success: true,
      message: "Loop created successfully.",
      data: populatedLoop,
    });
  } catch (error) {
    console.error("Error creating loop:", error);
    res.json({
      success: false,
      message: "Failed to create loop. Please try again.",
    });
  }
};

export const getALlLoops = async (req, res) => {
  try {
    const loops = await Loop.find({})
      .sort({ createdAt: -1 })
      .populate([
        { path: "author", select: "name userName profileImage" },
        { path: "comments.author", select: "name userName profileImage" },
      ]);

    res.json({
      success: true,
      message: "Loops fetched successfully.",
      data: loops,
    });
  } catch (error) {
    console.log("Error fetching loops:", error);
    res.json({
      success: false,
      message: "Something went wrong while fetching loops.",
    });
  }
};

export const toggleLikeLoop = async (req, res) => {
  try {
    const { loopId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(loopId)) {
      return res.json({ success: false, message: "Invalid loop ID." });
    }

    const loop = await Loop.findById(loopId);
    if (!loop) {
      return res.json({ success: false, message: "Loop not found." });
    }

    const alreadyLiked = loop.likes.some(
      (id) => id.toString() === req.userId.toString()
    );

    if (alreadyLiked) {
      loop.likes = loop.likes.filter(
        (id) => id.toString() !== req.userId.toString()
      );
    } else {
      loop.likes.push(req.userId);
    }

    await loop.save();

    const populatedLoop = await Loop.findById(loopId).populate(
      "author",
      "name userName profileImage"
    );

    res.json({
      success: true,
      message: alreadyLiked
        ? "Loop unliked successfully."
        : "Loop liked successfully.",
      data: populatedLoop,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.json({
      success: false,
      message: "Failed to toggle like. Please try again.",
    });
  }
};

export const addCommentToLoop = async (req, res) => {
  try {
    const { message } = req.body;
    const { loopId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(loopId)) {
      return res.json({ success: false, message: "Invalid loop ID." });
    }

    if (!message || !message.trim()) {
      return res.json({
        success: false,
        message: "Comment cannot be empty.",
      });
    }

    const loop = await Loop.findById(loopId);
    if (!loop) {
      return res.json({ success: false, message: "Loop not found." });
    }

    loop.comments.push({ author: req.userId, message: message.trim() });
    await loop.save();

    const populatedLoop = await Loop.findById(loopId).populate([
      { path: "author", select: "name userName profileImage" },
      { path: "comments.author", select: "name userName profileImage" },
    ]);

    res.json({
      success: true,
      message: "Comment added successfully.",
      data: populatedLoop,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.json({
      success: false,
      message: "Failed to add comment. Please try again.",
    });
  }
};
