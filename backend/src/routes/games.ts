import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// ===== GET /api/games — список игр (с фильтром по датам) =====
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { from, to, arena_id, age_band } = req.query;

  let query = `
    SELECT
      g.*,
      a.name AS arena_name, a.address, a.slug AS arena_slug,
      u.name AS organizer_name,
      COUNT(gp.id) FILTER (WHERE NOT gp.is_goalie) AS filled,
      COUNT(gp.id) FILTER (WHERE gp.is_goalie) AS goalies_filled
    FROM games g
    LEFT JOIN arenas a ON a.id = g.arena_id
    LEFT JOIN users u ON u.id = g.organizer_id
    LEFT JOIN game_participants gp ON gp.game_id = g.id
    WHERE 1=1
  `;
  const params: any[] = [];
  let idx = 1;

  if (from) { query += ` AND g.game_date >= $${idx++}`; params.push(from); }
  if (to)   { query += ` AND g.game_date <= $${idx++}`; params.push(to); }
  if (arena_id) { query += ` AND g.arena_id = $${idx++}`; params.push(arena_id); }
  if (age_band) { query += ` AND $${idx++} = ANY(g.age_bands)`; params.push(age_band); }

  query += ' GROUP BY g.id, a.id, u.id ORDER BY g.game_date, g.time_start';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки игр' });
  }
});

// ===== GET /api/games/:id — детали игры =====
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const game = await pool.query(
      `SELECT g.*, a.name AS arena_name, a.address, u.name AS organizer_name
       FROM games g
       LEFT JOIN arenas a ON a.id = g.arena_id
       LEFT JOIN users u ON u.id = g.organizer_id
       WHERE g.id = $1`,
      [req.params.id]
    );
    if (!game.rows[0]) { res.status(404).json({ error: 'Игра не найдена' }); return; }

    const participants = await pool.query(
      `SELECT u.id, u.name, u.skill, u.age_group, u.positions, gp.is_goalie
       FROM game_participants gp
       JOIN users u ON u.id = gp.user_id
       WHERE gp.game_id = $1`,
      [req.params.id]
    );

    res.json({ ...game.rows[0], participants: participants.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки игры' });
  }
});

// ===== POST /api/games/:id/join — запись игрока =====
router.post('/:id/join', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { is_goalie = false } = req.body;
  try {
    await pool.query(
      `INSERT INTO game_participants (game_id, user_id, is_goalie) VALUES ($1, $2, $3)
       ON CONFLICT (game_id, user_id) DO NOTHING`,
      [req.params.id, req.user!.userId, is_goalie]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка записи на игру' });
  }
});

// ===== POST /api/games/:id/leave — отмена записи =====
router.post('/:id/leave', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await pool.query(
      `DELETE FROM game_participants WHERE game_id = $1 AND user_id = $2`,
      [req.params.id, req.user!.userId]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка отмены записи' });
  }
});

export default router;
