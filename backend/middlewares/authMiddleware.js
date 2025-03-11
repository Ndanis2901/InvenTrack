import User from "../models/userModal.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";

// Middleware to protect routes by verifying JWT token
export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt; // Read JWT from cookie

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
      req.user = await User.findById(decoded.userId).select("-password"); // Attach user to request
      next(); // Proceed to next middleware
    } catch (error) {
      res.status(403);
      throw new Error("Not Authorized or Token Failed");
    }
  } else {
    res.status(401);
    throw new Error("No token, Login Please");
  }
});

// Middleware to restrict access to admin users
export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user?.isAdmin) {
    next(); // Proceed if user is an admin
  } else {
    res.status(401);
    throw new Error("Unauthorized: Admin Access Required");
  }
});
