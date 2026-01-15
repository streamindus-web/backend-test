"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("cloudinary");
exports.uploadRouter = (0, express_1.Router)();
exports.uploadRouter.post("/upload-pdf", async (req, res) => {
    const localPath = req?.file?.path;
    if (!localPath) {
        res.status(400).json({ message: "No file uploaded" });
    }
    try {
        const result = await cloudinary_1.v2.uploader.upload(localPath || "", {
            resource_type: "raw",
            folder: "uploads",
        });
        fs_1.default.unlinkSync(localPath || "");
        res.json({ url: result.secure_url });
    }
    catch (err) {
        res.status(500).json({ message: "Upload failed", details: err.message });
    }
});
