"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enquiryController = enquiryController;
const enquiry_model_js_1 = require("../models/enquiry.model.js");
function enquiryController(req, res) {
    try {
        const { name, email, phone, message, itemName } = req.body;
        if (!name || !email || !phone || !itemName) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newEnquiry = new enquiry_model_js_1.enquiryModel({ name, email, phone, itemName });
        newEnquiry
            .save()
            .then(() => {
            res.status(200).json({ message: "Enquiry submitted successfully" });
        })
            .catch((error) => {
            console.error("Error saving enquiry:", error);
            res.status(400).json({ error: "Error submitting enquiry" });
        });
    }
    catch (error) {
        console.error("Internal Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
