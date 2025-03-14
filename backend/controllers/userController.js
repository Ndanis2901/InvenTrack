import User from "../models/userModal.js";
import { asyncHandler } from "../utils/asynchandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, dept } = req.body;

  const existUser = await User.findOne({ email });
  if (existUser) {
    res.status(403);
    throw new Error("user Already Exist");
  }

  const user = await User.create({
    name, email, password,dept,}
  );

  if(user) {
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        dept: user.dept,
        procurement: user.procurement,
        isAdmin: user.isAdmin,
    });
  }else {
    res.status(400);
    throw new Error("invalid data try again")
  }
});

