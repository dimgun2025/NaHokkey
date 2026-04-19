import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import pool from '../db/pool';

const router = Router();

// ===== Вычисление возрастной группы =====
function calcAgeGroup(birthDate: string | null): string {
  if (!birthDate) return '18+';
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now.getMonth() - birth.getMonth() < 0) age--;
  if (age >= 50) return '50+';
  if (age >= 40) return '40+';
  return '18+';
}

function signToken(userId: string, role: string): string {
  const opts: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
  };
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, opts);
}

// ===== POST /api/auth/register =====
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { phone, name, password, birth_date } = req.body;

  if (!phone || !password) {
    res.status(400).json({ error: 'Телефон и пароль обязательны' });
    return;
  }

  const phoneClean = phone.replace(/\D/g, '');
  const hash = await bcrypt.hash(password, 12);
  const ageGroup = calcAgeGroup(birth_date || null);

  try {
    const result = await pool.query(
      `INSERT INTO users (phone, name, birth_date, age_group, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, phone, name, role, age_group`,
      [phoneClean, name || null, birth_date || null, ageGroup, hash]
    );

    const user = result.rows[0];
    const token = signToken(user.id, user.role);
    res.status(201).json({ token, user });
  } catch (err: any) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Этот номер уже зарегистрирован' });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Ошибка регистрации' });
    }
  }
});

// ===== POST /api/auth/login =====
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    res.status(400).json({ error: 'Телефон и пароль обязательны' });
    return;
  }

  const phoneClean = phone.replace(/\D/g, '');

  try {
    const result = await pool.query(
      `SELECT id, phone, name, role, skill, age_group, positions, password_hash
       FROM users WHERE phone = $1`,
      [phoneClean]
    );

    const user = result.rows[0];
    if (!user) {
      res.status(401).json({ error: 'Пользователь не найден' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Неверный пароль' });
      return;
    }

    const token = signToken(user.id, user.role);
    const { password_hash: _, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка входа' });
  }
});

export default router;
