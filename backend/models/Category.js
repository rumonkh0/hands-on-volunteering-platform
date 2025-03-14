const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      maxlength: [20, "Category name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [100, "Description cannot exceed 200 characters"],
    },
  },
  { timestamp: true }
);

const Category = mongoose.model("Category", categorySchema);
