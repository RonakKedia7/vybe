import { isValidObjectId } from "mongoose";
import uploadOnCloudinary from "../config/cloudinary.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId } = req.params;
    const { message } = req.body;

    // Validate senderId and receiverId
    if (!isValidObjectId(senderId) || !isValidObjectId(receiverId)) {
      return res.json({
        success: false,
        message: "Invalid sender or receiver ID",
      });
    }

    // Validate message or image presence
    if (!message && !req.file) {
      return res.json({
        success: false,
        message: "Message or image is required",
      });
    }

    // Handle image upload
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
      if (!image) {
        return res.json({
          success: false,
          message: "Failed to upload image",
        });
      }
    }

    // Create new message
    const newMessage = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: message || "", // Ensure message is not undefined
      image,
    });

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    // Standardized response
    return res.json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.json({
      success: false,
      message: "Failed to send message",
    });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const senderId = req.userId;
    const { receiverId } = req.params;

    // Validate senderId and receiverId
    if (!isValidObjectId(senderId) || !isValidObjectId(receiverId)) {
      return res.json({
        success: false,
        message: "Invalid sender or receiver ID",
      });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    // If no conversation exists, return success with empty messages array
    if (!conversation) {
      return res.json({ success: true, messages: [] });
    }

    return res.json({ success: true, messages: conversation.messages || [] });
  } catch (error) {
    console.error("Error in getAllMessages:", error);
    return res.json({
      success: false,
      message: "Failed to get all messages",
    });
  }
};

export const getPrevUserChats = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const conversations = await Conversation.find({
      participants: currentUserId,
    })
      .populate("participants")
      .sort({ updatedAt: -1 });

    const userMap = {};
    conversations.forEach((conv) => {
      conv.participants.forEach((user) => {
        if (user._id !== currentUserId) {
          userMap[user._id] = user;
        }
      });
    });

    const previousUsers = Object.values(userMap);

    return res.json({ success: true, previousUsers });
  } catch (error) {
    console.error("Error in getPrevUserChats:", error);
    return res.json({
      success: false,
      message: "Failed to get previous user chats",
    });
  }
};
