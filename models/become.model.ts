import mongoose from "mongoose";

const becomeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
}, {timestamps: true});


export const becomeModel = mongoose.model("becomecertified", becomeSchema);
