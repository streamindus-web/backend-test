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

async function brochureController(req: RequestBody, res: any) {
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

        // Alternative configuration for better reliability
        const transporterConfig = process.env.NODE_ENV === 'production' 
            ? {
                // Production: Use specific SMTP settings
                host: 'smtp.gmail.com',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                connectionTimeout: 60000,
                greetingTimeout: 30000,
                socketTimeout: 60000,
                pool: true,
                maxConnections: 5,
                maxMessages: 10,
                tls: {
                    rejectUnauthorized: false
                }
            }
            : {
                // Development: Use service shortcut
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
                connectionTimeout: 60000,
                greetingTimeout: 30000,
                socketTimeout: 60000,
                pool: true,
                maxConnections: 5,
                maxMessages: 10,
                secure: true,
                requireTLS: true,
                tls: {
                    rejectUnauthorized: false
                }
            };

        const transporter = nodemailer.createTransport(transporterConfig);

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

        // Verify transporter configuration before sending emails
        try {
            await transporter.verify();
            console.log('Email server connection verified successfully');
        } catch (verificationError) {
            console.error('Email server verification failed:', verificationError);
            return res.status(500).json({ error: "Email service unavailable. Please try again later." });
        }

        // Helper function to send email with retry logic
        const sendEmailWithRetry = (mailOptions: any, retries = 3): Promise<any> => {
            return new Promise((resolve, reject) => {
                const attemptSend = (attempt: number) => {
                    transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
                        if (error) {
                            console.error(`Email send attempt ${attempt} failed:`, error);
                            if (attempt < retries) {
                                console.log(`Retrying email send... Attempt ${attempt + 1}/${retries}`);
                                setTimeout(() => attemptSend(attempt + 1), 2000 * attempt); // Exponential backoff
                            } else {
                                reject(error);
                            }
                        } else {
                            resolve(info);
                        }
                    });
                };
                attemptSend(1);
            });
        };

        try {
            // Send user email with retry
            const userEmailResult = await sendEmailWithRetry(mailOptions);
            console.log("User email sent:", userEmailResult.response);

            // Send admin email (don't block user response if this fails)
            sendEmailWithRetry(adminMailOptions, 2)
                .then((adminResult) => {
                    console.log("Admin email sent:", adminResult.response);
                })
                .catch((adminError) => {
                    console.error("Error sending admin email:", adminError);
                });

            return res.status(200).json({ message: "Brochure sent successfully" });
        } catch (emailError: any) {
            console.error("Final email error after retries:", emailError);
            // More specific error handling
            if (emailError.message?.includes('timeout')) {
                return res.status(500).json({ error: "Email service timeout. Please try again later." });
            } else if (emailError.message?.includes('authentication')) {
                return res.status(500).json({ error: "Email authentication failed. Please contact support." });
            } else if (emailError.code === 'ETIMEDOUT') {
                return res.status(500).json({ error: "Connection timeout. Please check your internet connection and try again." });
            } else {
                return res.status(500).json({ error: "Error sending email. Please try again later." });
            }
        }
    }catch(error){
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export { brochureController };