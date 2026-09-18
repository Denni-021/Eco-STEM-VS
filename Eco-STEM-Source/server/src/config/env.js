import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  frontendUrl: process.env.FRONTEND_URL || 'http://127.0.0.1:5500',
  jwtSecret: process.env.JWT_SECRET || 'change-this-super-secret-key',
  sql: {
    server: process.env.SQL_SERVER || 'localhost',
    database: process.env.SQL_DATABASE || 'EcoStemDB',
    user: process.env.SQL_USER || 'sa',
    password: process.env.SQL_PASSWORD || '',
    port: Number(process.env.SQL_PORT || 1433),
    options: {
      encrypt: String(process.env.SQL_ENCRYPT || 'false').toLowerCase() === 'true',
      trustServerCertificate: String(process.env.SQL_TRUST_CERT || 'true').toLowerCase() === 'true'
    }
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-5.1',
    visionModel: process.env.OPENAI_VISION_MODEL || 'gpt-4.1'
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || 'Eco-STEM <no-reply@ecostem.io>'
  },
  companyEmail: process.env.COMPANY_EMAIL || process.env.SMTP_USER || 'soporte@ecostem.io',
  payments: {
    provider: process.env.PAYMENT_PROVIDER || 'demo',
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || ''
  },
  whatsapp: {
    provider: process.env.WHATSAPP_PROVIDER || 'demo',
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    from: process.env.TWILIO_WHATSAPP_FROM || '',
    fallbackTo: process.env.WHATSAPP_TO || ''
  }
};
