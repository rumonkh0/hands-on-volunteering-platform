const helpRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    urgency_level: {
      type: String,
      required: [true, "Urgency level is required"],
      enum: ["Low", "Medium", "High"], // Predefined urgency levels
      default: "Medium",
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who created the request
      required: [true, "Creator is required"],
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Closed"], // Request status
      default: "Open",
    },
  },
  { timestamp: true }
);

const HelpRequest = mongoose.model("HelpRequest", helpRequestSchema);
