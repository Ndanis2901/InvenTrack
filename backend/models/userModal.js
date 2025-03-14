import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dept: {
      type: String,
      required: [true, "add the dept"],
      enum: {
        values: [
          "Company",
          "Warehouse",
          "Maintenance",
          "Production",
          "Silo",
          "Procurement",
        ],
        message: "please add User Dept",
      },
      default: "Company",
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    procurement: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model("User", userSchema);
export default User;