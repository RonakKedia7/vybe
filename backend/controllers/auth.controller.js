import sendMail from "../config/mail.js";
import generateToken from "../config/token.js";
import User from "./../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { name, email, password, userName } = req.body;

    // check if email or username already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.json({
        success: false,
        message:
          "This email is already registered. Please use a different email.",
      });
    }

    const userNameExists = await User.findOne({ userName });
    if (userNameExists) {
      return res.json({
        success: false,
        message:
          "This username is already taken. Please choose a different username.",
      });
    }

    // make sure entered password is at least 6 characters
    if (password.length < 6) {
      return res.json({
        success: false,
        message:
          "Password must be at least 6 characters long. Please try again.",
      });
    }

    // hash the user password to improve security
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      userName,
      email,
      password: hashedPassword,
    });

    // generate token for the user
    const token = generateToken(user._id);

    // store the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years in milliseconds
      secure: true,
      sameSite: "none",
    });

    return res.json({
      success: true,
      user,
      message: "Account created successfully! You are now logged in.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An error occurred during signup. Please try again later.",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;

    const user = await User.findOne({ userName }).populate(
      "posts loops posts.author posts.comments story story.viewers following"
    );
    if (!user) {
      return res.json({
        success: false,
        message:
          "No account found with this username. Please check and try again.",
      });
    }

    // check if entered password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Incorrect password. Please try again.",
      });
    }

    // generate token for the user
    const token = generateToken(user._id);

    // store the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years in milliseconds
      secure: true,
      sameSite: "none",
    });

    return res.json({
      success: true,
      user,
      message: "Login successful! Welcome back.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An error occurred during login. Please try again later.",
    });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({
      success: true,
      message: "You have been logged out successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An error occurred during logout. Please try again.",
    });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message:
          "No account found with this email. Please check and try again.",
      });
    }
    if (user.resetOtp) {
      const timeDiff = user.otpExpires - Date.now();

      if (timeDiff > 0) {
        const minutes = Math.floor(timeDiff / (60 * 1000));
        const seconds = Math.floor((timeDiff % (60 * 1000)) / 1000);

        let result = "";
        if (minutes > 0) {
          result += `${minutes} min${minutes > 1 ? "s" : ""}`;
        }
        if (seconds > 0) {
          if (result) result += " ";
          result += `${seconds} sec${seconds > 1 ? "s" : ""}`;
        }
        return res.json({
          success: false,
          message: `Wait for ${result} for new otp request`,
        });
      }
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    user.isOtpVerified = false;

    await user.save();
    await sendMail(email, otp);

    return res.json({
      success: true,
      message:
        "OTP sent to your email. Please check your inbox (and spam folder).",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Failed to send OTP. Please try again later.",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message:
          "No account found with this email. Please check and try again.",
      });
    }
    if (user.resetOtp !== otp) {
      return res.json({
        success: false,
        message: "Invalid OTP. Please enter the correct OTP.",
      });
    }
    if (user.otpExpires < Date.now()) {
      return res.json({
        success: false,
        message: "The OTP has expired. Please request a new one.",
      });
    }

    user.isOtpVerified = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;

    await user.save();
    return res.json({
      success: true,
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "An error occurred while verifying OTP. Please try again.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message:
          "No account found with this email. Please check and try again.",
      });
    }
    if (!user.isOtpVerified) {
      return res.json({
        success: false,
        message: "Please verify the OTP before resetting your password.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.otpExpires = undefined;
    user.resetOtp = undefined;
    user.isOtpVerified = false;

    await user.save();
    return res.json({
      success: true,
      message: "Your password has been reset successfully. You can now log in.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message:
        "An error occurred while resetting the password. Please try again.",
    });
  }
};
