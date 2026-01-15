import { joinUsModel } from "../models/join-us.model.js";

interface RequestBody {
	body: {
		name: string;
		email: string;
		phone: number;
    type: string;
	};
}

export async function joinUsController(req: RequestBody, res:any){
  try {
    const { name, email, phone, type } = req.body;
    if (!name || !email || !phone || !type) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check for duplicate email
    const existing = await joinUsModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: "Email already exists." });
    }

    const newJoinUs = new joinUsModel({
      name,
      email,
      phone,
      type,
    });
    try {
      await newJoinUs.save();
      res.status(200).json({ message: "Form submitted successfully." });
    } catch (error) {
      console.log(error)
      res.status(400).json({ message: "Error in submitting form" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}