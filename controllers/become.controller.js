"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.becomeController = becomeController;
const become_model_js_1 = require("../models/become.model.js");
function becomeController(req, res) {
    try {
        const { name, email, phone, category, type } = req.body;
        if (!name || !email || !phone || !type || !category) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newCertified = new become_model_js_1.becomeModel({ name, email, phone, category, type });
        newCertified
            .save()
            .then(() => {
            res.status(201).json({ message: "Request submitted successfully" });
        })
            .catch((error) => {
            console.error("Error saving request:", error);
            res.status(400).json({ error: "Error  Submitting Request" });
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
