"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helpController = helpController;
const help_model_js_1 = require("../models/help.model.js");
function helpController(req, res) {
    try {
        const { name, email, phone, message, type } = req.body;
        if (!name || !email || !phone || !type || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const newHelp = new help_model_js_1.helpModel({ name, email, phone, message, type });
        newHelp
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
