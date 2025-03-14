const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
    posted_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Commenter is required"],
    },
    help_request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HelpRequest",
      required: [true, "Help request is required"],
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Comment", commentSchema);
