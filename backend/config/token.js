import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "10y",
    });
    return token;
  } catch (error) {
    console.error("Generate token error:", error);
    return null;
  }
};

export default generateToken;
