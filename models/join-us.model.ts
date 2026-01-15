import mongoose from "mongoose";

const joinUsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  
}, {timestamps: true})

export const joinUsModel = mongoose.model("JoinUs", joinUsSchema);