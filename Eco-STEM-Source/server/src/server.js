import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { getDb } from './config/database.js';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import analysisRoutes from './routes/analysis.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';
import contactRoutes from './routes/contact.js';
import iotRoutes from './routes/iot.js';
import preferencesRoutes from './routes/preferences.js';
import recommendationRoutes from './routes/recommendations.js';
import statusRoutes from './routes/status.js';
import subscriptionRoutes from './routes/subscriptions.js';

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json({ limit: '12mb' }));

app.get('/health', async (req, res) => {
  await getDb();
  res.json({ ok: true, service: 'ecostem-backend' });
});

app.use('/api/status', statusRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/recommendations', recommendationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Eco-STEM backend escuchando en http://localhost:${env.port}`);
});
