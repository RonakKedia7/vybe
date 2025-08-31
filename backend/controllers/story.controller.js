import User from "../models/user.model.js";
import Story from "../models/story.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const uploadStory = async (req, res) => {
  try {
    const { mediaType } = req.body;

    // Validate media type before hitting DB
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

    // Find user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    // Delete old story if exists
    if (user.story) {
      await Story.findByIdAndDelete(user.story);
      user.story = null;
    }

    // Upload media
    const mediaUrl = await uploadOnCloudinary(req.file.path);

    // Create story
    const story = await Story.create({
      author: req.userId,
      mediaType: mediaType.toLowerCase(),
      media: mediaUrl,
    });

    // Update user with new story
    user.story = story._id;
    await user.save();

    // Populate author & viewers
    await story.populate([
      { path: "author", select: "name userName profileImage" },
      { path: "viewers", select: "name userName profileImage" },
    ]);

    res.json({
      success: true,
      data: story,
    });
  } catch (error) {
    console.error("Error uploading story:", error);
    res.json({
      success: false,
      message: "An error occurred while uploading the story.",
    });
  }
};

export const viewStory = async (req, res) => {
  try {
    const { storyId } = req.params;

    if (!storyId) {
      return res
        .status(400)
        .json({ success: false, message: "storyId is required" });
    }

    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { $addToSet: { viewers: req.userId } },
      { new: true }
    ).populate([
      { path: "author", select: "name userName profileImage" },
      { path: "viewers", select: "name userName profileImage" },
    ]);

    if (!updatedStory) {
      return res.json({ success: false, message: "Story not found." });
    }

    res.json({ success: true, data: updatedStory });
  } catch (error) {
    console.error("Error viewing story:", error);
    res.json({
      success: false,
      message: "An error occurred while viewing the story.",
    });
  }
};

export const getStoryByUsername = async (req, res) => {
  try {
    const { userName } = req.params;

    const user = await User.findOne({ userName });
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    const story = await Story.findOne({
      author: user._id,
    }).populate([
      { path: "author", select: "name userName profileImage" },
      { path: "viewers", select: "name userName profileImage" },
    ]);

    res.json({
      success: true,
      data: story,
    });
  } catch (error) {
    console.error("Error while getting story:", error);
    res.json({
      success: false,
      message: "An error occurred while getting the story.",
    });
  }
};

export const getAllStories = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const followingIds = currentUser.following;

    const stories = await Story.find({
      author: { $in: followingIds },
    })
      .populate([
        { path: "author", select: "name userName profileImage" },
        { path: "viewers", select: "name userName profileImage" },
      ])
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: stories,
    });
  } catch (error) {
    console.error("Error while getting all stories:", error);
    res.json({
      success: false,
      message: "An error occurred while getting all the story.",
    });
  }
};
