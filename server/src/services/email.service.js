import SendmailTransport from "nodemailer/lib/sendmail-transport/index.js";
import {
  appointmentStatusTemplate,
  createPaymentTemplate,
  passwordResetTemplate,
  paymentStatusTemplate,
  resendVerificationTemplate,
  welcomeUserTemplate,
} from "../utils/emailTemplate.js";
import { sendEmail } from "../utils/mail.js";

const mailService = {
  sendWelcomeMail: async (user, password) => {
    // proceed to sending email to user
    const htmlBody = welcomeUserTemplate(user.fullname, user.verificationToken, password);
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
  },

  sendAppointmentStatusEmail: async (email, fullname, status) => {
    const htmlBody = appointmentStatusTemplate(fullname, status);
    await sendEmail({
      to: email,
      subject: "Appointment Update",
      html: htmlBody,
    });
  },
  sendCreatePaymentEmail: async (email, fullname, payment) => {
    const htmlBody = createPaymentTemplate(
      fullname,
      payment.amount,
      payment.paymentType
    );
    await sendEmail({
      to: email,
      subject: "Payment Information",
      html: htmlBody,
    });
  },
  sendPaymentStatusEmail: async (email, fullname, amount, status) => {
    const htmlBody = paymentStatusTemplate(fullname, amount, status);
    await sendEmail({
      to: email,
      subject: "Payment Update",
      html: htmlBody,
    });
  },
};




export default mailService;
