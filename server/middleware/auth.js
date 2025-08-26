import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  // Check if there's no token at all
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Not authorized, no token provided" });
  }

  try {
    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID directly from the decoded payload
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ msg: "Authorization denied, user not found" });
    }

    // Attach the found user object to the request
    req.user = user;

    // Continue to the next part of the request pipeline
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;
