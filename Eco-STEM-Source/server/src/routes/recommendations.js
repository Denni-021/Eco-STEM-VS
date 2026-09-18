import { Router } from 'express';
import { getPlantRecommendations, isOpenAIConfigured } from '../services/openaiService.js';

const router = Router();

router.post('/', async (req, res) => {
  const { filters, location, sensors } = req.body;

  if (!filters) {
    return res.status(400).json({ error: 'filters es obligatorio.' });
  }

  if (!isOpenAIConfigured()) {
    return res.status(503).json({ error: 'OpenAI no configurado para recomendaciones.' });
  }

  const payload = await getPlantRecommendations({ filters, location, sensors });
  return res.json(payload);
});

export default router;
