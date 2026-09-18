import { Router } from 'express';
import { queryDb } from '../config/database.js';
import { requireAuth } from '../middleware/auth.js';
import { analyzePlantImages } from '../services/openaiService.js';

const router = Router();

router.post('/vision', async (req, res) => {
  const { images, context } = req.body;
  if (!Array.isArray(images) || !images.length) {
    return res.status(400).json({ error: 'Debes enviar al menos una imagen.' });
  }

  const result = await analyzePlantImages({ images, context });
  return res.json(result);
});

router.post('/save', requireAuth, async (req, res) => {
  const { plantId, sourceType, severity, confidence, summary, location, sensors, terrainDescription } = req.body;

  const inserted = await queryDb`
    INSERT INTO app.Analyses (
      UserId, PlantId, SourceType, Severity, Confidence, Summary,
      LocationLatitude, LocationLongitude, TerrainDescription,
      SensorMoisture, SensorTemperature, SensorLight, SoilPh
    )
    OUTPUT INSERTED.AnalysisId
    VALUES (
      ${req.user.userId},
      ${plantId || null},
      ${sourceType},
      ${severity},
      ${confidence || null},
      ${summary},
      ${location?.lat || null},
      ${location?.lon || null},
      ${terrainDescription || null},
      ${sensors?.moisture || null},
      ${sensors?.temp || null},
      ${sensors?.light || null},
      ${sensors?.soilPh || null}
    )
  `;

  return res.status(201).json({ analysisId: inserted.recordset[0].AnalysisId });
});

export default router;
