"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinUsModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const joinUsSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
exports.joinUsModel = mongoose_1.default.model("JoinUs", joinUsSchema);
