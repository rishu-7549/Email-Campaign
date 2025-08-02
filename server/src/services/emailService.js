import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import EmailEvent from "../models/EmailEvent.js";

export const sendEmail = async (to, subject, text, campaignId) => {
  try {
    const trackingId = uuidv4();
    const trackingPixelUrl = `${process.env.BASE_URL}/api/events/open/${trackingId}`;

    const htmlBody = `
      <p>${text}</p>
      <img src="${trackingPixelUrl}" width="1" height="1" style="display:none"/>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlBody
    });

    console.log(`📧 Email sent to ${to}`);

    // Store a placeholder so when open event comes, we know it's valid
    await EmailEvent.create({
      campaignId,
      recipient: to,
      eventType: "sent"
    });
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};
