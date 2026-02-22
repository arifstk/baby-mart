// categoryModel.js

import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: false, // Image is optional
      // default: "",
    },
    categoryType: {
      type: String,
      enum: ["Featured", "Hot Categories", "Top Categories"], // Mandatory field with specific values
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;

