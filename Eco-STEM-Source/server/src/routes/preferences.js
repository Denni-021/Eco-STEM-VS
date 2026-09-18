import { Router } from 'express';
import { queryDb } from '../config/database.js';

const router = Router();

router.post('/cookies', async (req, res) => {
  const { userId, consentType, consentValue } = req.body;
  if (!consentType || !consentValue) {
    return res.status(400).json({ error: 'consentType y consentValue son obligatorios.' });
  }

  await queryDb`
    INSERT INTO app.CookieConsents (UserId, ConsentType, ConsentValue)
    VALUES (${userId || null}, ${consentType}, ${consentValue})
  `;

  return res.status(201).json({ ok: true });
});

router.post('/newsletter', async (req, res) => {
  const { userId, email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'email es obligatorio.' });
  }

  const existing = await queryDb`
    SELECT TOP 1 SubscriptionId
    FROM app.NewsletterSubscriptions
    WHERE Email = ${email}
  `;

  if (existing.recordset[0]) {
    return res.json({ ok: true, existing: true });
  }

  const insert = await queryDb`
    INSERT INTO app.NewsletterSubscriptions (UserId, Email, Status)
    OUTPUT INSERTED.SubscriptionId
    VALUES (${userId || null}, ${email}, ${'active'})
  `;

  return res.status(201).json({ ok: true, subscriptionId: insert.recordset[0].SubscriptionId });
});

export default router;
