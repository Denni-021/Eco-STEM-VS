import { Router } from 'express';
import { getDb } from '../config/database.js';
import { env } from '../config/env.js';
import { isOpenAIConfigured } from '../services/openaiService.js';

const router = Router();

router.get('/', async (req, res) => {
  let database = false;
  try {
    await getDb();
    database = true;
  } catch {
    database = false;
  }

  return res.json({
    ok: true,
    services: {
      database,
      openai: isOpenAIConfigured(),
      smtp: Boolean(env.smtp.host && env.smtp.user && env.smtp.password),
      payments: env.payments.provider,
      whatsapp: env.whatsapp.provider
    }
  });
});

export default router;
