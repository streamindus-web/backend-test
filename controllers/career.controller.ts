import { careerModel } from "../models/careers.model.js";

interface RequestBody {
	body: {
		name: string;
		email: string;
		phone: number;
		link: string;
	};
}

export async function careerFormController(req: RequestBody, res: any) {
	try {
		const { name, email, phone, link } = req.body;
		if (!name || !email || !phone || !link) {
			return res.status(400).json({ error: "All fields are required." });
		}
		const newCareer = new careerModel({
			name,
			email,
			phone,
			resumeLink: link,
		});
		try {
			await newCareer.save();
			res.status(200).json({ message: "Form submitted successfully." });
		} catch (error) {
			res.status(400).json({ message: "Error in submitting form" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
}
