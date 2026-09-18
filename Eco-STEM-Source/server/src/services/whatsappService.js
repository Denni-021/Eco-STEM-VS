import { env } from '../config/env.js';

export async function sendWhatsAppMessage({ body }) {
  if (env.whatsapp.provider === 'demo') {
    return {
      status: 'queued_demo',
      target: env.whatsapp.fallbackTo,
      body
    };
  }

  const error = new Error('Solo esta configurado el envio WhatsApp en modo demo.');
  error.statusCode = 400;
  throw error;
}
