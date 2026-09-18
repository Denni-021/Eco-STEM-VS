import { Router } from 'express';
import { queryDb } from '../config/database.js';

const router = Router();

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

router.post('/', async (req, res) => {
  const { userId, plantId, location } = req.body;
  const lat = Number(location?.coords?.lat || 0);
  const lon = Number(location?.coords?.lon || 0);
  const accuracy = Number(location?.coords?.accuracy || 5000);
  const elevation = Number(location?.elevation || 0);
  const terrain = String(location?.terrain || '').toLowerCase();

  const latFactor = Math.abs(lat) / 90;
  const elevationFactor = Math.min(Math.max(elevation, 0) / 1800, 1);
  const tropicalBoost = Math.abs(lat) <= 20 ? 1 : 0;
  const mountainPenalty = terrain.includes('montan') ? 1 : 0;
  const coastalBoost = terrain.includes('coster') ? 1 : 0;
  const precisionPenalty = Math.min(accuracy / 3000, 1);

  const moisture = clamp(Math.round(58 + tropicalBoost * 8 + coastalBoost * 4 - mountainPenalty * 6 - latFactor * 5 + (0.5 - Math.random()) * 10), 18, 95);
  const temp = clamp(Math.round(26 + tropicalBoost * 4 + coastalBoost * 1 - elevationFactor * 8 - precisionPenalty * 2 + (0.5 - Math.random()) * 5), 8, 38);
  const light = clamp(Math.round(64 + coastalBoost * 5 - mountainPenalty * 4 + (0.5 - Math.random()) * 18), 12, 100);
  const soilPh = clamp(Number((6.3 + coastalBoost * 0.1 - mountainPenalty * 0.2 + (0.5 - Math.random()) * 0.6).toFixed(1)), 4.8, 7.8);
  const humidity = clamp(Math.round(66 + tropicalBoost * 10 + coastalBoost * 6 - mountainPenalty * 5 + (0.5 - Math.random()) * 10), 35, 98);

  await queryDb`
    INSERT INTO app.IoTReadings (UserId, PlantId, Latitude, Longitude, SoilMoisture, TemperatureC, LightPercent, SoilPh, HumidityPercent)
    VALUES (${userId || null}, ${plantId || null}, ${lat || null}, ${lon || null}, ${moisture}, ${temp}, ${light}, ${soilPh}, ${humidity})
  `;

  return res.json({
    moisture,
    temp,
    light,
    soilPh,
    humidity,
    locationPrecisionMeters: accuracy
  });
});

export default router;
