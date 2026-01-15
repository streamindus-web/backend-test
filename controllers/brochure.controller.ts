import { adminMailTemplate, mailTemplate } from "../utils/mail.template.js";
import nodemailer from "nodemailer";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

interface RequestBody {
	body: {
		name: string;
		email: string;
		phone: string;
        product_name: string;
        file_types: any[];
	};
}

const products = {
    zincalume: "Streamindus Zincalume Bolted Tanks",
    gfs: "Streamindus GFS Bolted Tanks",
    silo: "Streamindus Grain Storage Silos"
}

function brochureController(req: RequestBody, res: any) {
    try{
        const { name, email, phone, product_name, file_types } =  req.body;

        console.log(req.body);
        if (!name || !email || !phone || !product_name) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const isValidPhone = (num: string) => /^[6-9]\d{9}$/.test(num);

        if(phone.length !== 10){
            return res.status(400).json({ error: "Phone number must be 10 digits" });
        }

        if (!isValidPhone(phone)) {
            return res.status(400).json({ error: "Invalid phone number format" });
        }

        const mail = mailTemplate(name, products[product_name as keyof typeof products]);

        const adminMail = adminMailTemplate(name, email, phone, products[product_name as keyof typeof products]);

        console.log({
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
        })

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const attachments: any = [];
        file_types.map((file_type) => {
            attachments.push({
                filename: `${product_name}_${file_type}.pdf`,
                path: path.join(process.cwd(), `data`, `${file_type}`,`${product_name}.pdf`),
            })
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Resources for ${products[product_name as keyof typeof products]}`,
            html: mail,
            attachments: attachments,
        };

        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New Resources Request: ${products[product_name as keyof typeof products]}`,
            html: adminMail,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ error: "Error sending email" });
            } else {
                transporter.sendMail(adminMailOptions, (adminError, adminInfo) => {
                    if (adminError) {
                        console.error("Error sending admin email:", adminError);
                    } else {
                        console.log("Admin email sent:", adminInfo.response);
                    }
                });
                console.log("Email sent:", info.response);
                return res.status(200).json({ message: "Brochure sent successfully" });
            }
        });
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export { brochureController };