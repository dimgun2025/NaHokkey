import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createPayment, capturePayment, refundPayment } from '../services/yookassa';
import { sendPush } from '../services/push';

const router = Router();
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

// ===== POST /api/payments/create — создать платёж с холдом =====
router.post('/create', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { event_type, event_id } = req.body;
  const userId = req.user!.userId;

  if (!event_type || !event_id) {
    res.status(400).json({ error: 'Не указан тип или ID события' });
    return;
  }

  try {
    // Получаем цену из события
    let price = 0;
    let description = '';
    if (event_type === 'game') {
      const g = await pool.query('SELECT price FROM games WHERE id = $1', [event_id]);
      if (!g.rows[0]) { res.status(404).json({ error: 'Игра не найдена' }); return; }
      price = g.rows[0].price;
      description = 'Оплата места в игре НаХоккей/Рязань';
    } else {
      const t = await pool.query('SELECT price FROM trainings WHERE id = $1', [event_id]);
      if (!t.rows[0]) { res.status(404).json({ error: 'Тренировка не найдена' }); return; }
      price = t.rows[0].price;
      description = 'Оплата места на тренировке НаХоккей/Рязань';
    }

    // Создать платёж в ЮКасса
    const payment = await createPayment({
      amount: price,
      description,
      returnUrl: `${APP_URL}/payment-success?event=${event_type}&id=${event_id}`,
      metadata: { user_id: userId, event_type, event_id },
    });

    // Сохранить в БД
    const result = await pool.query(
      `INSERT INTO payments (user_id, event_type, event_id, yookassa_id, amount, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [userId, event_type, event_id, payment.id, price * 100, payment.status]
    );

    res.json({
      payment_id: result.rows[0].id,
      yookassa_id: payment.id,
      redirect_url: payment.confirmation?.confirmation_url,
      status: payment.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка создания платежа' });
  }
});

// ===== POST /api/payments/webhook — входящий webhook от ЮКасса =====
router.post('/webhook', async (req: Request, res: Response): Promise<void> => {
  const { event, object } = req.body;

  if (!object?.id) { res.json({ ok: 1 }); return; }

  try {
    const yookassaId = object.id;

    // Обновить статус платежа в нашей БД
    const payment = await pool.query(
      `UPDATE payments SET status = $1 WHERE yookassa_id = $2 RETURNING user_id, event_type, event_id, amount`,
      [object.status, yookassaId]
    );

    if (!payment.rows[0]) { res.json({ ok: 1 }); return; }

    const { user_id, event_type } = payment.rows[0];

    // При успешной оплате — добавить участника в событие
    if (event === 'payment.waiting_for_capture' || object.status === 'waiting_for_capture') {
      if (event_type === 'game') {
        await pool.query(
          `INSERT INTO game_participants (game_id, user_id) VALUES ($2, $1) ON CONFLICT DO NOTHING`,
          [user_id, payment.rows[0].event_id]
        );
      } else {
        await pool.query(
          `INSERT INTO training_participants (training_id, user_id) VALUES ($2, $1) ON CONFLICT DO NOTHING`,
          [user_id, payment.rows[0].event_id]
        );
      }

      // Push-уведомление пользователю
      const userRow = await pool.query('SELECT push_token, name FROM users WHERE id = $1', [user_id]);
      if (userRow.rows[0]?.push_token) {
        await sendPush(userRow.rows[0].push_token, {
          title: 'Место забронировано!',
          body: `Средства зарезервированы. Спишутся после ${event_type === 'game' ? 'игры' : 'тренировки'}.`,
        });
      }
    }

    res.json({ ok: 1 });
  } catch (err) {
    console.error('[webhook]', err);
    res.json({ ok: 1 }); // всегда 200, чтобы ЮКасса не повторяла
  }
});

// ===== POST /api/payments/refund — запрос возврата =====
router.post('/refund', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const { payment_id, reason } = req.body;
  const userId = req.user!.userId;

  if (!payment_id) { res.status(400).json({ error: 'Не указан ID платежа' }); return; }

  try {
    const row = await pool.query(
      `SELECT * FROM payments WHERE id = $1 AND user_id = $2`,
      [payment_id, userId]
    );

    const pmt = row.rows[0];
    if (!pmt) { res.status(404).json({ error: 'Платёж не найден' }); return; }
    if (pmt.status === 'canceled' || pmt.status === 'refunded') {
      res.status(400).json({ error: 'Платёж уже отменён или возвращён' }); return;
    }

    // Проверить время начала события
    let startTime: Date;
    if (pmt.event_type === 'game') {
      const ev = await pool.query('SELECT game_date, time_start FROM games WHERE id = $1', [pmt.event_id]);
      startTime = new Date(`${ev.rows[0].game_date.toISOString().split('T')[0]}T${ev.rows[0].time_start}`);
    } else {
      const ev = await pool.query('SELECT train_date, time_start FROM trainings WHERE id = $1', [pmt.event_id]);
      startTime = new Date(`${ev.rows[0].train_date.toISOString().split('T')[0]}T${ev.rows[0].time_start}`);
    }

    const now = new Date();
    const hoursBeforeStart = (startTime.getTime() - now.getTime()) / 3600000;

    // До начала: полный возврат. После: частичный или отказ (бизнес-логика)
    const refundAmount = hoursBeforeStart > 6 ? pmt.amount / 100 : pmt.amount / 100 * 0.5;

    // Выполнить возврат в ЮКасса
    await refundPayment(pmt.yookassa_id, refundAmount, reason);

    // Обновить статус
    await pool.query(
      `UPDATE payments SET status = 'refunded', refund_reason = $1, refunded_at = NOW() WHERE id = $2`,
      [reason, payment_id]
    );

    // Удалить из участников
    if (pmt.event_type === 'game') {
      await pool.query('DELETE FROM game_participants WHERE game_id = $1 AND user_id = $2', [pmt.event_id, userId]);
    } else {
      await pool.query('DELETE FROM training_participants WHERE training_id = $1 AND user_id = $2', [pmt.event_id, userId]);
    }

    // Push-уведомление
    const userRow = await pool.query('SELECT push_token FROM users WHERE id = $1', [userId]);
    if (userRow.rows[0]?.push_token) {
      await sendPush(userRow.rows[0].push_token, {
        title: 'Возврат обработан',
        body: `Возврат ${refundAmount.toFixed(0)} ₽ будет зачислен в течение 2 рабочих дней.`,
      });
    }

    res.json({ ok: true, refund_amount: refundAmount, message: hoursBeforeStart > 6 ? 'Полный возврат' : 'Частичный возврат (50%)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при возврате' });
  }
});

// ===== GET /api/payments/my — история платежей =====
router.get('/my', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT p.id, p.event_type, p.event_id, p.amount, p.status, p.created_at, p.refund_reason, p.refunded_at
       FROM payments p WHERE p.user_id = $1 ORDER BY p.created_at DESC LIMIT 50`,
      [req.user!.userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка загрузки платежей' });
  }
});

export default router;
