import { Router } from 'express';
import { queryDb } from '../config/database.js';
import { env } from '../config/env.js';
import { sendEmail } from '../services/emailService.js';
import { sendWhatsAppMessage } from '../services/whatsappService.js';

const router = Router();

router.post('/', async (req, res) => {
  const { userId, fullName, name, email, subject, message } = req.body;
  const normalizedName = (fullName || name || '').trim();

  if (!normalizedName || !email || !subject || !message) {
    return res.status(400).json({ error: 'fullName, email, subject y message son obligatorios.' });
  }

  const insert = await queryDb`
    INSERT INTO app.ContactMessages (UserId, FullName, Email, Subject, MessageBody)
    OUTPUT INSERTED.MessageId
    VALUES (${userId || null}, ${normalizedName}, ${email}, ${subject}, ${message})
  `;

  const messageId = insert.recordset[0].MessageId;

  const emailResult = await sendEmail({
    to: email,
    subject: `Eco-STEM recibio tu mensaje: ${subject}`,
    text: `Hola ${normalizedName}, recibimos tu mensaje y te responderemos pronto.\n\n${message}`
  });

  let companyEmailResult = null;
  if (env.companyEmail) {
    companyEmailResult = await sendEmail({
      to: env.companyEmail,
      subject: `Nuevo mensaje de contacto: ${subject}`,
      text: `${normalizedName} <${email}> envio: ${message}`
    });
  }

  const whatsappResult = await sendWhatsAppMessage({
    body: `Nuevo mensaje Eco-STEM de ${normalizedName} <${email}>. Asunto: ${subject}. Mensaje: ${message}`
  });

  await queryDb`
    UPDATE app.ContactMessages
    SET EmailSent = ${emailResult?.accepted || emailResult?.mode === 'demo' ? 1 : 0},
        WhatsAppSent = ${whatsappResult?.status ? 1 : 0}
    WHERE MessageId = ${messageId}
  `;

  return res.status(201).json({
    messageId,
    emailResult,
    companyEmailResult,
    whatsappResult
  });
});

export default router;
