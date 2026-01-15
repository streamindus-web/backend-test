import { serviceRequestModel } from "../models/service.model.js";

export function serviceController(req: any, res: any) {
	try {
		const { name, company, email, number, service, description } = req.body;

		if (!name || !email || !service) {
			return res
				.status(400)
				.json({ message: "Name, Email, and Service are required." });
		}

		const newRequest = new serviceRequestModel({
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
			.catch((error: any) => {
				console.error("Error saving service request:", error);
				res.status(400).json({ message: "Error saving service request" });
			});
	} catch (error) {
		console.error("Error submitting service request:", error);
		res.status(500).json({ message: "Server error. Please try again later." });
	}
}
