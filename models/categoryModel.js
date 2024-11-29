import mongoose from "mongoose";

//create schema
const categorySchema = mongoose.Schema({
  list: {
    type: [String],
    trim: true,
  },
});

//export user schema

export default mongoose.model("Category", categorySchema);
