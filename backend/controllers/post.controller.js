import mongoose from "mongoose";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;

    if (!mediaType || !["image", "video"].includes(mediaType.toLowerCase())) {
      return res.json({
        success: false,
        message: "Media type must be 'image' or 'video'.",
      });
    }

    if (!req.file) {
      return res.json({
        success: false,
        message: "Please upload an image or video.",
      });
    }

    const mediaUrl = await uploadOnCloudinary(req.file.path);

    const newPost = await Post.create({
      caption: caption?.trim() || "",
      media: mediaUrl,
      mediaType: mediaType.toLowerCase(),
      author: req.userId,
    });

    await User.findByIdAndUpdate(req.userId, { $push: { posts: newPost._id } });

    const populatedPost = await Post.findById(newPost._id).populate(
      "author",
      "name userName profileImage"
    );

    res.json({
      success: true,
      message: "Post created successfully.",
      data: populatedPost,
    });
  } catch (error) {
    console.log("Error creating post:", error);
    res.json({
      success: false,
      message: "Something went wrong while creating the post.",
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate([
        { path: "author", select: "name userName profileImage" },
        { path: "comments.author", select: "name userName profileImage" },
      ]);

    res.json({
      success: true,
      message: "Posts fetched successfully.",
      data: posts,
    });
  } catch (error) {
    console.log("Error fetching posts:", error);
    res.json({
      success: false,
      message: "Something went wrong while fetching posts.",
    });
  }
};

export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.json({ success: false, message: "Invalid post ID." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.json({ success: false, message: "Post not found." });
    }

    const alreadyLiked = post.likes.some(
      (id) => id.toString() === req.userId.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.userId.toString()
      );
    } else {
      post.likes.push(req.userId);
    }

    await post.save();

    const populatedPost = await Post.findById(postId).populate(
      "author",
      "name userName profileImage"
    );

    res.json({
      success: true,
      message: alreadyLiked
        ? "Post unliked successfully."
        : "Post liked successfully.",
      data: populatedPost,
    });
  } catch (error) {
    console.log("Error toggling like:", error);
    res.json({
      success: false,
      message: "Something went wrong while liking post.",
    });
  }
};

export const addCommentToPost = async (req, res) => {
  try {
    const { message } = req.body;
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.json({ success: false, message: "Invalid post ID." });
    }

    if (!message || !message.trim()) {
      return res.json({ success: false, message: "Comment cannot be empty." });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.json({ success: false, message: "Post not found." });
    }

    post.comments.push({ author: req.userId, message: message.trim() });
    await post.save();

    const populatedPost = await Post.findById(postId).populate([
      { path: "author", select: "name userName profileImage" },
      { path: "comments.author", select: "name userName profileImage" },
    ]);

    res.json({
      success: true,
      message: "Comment added successfully.",
      data: populatedPost,
    });
  } catch (error) {
    console.log("Error adding comment:", error);
    res.json({
      success: false,
      message: "Something went wrong while adding comment.",
    });
  }
};

export const toggleSavePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.json({ success: false, message: "Invalid post ID." });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    const alreadySaved = user.saved.some(
      (id) => id.toString() === postId.toString()
    );

    if (alreadySaved) {
      user.saved = user.saved.filter(
        (id) => id.toString() !== postId.toString()
      );
    } else {
      user.saved.push(postId);
    }

    await user.save();

    res.json({
      success: true,
      message: alreadySaved
        ? "Post removed from saved list."
        : "Post saved successfully.",
      data: user,
    });
  } catch (error) {
    console.log("Error toggling save:", error);
    res.json({
      success: false,
      message: "Something went wrong while saving post.",
    });
  }
};
