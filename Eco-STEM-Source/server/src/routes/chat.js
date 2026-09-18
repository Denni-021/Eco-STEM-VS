import { Router } from 'express';
import { getPlantChatAnswer } from '../services/openaiService.js';

const router = Router();

router.post('/', async (req, res) => {
  const { message, context } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'message es obligatorio.' });
  }

  const answer = await getPlantChatAnswer({ message, context });
  return res.json({ answer });
});

export default router;
