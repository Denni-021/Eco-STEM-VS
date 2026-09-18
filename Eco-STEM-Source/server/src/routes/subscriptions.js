import { Router } from 'express';
import { queryDb } from '../config/database.js';
import { env } from '../config/env.js';
import { sendEmail } from '../services/emailService.js';
import { processPlanPayment } from '../services/paymentService.js';
import { hashPassword } from '../utils/crypto.js';

const router = Router();

function computeEndDate(planCode, startDate = new Date()) {
  const end = new Date(startDate);
  if (planCode === 'monthly') end.setMonth(end.getMonth() + 1);
  else if (planCode === 'semiannual') end.setMonth(end.getMonth() + 6);
  else if (planCode === 'annual') end.setFullYear(end.getFullYear() + 1);
  else end.setMonth(end.getMonth() + 1);
  return end;
}

async function resolveUser({ userId, user, email, password }) {
  if (userId) {
    const existing = await queryDb`
      SELECT TOP 1 UserId, Email, Phone, FirstName, LastName, PlanStatus
      FROM app.Users
      WHERE UserId = ${userId}
    `;
    return existing.recordset[0] || null;
  }

  const fullName = [user?.name || user?.firstName || '', user?.lastname || user?.lastName || '']
    .join(' ')
    .trim();
  const firstName = user?.name || user?.firstName || email?.split('@')[0] || 'Cliente';
  const lastName = user?.lastname || user?.lastName || '';
  const normalizedEmail = (user?.email || email || '').trim().toLowerCase();

  if (!normalizedEmail || !password) return null;

  const found = await queryDb`
    SELECT TOP 1 UserId, Email, Phone, FirstName, LastName, PlanStatus
    FROM app.Users
    WHERE Email = ${normalizedEmail}
  `;

  if (found.recordset[0]) {
    const current = found.recordset[0];
    await queryDb`
      UPDATE app.Users
      SET FirstName = ${firstName},
          LastName = ${lastName || null},
          UpdatedAt = SYSUTCDATETIME()
      WHERE UserId = ${current.UserId}
    `;
    return { ...current, Email: normalizedEmail, FirstName: firstName, LastName: lastName };
  }

  const inserted = await queryDb`
    INSERT INTO app.Users (FirstName, LastName, Email, PasswordHash, PlanStatus)
    OUTPUT INSERTED.UserId, INSERTED.Email, INSERTED.Phone, INSERTED.FirstName, INSERTED.LastName, INSERTED.PlanStatus
    VALUES (${firstName}, ${lastName || null}, ${normalizedEmail}, ${hashPassword(password)}, ${'free'})
  `;

  return inserted.recordset[0] || {
    UserId: null,
    Email: normalizedEmail,
    Phone: '',
    FirstName: firstName,
    LastName: lastName,
    PlanStatus: 'free'
  };
}

router.post('/purchase', async (req, res) => {
  const {
    userId,
    user,
    plan,
    planCode,
    planName,
    amount,
    currency,
    paymentMethod,
    card,
    email,
    password
  } = req.body;

  const normalizedPlanCode = planCode || plan?.code;
  const normalizedPlanName = planName || plan?.name;
  const normalizedAmount = Number(amount || plan?.price || 0);
  const normalizedCurrency = currency || 'USD';
  const normalizedPaymentMethod = paymentMethod || card?.brand;
  const normalizedEmail = (email || user?.email || '').trim().toLowerCase();
  const resolvedUser = await resolveUser({
    userId,
    user,
    email: normalizedEmail,
    password: password || req.body.user?.password
  });

  if (!resolvedUser?.UserId || !normalizedPlanCode || !normalizedPlanName || !normalizedAmount || !normalizedPaymentMethod) {
    return res.status(400).json({ error: 'Faltan datos para procesar la compra.' });
  }

  const payment = await processPlanPayment({
    amount: normalizedAmount,
    currency: normalizedCurrency,
    paymentMethod: normalizedPaymentMethod,
    email: normalizedEmail,
    planName: normalizedPlanName
  });

  const startDate = new Date();
  const endDate = computeEndDate(normalizedPlanCode, startDate);

  await queryDb`
    UPDATE app.Subscriptions
    SET Status = ${'expired'}
    WHERE UserId = ${resolvedUser.UserId}
      AND Status = ${'active'}
  `;

  const subscriptionInsert = await queryDb`
    INSERT INTO app.Subscriptions (UserId, PlanCode, PlanName, Status, StartDate, EndDate, AutoRenew)
    OUTPUT INSERTED.SubscriptionId
    VALUES (${resolvedUser.UserId}, ${normalizedPlanCode}, ${normalizedPlanName}, ${'active'}, ${startDate.toISOString()}, ${endDate.toISOString()}, ${1})
  `;

  const subscriptionId = subscriptionInsert.recordset[0].SubscriptionId;

  await queryDb`
    INSERT INTO app.Payments (UserId, SubscriptionId, Amount, CurrencyCode, PaymentMethod, ProviderName, ProviderReference, MaskedCard, Status, PaidAt)
    VALUES (
      ${resolvedUser.UserId},
      ${subscriptionId},
      ${normalizedAmount},
      ${normalizedCurrency},
      ${normalizedPaymentMethod},
      ${'demo'},
      ${payment.reference},
      ${card?.last4 ? `**** **** **** ${card.last4}` : null},
      ${payment.status},
      ${new Date().toISOString()}
    )
  `;

  await queryDb`
    UPDATE app.Users
    SET PlanStatus = ${'active'}, UpdatedAt = SYSUTCDATETIME()
    WHERE UserId = ${resolvedUser.UserId}
  `;

  const userEmail = normalizedEmail || resolvedUser.Email;
  if (userEmail) {
    await sendEmail({
      to: userEmail,
      subject: `Tu plan ${normalizedPlanName} fue activado`,
      text: `Tu suscripcion fue activada correctamente. Vigencia hasta ${endDate.toISOString()}.`
    });
  }

  if (env.companyEmail) {
    await sendEmail({
      to: env.companyEmail,
      subject: `Nueva compra de plan ${normalizedPlanName}`,
      text: `Se activo el plan ${normalizedPlanName} para ${userEmail || resolvedUser.UserId}. Referencia ${payment.reference}.`
    });
  }

  return res.status(201).json({
    subscriptionId,
    payment,
    user: {
      userId: resolvedUser.UserId,
      email: userEmail || '',
      phone: resolvedUser.Phone || '',
      firstName: resolvedUser.FirstName || '',
      lastName: resolvedUser.LastName || '',
      planStatus: 'active'
    },
    subscription: {
      subscriptionId,
      planCode: normalizedPlanCode,
      planName: normalizedPlanName,
      status: 'active',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
  });
});

export default router;
