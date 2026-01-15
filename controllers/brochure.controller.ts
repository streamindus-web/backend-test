import { adminMailTemplate, mailTemplate } from "../utils/mail.template.js";
import { Resend } from "resend";
import path from "path";
import fs from "fs";
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

        // Initialize Resend with API key from environment
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Prepare attachments for Resend
        const attachments: any[] = [];
        
        try {
            for (const file_type of file_types) {
                const filePath = path.join(process.cwd(), `data`, `${file_type}`, `${product_name}.pdf`);
                
                // Check if file exists before reading
                if (fs.existsSync(filePath)) {
                    const fileContent = fs.readFileSync(filePath);
                    attachments.push({
                        filename: `${product_name}_${file_type}.pdf`,
                        content: fileContent,
                    });
                } else {
                    console.warn(`File not found: ${filePath}`);
                }
            }
        } catch (fileError) {
            console.error("Error reading attachment files:", fileError);
            return res.status(500).json({ error: "Error preparing email attachments" });
        }

        // Prepare email options for user
        const userEmailOptions = {
            from: 'StreamIndus <noreply@streamindus.com>',
            to: [email],
            subject: `Resources for ${products[product_name as keyof typeof products]}`,
            html: mail,
            attachments: attachments,
        };

        // Prepare email options for admin
        const adminEmailOptions = {
            from: 'StreamIndus <noreply@streamindus.com>',
            to: [process.env.ADMIN_EMAIL || 'aksharsaxena2003@gmail.com'],
            subject: `New Resources Request: ${products[product_name as keyof typeof products]}`,
            html: adminMail,
        };

        // Helper function to send email with retry logic using Resend
        const sendEmailWithRetry = async (emailOptions: any, retries = 3): Promise<any> => {
            let lastError;
            
            for (let attempt = 1; attempt <= retries; attempt++) {
                try {
                    console.log(`Sending email attempt ${attempt}/${retries}`);
                    const result = await resend.emails.send(emailOptions);
                    console.log(`Email sent successfully on attempt ${attempt}:`, result);
                    return result;
                } catch (error) {
                    console.error(`Email send attempt ${attempt} failed:`, error);
                    lastError = error;
                    
                    if (attempt < retries) {
                        console.log(`Retrying email send... Attempt ${attempt + 1}/${retries}`);
                        // Wait before retrying (exponential backoff)
                        await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
                    }
                }
            }
            
            throw lastError;
        };

        try {
            // Send user email with retry
            const userEmailResult = await sendEmailWithRetry(userEmailOptions);
            console.log("User email sent successfully:", userEmailResult.id);

            // Send admin email (don't block user response if this fails)
            sendEmailWithRetry(adminEmailOptions, 2)
                .then((adminResult) => {
                    console.log("Admin email sent successfully:", adminResult.id);
                })
                .catch((adminError) => {
                    console.error("Error sending admin email:", adminError);
                });

            return res.status(200).json({ 
                message: "Brochure sent successfully",
                emailId: userEmailResult.id 
            });
        } catch (emailError: any) {
            console.error("Final email error after retries:", emailError);
            
            // Handle Resend-specific errors
            if (emailError.message?.includes('rate limit')) {
                return res.status(500).json({ error: "Rate limit exceeded. Please try again later." });
            } else if (emailError.message?.includes('invalid')) {
                return res.status(500).json({ error: "Invalid email configuration. Please contact support." });
            } else if (emailError.message?.includes('unauthorized')) {
                return res.status(500).json({ error: "Email service authentication failed. Please contact support." });
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