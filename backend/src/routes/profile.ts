import { Router, Response } from 'express';
import pool from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// Все маршруты профиля требуют авторизации
router.use(authenticate);

// ===== GET /api/profile/me =====
router.get('/me', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT id, phone, name, birth_date, skill, age_group, grip, positions, avatar_url, role
       FROM users WHERE id = $1`,
      [req.user!.userId]
    );
    if (!result.rows[0]) { res.status(404).json({ error: 'Пользователь не найден' }); return; }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки профиля' });
  }
});

// ===== PATCH /api/profile/me — обновление профиля =====
router.patch('/me', async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, birth_date, skill, grip, positions } = req.body;

  // Автоматический расчёт возрастной группы
  const calcAgeGroup = (dob: string | null) => {
    if (!dob) return '18+';
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    if (now.getMonth() - birth.getMonth() < 0) age--;
    if (age >= 50) return '50+';
    if (age >= 40) return '40+';
    return '18+';
  };

  const age_group = birth_date ? calcAgeGroup(birth_date) : undefined;

  try {
    const result = await pool.query(
      `UPDATE users SET
        name       = COALESCE($1, name),
        birth_date = COALESCE($2, birth_date),
        skill      = COALESCE($3, skill),
        grip       = COALESCE($4, grip),
        positions  = COALESCE($5, positions),
        age_group  = COALESCE($6, age_group)
       WHERE id = $7
       RETURNING id, name, birth_date, skill, age_group, grip, positions`,
      [name, birth_date, skill, grip, positions, age_group, req.user!.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сохранения профиля' });
  }
});

// ===== POST /api/profile/me/avatar — загрузка аватара (base64) =====
router.post('/me/avatar', async (req: AuthRequest, res: Response): Promise<void> => {
  const { avatar_base64 } = req.body;
  if (!avatar_base64?.startsWith('data:image/')) {
    res.status(400).json({ error: 'Некорректный формат изображения' });
    return;
  }

  // В production рекомендуется загружать в S3/Object Storage
  // Сейчас сохраняем base64 прямо в БД (подходит для MVP)
  try {
    await pool.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [
      avatar_base64,
      req.user!.userId,
    ]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки аватара' });
  }
});

// ===== GET /api/profile/me/games — мои игры =====
router.get('/me/games', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT g.id, g.game_date, g.time_start, g.time_end, a.name AS arena_name, gp.is_goalie
       FROM game_participants gp
       JOIN games g ON g.id = gp.game_id
       LEFT JOIN arenas a ON a.id = g.arena_id
       WHERE gp.user_id = $1
       ORDER BY g.game_date DESC`,
      [req.user!.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки игр' });
  }
});

export default router;
