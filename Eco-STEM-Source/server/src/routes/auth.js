import { Router } from 'express';
import { queryDb } from '../config/database.js';
import { signToken } from '../middleware/auth.js';
import { hashPassword, verifyPassword } from '../utils/crypto.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, phone, password } = req.body;
  if ((!email && !phone) || !password || !firstName) {
    return res.status(400).json({ error: 'firstName, password y email o phone son obligatorios.' });
  }

  const existing = await queryDb`
    SELECT TOP 1 UserId, Email, Phone
    FROM app.Users
    WHERE Email = ${email || null} OR Phone = ${phone || null}
  `;

  if (existing.recordset.length) {
    return res.status(409).json({ error: 'Ese usuario ya existe.' });
  }

  const result = await queryDb`
    INSERT INTO app.Users (FirstName, LastName, Email, Phone, PasswordHash, PlanStatus)
    OUTPUT INSERTED.UserId
    VALUES (${firstName}, ${lastName || null}, ${email || null}, ${phone || null}, ${hashPassword(password)}, ${'free'})
  `;

  const userId = result.recordset[0].UserId;
  const token = signToken({ userId, email: email || null, phone: phone || null });
  return res.status(201).json({
    token,
    userId,
    user: {
      userId,
      email: email || '',
      phone: phone || '',
      firstName,
      lastName: lastName || '',
      planStatus: 'free'
    }
  });
});

router.post('/login', async (req, res) => {
  const { email, phone, password } = req.body;
  if ((!email && !phone) || !password) {
    return res.status(400).json({ error: 'Debes enviar email o phone y password.' });
  }

  const result = await queryDb`
    SELECT TOP 1 UserId, Email, Phone, PasswordHash, PlanStatus, FirstName, LastName
    FROM app.Users
    WHERE Email = ${email || null} OR Phone = ${phone || null}
  `;

  const user = result.recordset[0];
  if (!user || !verifyPassword(password, user.PasswordHash)) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' });
  }

  const token = signToken({ userId: user.UserId, email: user.Email, phone: user.Phone });
  return res.json({
    token,
    user: {
      userId: user.UserId,
      email: user.Email,
      phone: user.Phone,
      firstName: user.FirstName,
      lastName: user.LastName,
      planStatus: user.PlanStatus
    }
  });
});

export default router;
