import mongoose from "mongoose";

//create schema
const departmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: null,
    },
    trash: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//export user schema

export default mongoose.model("Department", departmentSchema);
