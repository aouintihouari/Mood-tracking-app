import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  const sender = process.env.EMAIL_FROM || "onboarding@resend.dev";

  try {
    const data = await resend.emails.send({
      from: sender,
      to: options.email,
      subject: options.subject,
      html: options.html,
      text: options.message,
    });

    console.log("Email sent successfully via Resend:", data);
  } catch (error) {
    console.error("Resend Error:", error);
    throw new Error("Email sending failed");
  }
};

export default sendEmail;
