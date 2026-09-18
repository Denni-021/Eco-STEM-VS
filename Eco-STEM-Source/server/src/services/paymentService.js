import crypto from 'crypto';
import { env } from '../config/env.js';

export async function processPlanPayment({ amount, currency, paymentMethod, email, planName }) {
  if (env.payments.provider === 'demo') {
    return {
      status: 'approved_demo',
      reference: `demo_${crypto.randomUUID()}`,
      amount,
      currency,
      paymentMethod,
      email,
      planName
    };
  }

  const error = new Error('Solo esta configurado el modo demo. Conecta Stripe u otra pasarela real.');
  error.statusCode = 400;
  throw error;
}
