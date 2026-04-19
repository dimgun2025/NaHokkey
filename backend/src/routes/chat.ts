import { Router, Response } from 'express';
import pool from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// ===== POST /api/chat/:type/:id — отправить сообщение =====
// :type can be 'game' or 'training'
router.post('/:type/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { type, id } = req.params;
  const { content, image_base64 } = req.body;
  const userId = req.user!.userId;

  // 1. Валидация текста (до 50 символов)
  if (content && content.length > 50) {
    res.status(400).json({ error: 'Сообщение слишком длинное (макс. 50 символов)' });
    return;
  }

  // 2. Валидация фото (до 10 МБ)
  if (image_base64) {
    // Грубый расчет размера base64 (3/4 от длины строки)
    const sizeInBytes = (image_base64.length * 3) / 4;
    const maxSizeBytes = 10 * 1024 * 1024; // 10 MB
    if (sizeInBytes > maxSizeBytes) {
      res.status(400).json({ error: 'Фото слишком большое (макс. 10 МБ)' });
      return;
    }
  }

  if (!content && !image_base64) {
    res.status(400).json({ error: 'Сообщение не может быть пустым' });
    return;
  }

  try {
    // 3. Проверка участия пользователя
    let isParticipant = false;
    if (type === 'game') {
      const check = await pool.query(
        'SELECT id FROM game_participants WHERE game_id = $1 AND user_id = $2',
        [id, userId]
      );
      isParticipant = check.rowCount! > 0;
    } else if (type === 'training') {
      const check = await pool.query(
        'SELECT id FROM training_participants WHERE training_id = $1 AND user_id = $2',
        [id, userId]
      );
      isParticipant = check.rowCount! > 0;
    }

    if (!isParticipant) {
      res.status(403).json({ error: 'Только участники могут писать в чат' });
      return;
    }

    // 4. Проверка, что событие еще не началось
    let startTime: Date;
    if (type === 'game') {
      const event = await pool.query('SELECT game_date, time_start FROM games WHERE id = $1', [id]);
      if (!event.rows[0]) { res.status(404).json({ error: 'Игра не найдена' }); return; }
      startTime = new Date(`${event.rows[0].game_date.toISOString().split('T')[0]}T${event.rows[0].time_start}`);
    } else {
      const event = await pool.query('SELECT train_date, time_start FROM trainings WHERE id = $1', [id]);
      if (!event.rows[0]) { res.status(404).json({ error: 'Тренировка не найдена' }); return; }
      startTime = new Date(`${event.rows[0].train_date.toISOString().split('T')[0]}T${event.rows[0].time_start}`);
    }

    if (new Date() >= startTime) {
      res.status(400).json({ error: 'Чат закрыт, событие уже началось' });
      return;
    }

    // 5. Сохранение сообщения
    const result = await pool.query(
      `INSERT INTO event_messages (event_type, event_id, user_id, content, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [type, id, userId, content, image_base64]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка отправки сообщения' });
  }
});

// ===== GET /api/chat/:type/:id — получить сообщения =====
router.get('/:type/:id', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { type, id } = req.params;

  try {
    // Проверка времени начала (авто-удаление из выдачи)
    let startTime: Date;
    if (type === 'game') {
      const event = await pool.query('SELECT game_date, time_start FROM games WHERE id = $1', [id]);
      if (!event.rows[0]) { res.status(404).json({ error: 'Событие не найдено' }); return; }
      startTime = new Date(`${event.rows[0].game_date.toISOString().split('T')[0]}T${event.rows[0].time_start}`);
    } else {
      const event = await pool.query('SELECT train_date, time_start FROM trainings WHERE id = $1', [id]);
      if (!event.rows[0]) { res.status(404).json({ error: 'Событие не найдено' }); return; }
      startTime = new Date(`${event.rows[0].train_date.toISOString().split('T')[0]}T${event.rows[0].time_start}`);
    }

    if (new Date() >= startTime) {
      // Автоматическое удаление старых сообщений из БД (физическое)
      await pool.query('DELETE FROM event_messages WHERE event_id = $1 AND event_type = $2', [id, type]);
      res.json([]);
      return;
    }

    const messages = await pool.query(
      `SELECT m.id, m.content, m.image_url, m.created_at, u.name as user_name, u.role as user_role
       FROM event_messages m
       JOIN users u ON u.id = m.user_id
       WHERE m.event_id = $1 AND m.event_type = $2
       ORDER BY m.created_at ASC`,
      [id, type]
    );

    res.json(messages.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка загрузки чата' });
  }
});

export default router;
