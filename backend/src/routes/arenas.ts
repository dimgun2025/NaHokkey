import { Router, Request, Response } from 'express';
import pool from '../db/pool';

const router = Router();

// ===== GET /api/arenas =====
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM arenas ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки арен' });
  }
});

// ===== GET /api/arenas/:slug =====
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM arenas WHERE slug = $1', [req.params.slug]);
    if (!result.rows[0]) { res.status(404).json({ error: 'Арена не найдена' }); return; }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки арены' });
  }
});

export default router;
