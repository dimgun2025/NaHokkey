import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth';
import { sendOtp, generateCode } from '../services/sms';
import jwt, { SignOptions } from 'jsonwebtoken';

const router = Router();

function signToken(userId: string, role: string): string {
  const opts: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '30d') as SignOptions['expiresIn'],
  };
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, opts);
}

function calcAgeGroup(birthDate: string | null): string {
  if (!birthDate) return '18+';
  const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
  if (age >= 50) return '50+';
  if (age >= 40) return '40+';
  return '18+';
}

// ===== POST /api/auth/send-otp =====
// Отправить SMS с кодом подтверждения
router.post('/send-otp', async (req: Request, res: Response): Promise<void> => {
  const { phone } = req.body;
  if (!phone) { res.status(400).json({ error: 'Укажите номер телефона' }); return; }

  const phoneClean = phone.replace(/\D/g, '');
  if (phoneClean.length < 10) { res.status(400).json({ error: 'Неверный формат номера' }); return; }

  // Антифлуд: разрешаем 1 запрос в 60 секунд
  const recent = await pool.query(
    `SELECT id FROM otp_codes WHERE phone = $1 AND created_at > NOW() - INTERVAL '60 seconds' LIMIT 1`,
    [phoneClean]
  );
  if ((recent.rowCount ?? 0) > 0) {
    res.status(429).json({ error: 'Подождите 60 секунд перед повторной отправкой' });
    return;
  }

  const code = generateCode();

  try {
    await pool.query(
      `INSERT INTO otp_codes (phone, code) VALUES ($1, $2)`,
      [phoneClean, code]
    );
    await sendOtp(phoneClean, code);
    res.json({ ok: true, message: `SMS отправлена на +${phoneClean}` });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Ошибка отправки SMS' });
  }
});

// ===== POST /api/auth/verify-otp =====
// Проверить код и выдать JWT
router.post('/verify-otp', async (req: Request, res: Response): Promise<void> => {
  const { phone, code } = req.body;
  if (!phone || !code) { res.status(400).json({ error: 'Укажите телефон и код' }); return; }

  const phoneClean = phone.replace(/\D/g, '');

  // Найти актуальный неиспользованный код
  const otpRow = await pool.query(
    `SELECT id FROM otp_codes
     WHERE phone = $1 AND code = $2 AND used = false AND expires_at > NOW()
     ORDER BY created_at DESC LIMIT 1`,
    [phoneClean, code]
  );

  if (!otpRow.rows[0]) {
    res.status(401).json({ error: 'Неверный или просроченный код' });
    return;
  }

  // Пометить код как использованный
  await pool.query(`UPDATE otp_codes SET used = true WHERE id = $1`, [otpRow.rows[0].id]);

  // Найти или создать пользователя
  let user: any;
  const existing = await pool.query(`SELECT * FROM users WHERE phone = $1`, [phoneClean]);

  if (existing.rows[0]) {
    user = existing.rows[0];
  } else {
    const created = await pool.query(
      `INSERT INTO users (phone, role) VALUES ($1, 'player') RETURNING *`,
      [phoneClean]
    );
    user = created.rows[0];
  }

  const token = signToken(user.id, user.role);
  const { password_hash: _, ...safeUser } = user;

  res.json({
    token,
    user: safeUser,
    is_new: !existing.rows[0], // Если true — фронтенд направляет на заполнение профиля
  });
});

// ===== PUT /api/auth/update-profile =====
// Заполнение профиля после первого входа
router.put('/update-profile', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, birth_date, role } = req.body;
  const userId = req.user!.userId;

  const ageGroup = calcAgeGroup(birth_date || null);

  try {
    const result = await pool.query(
      `UPDATE users SET
        name = COALESCE($1, name),
        birth_date = COALESCE($2, birth_date),
        age_group = $3,
        role = COALESCE($4, role)
       WHERE id = $5
       RETURNING id, phone, name, role, age_group, skill, positions`,
      [name || null, birth_date || null, ageGroup, role || null, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка обновления профиля' });
  }
});

// ===== PUT /api/auth/push-token =====
// Сохранить FCM токен для push-уведомлений
router.put('/push-token', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { token: pushToken } = req.body;
  if (!pushToken) { res.status(400).json({ error: 'Не указан токен' }); return; }

  await pool.query(`UPDATE users SET push_token = $1 WHERE id = $2`, [pushToken, req.user!.userId]);
  res.json({ ok: true });
});

export default router;
