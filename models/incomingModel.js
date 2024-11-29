import mongoose from "mongoose";

//create schema
const incomingSchema = mongoose.Schema(
  {
    subject: {
      type: String,
      trim: true,
      default: null,
    },
    date: {
      type: String,
      trim: true,
      default: null,
    },
    branch: {
      type: String,
      trim: true,
      default: null,
    },
    ref: {
      type: String,
      trim: true,
      default: null,
    },
    deadLine: {
      type: String,
      trim: true,
      default: null,
    },
    category: {
      type: String,
      trim: true,
      default: null,
    },

    whereFrom: {
      type: String,
      trim: true,
      default: null,
    },

    file: {
      type: String,
      trim: true,
      default: null,
    },
    assigned: {
      type: [String],
      default: null,
    },
    priority: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      default: "pending",
    },
    instruction: {
      type: String,
      default: null,
    },
    progress: {
      type: String,
      default: null,
    },
    to: {
      type: [String],
      trim: true,
      default: null,
    },

    sender: {
      type: String,
    },
    department: {
      type: String,
      trim: true,
      default: null,
    },
  },
  { timestamps: true }
);

//export user schema

export default mongoose.model("Incoming", incomingSchema);
