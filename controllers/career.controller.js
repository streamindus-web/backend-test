"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.careerFormController = careerFormController;
const careers_model_js_1 = require("../models/careers.model.js");
async function careerFormController(req, res) {
    try {
        const { name, email, phone, link } = req.body;
        if (!name || !email || !phone || !link) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const newCareer = new careers_model_js_1.careerModel({
            name,
            email,
            phone,
            resumeLink: link,
        });
        try {
            await newCareer.save();
            res.status(200).json({ message: "Form submitted successfully." });
        }
        catch (error) {
            res.status(400).json({ message: "Error in submitting form" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}
