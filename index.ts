import express from "express";
import "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import multer from "multer";
import { formRouter } from "./routes/formRouter.js";
import { v2 as cloudinary } from "cloudinary";
import { uploadRouter } from "./routes/uploadRouter.js";
import rateLimit from "express-rate-limit"; 

const app = express();

// Trust proxy - more secure configuration for production
// Option 1: Trust only the first proxy (recommended for most cases)
app.set('trust proxy', 1);

// Option 2: If you know your proxy IPs, use specific IPs instead:
// app.set('trust proxy', ['127.0.0.1', '::1', 'your-proxy-ip']);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	message: "Too many requests from this IP, please try again later.",
	// Additional security: validate the IP more strictly
	validate: {
		trustProxy: false, // Disable express-rate-limit's trust proxy validation
	},
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: ["http://localhost:5173", "http://streamindus.com", "https://streamindus.com"],
		credentials: true,
	})
);
app.use(cookieParser());

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		const uniqueName = Date.now() + "-" + file.originalname;
		cb(null, uniqueName);
	},
});

const upload = multer({
	storage,
	fileFilter: (_req, file, cb) => {
		file.mimetype === "application/pdf"
			? cb(null, true)
			: cb(new Error("Only PDFs allowed!"));
	},
});

app.get("/", (req, res) => {
	res.send("StreamIndus Backend is running!");
})
app.use("/api/v1/submit-form", formRouter);
app.use("/api/v1/upload", upload.single("resume"), uploadRouter);

app.listen(8080, () => {
	console.log("Server is running on port 8080");
});

