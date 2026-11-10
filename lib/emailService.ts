import nodemailer from "nodemailer";

const SMTP_HOST = process.env.OUTREACH_SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.OUTREACH_SMTP_PORT || "587", 10);
const SMTP_USER = process.env.OUTREACH_SMTP_USER || "hola@serviciodemarketingdigital.com";
const SMTP_PASS = process.env.OUTREACH_SMTP_PASSWORD || "fydnptelwybjothj";

// Crear transporter reutilizable de Nodemailer
export const mailTransporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  inReplyTo?: string;
  references?: string;
}

export async function sendEmail({ to, subject, html, text, inReplyTo, references }: SendMailOptions) {
  try {
    const info = await mailTransporter.sendMail({
      from: `"Alan López - Servicio de Marketing Digital" <${SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, " ").trim(),
      inReplyTo,
      references,
    });
    console.log(`✔ [EMAIL ENVIADO] A: ${to} | Asunto: ${subject} | ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`❌ [ERROR ENVIANDO EMAIL A ${to}]:`, error.message);
    return { success: false, error: error.message };
  }
}

