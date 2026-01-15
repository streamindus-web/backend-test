"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceController = serviceController;
const service_model_js_1 = require("../models/service.model.js");
function serviceController(req, res) {
    try {
        const { name, company, email, number, service, description } = req.body;
        if (!name || !email || !service) {
            return res
                .status(400)
                .json({ message: "Name, Email, and Service are required." });
        }
        const newRequest = new service_model_js_1.serviceRequestModel({
            name,
            company,
            email,
            number,
            service,
            description,
        });
        newRequest
            .save()
            .then(() => {
            res
                .status(201)
                .json({ message: "Service request submitted successfully!" });
        })
            .catch((error) => {
            console.error("Error saving service request:", error);
            res.status(400).json({ message: "Error saving service request" });
        });
    }
    catch (error) {
        console.error("Error submitting service request:", error);
        res.status(500).json({ message: "Server error. Please try again later." });
    }
}
