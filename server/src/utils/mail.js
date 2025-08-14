import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    requireTLS: true, //only if you are using 587,, this requireTLS will upgrade it to a secure connection once secured
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        // rejects unauthorized certificate in production mode, for security, TLS is a protocol used to encrypt 
        rejectUnauthorized: process.env.NODE_ENV === "production",
    },
});

// to verify our email service connection
const verifyEmailConnection = async()=> {
    try{
        await transporter.verify()
        console.log("✅Email service connection verified");
    } catch (error) {
        console.error("❌ Failed to connect email service", {
            error: error.message,
            code: error.code,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        });
        throw new Error("Email services connection failed");   
    }
};
verifyEmailConnection().catch(console.error())

export const sendEmail = async({to, subject, html}) => {
    const mailOptions = {
        from: "Clinicare <adefaratiifeoma@gmail.com>",
        to,
        subject,
        html,
    }
try {
    await transporter.sendMail(mailOptions);
} catch (error) {
    console.error("Error sending email:", error);
    
}
};