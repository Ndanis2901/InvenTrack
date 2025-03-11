// Import the jsonwebtoken library to generate and verify JWT tokens
import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // Generate a JWT token with the user's ID as payload
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });

  res.cookie("jwt", token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV !== "development", // Ensures cookies are sent only over HTTPS in production
    sameSite: "strict", // Restricts cookie sharing to prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // Sets the cookie expiration to 30 days
  });

  // Return the generated token (although it's mainly stored in the cookie)
  return token;
};

// Export the function for use in authentication controllers
export default generateToken;
