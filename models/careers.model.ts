import mongoose from "mongoose";

const careersSchema = new mongoose.Schema({
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
  resumeLink: {
    type: String,
    required: true,
  },
}, {timestamps: true})

const careerModel = mongoose.model("Careers", careersSchema);

export {careerModel};