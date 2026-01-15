import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		company: { type: String },
		email: { type: String, required: true },
		phone: { type: String },
		service: { type: String, required: true },
		description: { type: String },
	},
	{ timestamps: true }
);


export const serviceRequestModel = mongoose.model("servicereqs", serviceRequestSchema);
