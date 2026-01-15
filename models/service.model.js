"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRequestModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const serviceRequestSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    company: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    service: { type: String, required: true },
    description: { type: String },
}, { timestamps: true });
exports.serviceRequestModel = mongoose_1.default.model("servicereqs", serviceRequestSchema);
