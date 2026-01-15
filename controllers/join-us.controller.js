"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinUsController = joinUsController;
const join_us_model_js_1 = require("../models/join-us.model.js");
async function joinUsController(req, res) {
    try {
        const { name, email, phone, type } = req.body;
        if (!name || !email || !phone || !type) {
            return res.status(400).json({ error: "All fields are required." });
        }
        // Check for duplicate email
        const existing = await join_us_model_js_1.joinUsModel.findOne({ email });
        if (existing) {
            return res.status(409).json({ error: "Email already exists." });
        }
        const newJoinUs = new join_us_model_js_1.joinUsModel({
            name,
            email,
            phone,
            type,
        });
        try {
            await newJoinUs.save();
            res.status(200).json({ message: "Form submitted successfully." });
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ message: "Error in submitting form" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
