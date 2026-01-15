import { Router } from "express";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

export const uploadRouter = Router();

uploadRouter.post("/upload-pdf", async (req, res) => {
	const localPath = req?.file?.path;
  if(!localPath) {
    res.status(400).json({ message: "No file uploaded" });
  }

	try {
		const result = await cloudinary.uploader.upload(localPath || "", {
			resource_type: "raw",
			folder: "uploads",
		});

		fs.unlinkSync(localPath || "");

		res.json({ url: result.secure_url });
	} catch (err: any) {
		res.status(500).json({ message: "Upload failed", details: err.message });
	}
});
