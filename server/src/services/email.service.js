import SendmailTransport from "nodemailer/lib/sendmail-transport/index.js";
import {
  passwordResetTemplate,
  resendVerificationTemplate,
  welcomeUserTemplate,
} from "../utils/emailTemplate.js";
import { sendEmail } from "../utils/mail.js";

const mailService = {
  sendWelcomeMail: async (user) => {
    // proceed to sending email to user
    const htmlBody = welcomeUserTemplate(user.fullname, user.verificationToken);
    await sendEmail({
      to: user.email,
      subject: "Verify your account",
      html: htmlBody,
    });
  },
  sendVerificationCode: async (user) => {
    // proceed to sending email to user
    const htmlBody = resendVerificationTemplate(
      user.fullname,
      user.verificationToken
    );
    await sendEmail({
      to: user.email,
      subject: "Verify your account",
      html: htmlBody,
    });
  },

  sendPasswordResetEmail: async(user) => {
    const htmlBody = passwordResetTemplate(user.fullname, user.email, user.passwordResetToken);
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: htmlBody,
    });
  }
};

export default mailService;
