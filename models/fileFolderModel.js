import mongoose from "mongoose";

// File Schema
const fileSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  size: {
    type: Number, // File size in bytes
    required: true,
  },
  type: {
    type: String, // File type, e.g., 'pdf', 'docx', etc.
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Folder Schema
const folderSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parentFolder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder", // Reference to parent folder, null if root folder
    default: null,
  },
  userId: {
    type: String, // File type, e.g., 'pdf', 'docx', etc.
    required: true,
  },
  files: [fileSchema], // Array of files in the folder
  subfolders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder", // Reference to subfolders
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// Models
export const File = mongoose.model("File", fileSchema);
export const Folder = mongoose.model("Folder", folderSchema);
