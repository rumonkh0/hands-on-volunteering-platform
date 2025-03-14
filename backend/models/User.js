const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    skills: {
      type: [String],
      default: [],
    },
    causes_supported: {
      type: [String],
      default: [],
      validate: {
        validator: function (causes) {
          return causes.length >= 1;
        },
        message: "At least 1 cause needed",
      },
    },
  },
  { timestamp: true }
);

const User = mongoose.model("User", userSchema);
