import mongoose from "mongoose";

const helpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  }
  ,email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  }
}, {timestamps: true})

export const helpModel = mongoose.model("helpforms", helpSchema);