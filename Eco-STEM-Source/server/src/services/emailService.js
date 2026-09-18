import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

function getTransporter() {
  if (!env.smtp.host || !env.smtp.user || !env.smtp.password) return null;
  return nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.password
    }
  });
}

export async function sendEmail({ to, subject, text }) {
  const transporter = getTransporter();
  if (!transporter) {
    return { mode: 'demo', accepted: [to] };
  }

  return transporter.sendMail({
    from: env.smtp.from,
    to,
    subject,
    text
  });
}
