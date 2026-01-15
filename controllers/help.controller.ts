import { helpModel } from "../models/help.model.js";

interface RequestBody {
  body: {
    name: string;
    email: string;
    phone: number;
    message: string;
    type: string;
  };
}

export function helpController(req: RequestBody, res: any) {
  try {
    const { name, email, phone, message, type } = req.body;

    if (!name || !email || !phone || !type || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newHelp = new helpModel({ name, email, phone, message, type });

    newHelp
      .save()
      .then(() => {
        res.status(201).json({ message: "Request submitted successfully" });
      })
      .catch((error) => {
        console.error("Error saving request:", error);
        res.status(400).json({ error: "Error  Submitting Request" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
