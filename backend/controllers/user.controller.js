import mongoose from "mongoose";
import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select("-password")
      .populate(
        "posts loops posts.author posts.comments story story.viewers following"
      );

    if (!user) {
      return res.json({
        success: false,
        message: "No account found for the given user ID.",
      });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return res.json({
      success: false,
      message: "Unable to retrieve user details.",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("Error in get user by id:", error);
    return res.json({
      success: false,
      message: "Unable to retrieve user details.",
    });
  }
};

export const suggestedUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    const filteredUsers = users.filter(
      (user) => String(user._id) !== String(req.userId)
    );

    return res.json({ success: true, users: filteredUsers });
  } catch (error) {
    console.error("Error in suggestedUsers:", error);
    return res.json({
      success: false,
      message: "Unable to retrieve suggested users.",
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name, userName, bio, profession, gender } = req.body;

    if (name.length < 3)
      return res.json({
        success: false,
        message: "Name should contain atleast 3 characters",
      });
    if (userName === "")
      return res.json({
        success: false,
        message: "Username cant be empty",
      });
    if (gender && !["male", "female"].includes(gender)) {
      return res.json({
        success: false,
        message: "Enter male or female in your gender.",
      });
    }

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.json({
        success: false,
        message: "No account found for the given user ID.",
      });
    }

    const usernameExists = await User.findOne({ userName }).select("-password");
    if (usernameExists && String(usernameExists._id) !== String(req.userId)) {
      return res.json({
        success: false,
        message: "Username already exists.",
      });
    }

    // Only upload and update if a file was sent
    if (req.file) {
      const profileImage = await uploadOnCloudinary(req.file.path);
      user.profileImage = profileImage;
    }

    user.name = name;
    user.userName = userName;
    user.bio = bio;
    user.profession = profession;

    if (gender === "male" || gender === "female") {
      user.gender = gender;
    }

    await user.save();

    return res.json({ success: true, user });
  } catch (error) {
    console.error("Error in editProfile:", error);
    return res.json({
      success: false,
      message: "Unable to edit user profile.",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userName = req.params.userName;
    const user = await User.findOne({ userName })
      .select("-password")
      .populate("posts loops followers following");

    if (!user) {
      return res.json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({ success: true, user });
  } catch (error) {
    console.error("Error in getProfile:", error);
    return res.json({
      success: false,
      message: "Unable to get the user profile.",
    });
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const currentUserId = req.userId; // Ensure userId is set by auth middleware
    const { targetUserId } = req.params;

    // Validate input
    if (!mongoose.isValidObjectId(targetUserId)) {
      return res.json({
        success: false,
        message: "Invalid target user ID",
      });
    }

    if (currentUserId === targetUserId) {
      return res.json({
        success: false,
        message: "Cannot follow yourself",
      });
    }

    // Fetch both users concurrently
    const [currentUser, targetUser] = await Promise.all([
      mongoose.model("User").findById(currentUserId),
      mongoose.model("User").findById(targetUserId),
    ]);

    // Check if users exist
    if (!currentUser || !targetUser) {
      return res.json({
        success: false,
        message: "User not found",
      });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    // Use $addToSet/$pull for atomic updates
    if (isFollowing) {
      await Promise.all([
        mongoose
          .model("User")
          .findByIdAndUpdate(
            currentUserId,
            { $pull: { following: targetUserId } },
            { new: true }
          ),
        mongoose
          .model("User")
          .findByIdAndUpdate(
            targetUserId,
            { $pull: { followers: currentUserId } },
            { new: true }
          ),
      ]);

      return res.json({
        success: true,
        following: false,
        message: "Unfollowed successfully",
      });
    } else {
      await Promise.all([
        mongoose
          .model("User")
          .findByIdAndUpdate(
            currentUserId,
            { $addToSet: { following: targetUserId } },
            { new: true }
          ),
        mongoose
          .model("User")
          .findByIdAndUpdate(
            targetUserId,
            { $addToSet: { followers: currentUserId } },
            { new: true }
          ),
      ]);

      return res.json({
        success: true,
        following: true,
        message: "Followed successfully",
      });
    }
  } catch (error) {
    console.error("Error in toggleFollow:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getFollowingUsers = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ success: true, following: user.following });
  } catch (error) {
    console.error("Error in toggleFollow:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const search = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword.trim()) {
      return res.json({
        success: false,
        message: "Keyword required!",
      });
    }

    // Escape regex special characters to avoid regex DoS & injection
    const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

    const regex = new RegExp(escapeRegex(keyword), "i");

    const users = await User.find({
      $or: [{ userName: regex }, { name: regex }],
    }).select("-password");

    return res.json({ success: true, users });
  } catch (error) {
    console.error("Error in search controller:", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};
