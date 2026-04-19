import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// ===== GET /api/trainings =====
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { from, to, coach_id } = req.query;

  let query = `
    SELECT
      t.*,
      a.name AS arena_name, a.address,
      u.name AS coach_name,
      COUNT(tp.id) AS filled
    FROM trainings t
    LEFT JOIN arenas a ON a.id = t.arena_id
    LEFT JOIN users u ON u.id = t.coach_id
    LEFT JOIN training_participants tp ON tp.training_id = t.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let idx = 1;

  if (from) { query += ` AND t.train_date >= $${idx++}`; params.push(from); }
  if (to)   { query += ` AND t.train_date <= $${idx++}`; params.push(to); }
  if (coach_id) { query += ` AND t.coach_id = $${idx++}`; params.push(coach_id); }

  query += ' GROUP BY t.id, a.id, u.id ORDER BY t.train_date, t.time_start';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки тренировок' });
  }
});

// ===== GET /api/trainings/:id =====
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const training = await pool.query(
      `SELECT t.*, a.name AS arena_name, a.address, u.name AS coach_name
       FROM trainings t
       LEFT JOIN arenas a ON a.id = t.arena_id
       LEFT JOIN users u ON u.id = t.coach_id
       WHERE t.id = $1`,
      [req.params.id]
    );
    if (!training.rows[0]) { res.status(404).json({ error: 'Тренировка не найдена' }); return; }

    const participants = await pool.query(
      `SELECT u.id, u.name, u.skill, u.age_group
       FROM training_participants tp
       JOIN users u ON u.id = tp.user_id
       WHERE tp.training_id = $1`,
      [req.params.id]
    );

    res.json({ ...training.rows[0], participants: participants.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки тренировки' });
  }
});

// ===== POST /api/trainings/:id/join =====
router.post('/:id/join', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query(
      `INSERT INTO training_participants (training_id, user_id) VALUES ($1, $2)
       ON CONFLICT (training_id, user_id) DO NOTHING`,
      [req.params.id, req.user!.userId]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка записи на тренировку' });
  }
});

// ===== POST /api/trainings/:id/leave =====
router.post('/:id/leave', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query(
      `DELETE FROM training_participants WHERE training_id = $1 AND user_id = $2`,
      [req.params.id, req.user!.userId]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка отмены записи' });
  }
});

export default router;
