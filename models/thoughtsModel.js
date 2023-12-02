const mongoose = require("mongoose");

const thoughtsSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      maxlength: [140, "A message should be shorter than 140 letters"],
      minlength: [5, "A message should be longer than five letters"],
      required: true,
    },
    likes: { type: Number, default: 0 },
    category: {
      type: String,
      enum: {
        values: ["Travel", "Books", "Food", "Movie", "General"],
        message: "Category should be Travel, Books, Food, Movie, General",
      },
    },
  },
  { timestamps: true }
);

const Thoughts = mongoose.model("Thoughts", thoughtsSchema);

module.exports = Thoughts;
