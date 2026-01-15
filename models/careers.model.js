"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.careerModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const careersSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
const careerModel = mongoose_1.default.model("Careers", careersSchema);
exports.careerModel = careerModel;
