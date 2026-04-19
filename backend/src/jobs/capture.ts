import cron from 'node-cron';
import pool from '../db/pool';
import { capturePayment } from '../services/yookassa';
import { sendPushMulti } from '../services/push';

/**
 * Cron: каждые 30 минут ищем завершённые события (игры и тренировки)
 * и списываем зарезервированные средства.
 */
export function startCaptureCron() {
  cron.schedule('*/30 * * * *', async () => {
    console.log('[CRON] Запуск проверки списаний...');
    try {
      // === Списание за игры ===
      const gamePayments = await pool.query(`
        SELECT p.id, p.yookassa_id, p.amount, p.user_id, p.event_id
        FROM payments p
        JOIN games g ON g.id = p.event_id
        WHERE p.event_type = 'game'
          AND p.status = 'waiting_for_capture'
          AND (g.game_date + g.time_end) < NOW() - INTERVAL '15 minutes'
      `);

      for (const pmt of gamePayments.rows) {
        try {
          await capturePayment(pmt.yookassa_id, pmt.amount / 100);
          await pool.query(
            `UPDATE payments SET status = 'succeeded', captured_at = NOW() WHERE id = $1`,
            [pmt.id]
          );
          console.log(`[CRON] Списано ${pmt.amount / 100} ₽ за игру, payment ${pmt.id}`);
        } catch (err) {
          console.error(`[CRON] Ошибка capture game payment ${pmt.id}:`, err);
        }
      }

      // === Списание за тренировки ===
      const trainPayments = await pool.query(`
        SELECT p.id, p.yookassa_id, p.amount, p.user_id, p.event_id
        FROM payments p
        JOIN trainings t ON t.id = p.event_id
        WHERE p.event_type = 'training'
          AND p.status = 'waiting_for_capture'
          AND (t.train_date + t.time_end) < NOW() - INTERVAL '15 minutes'
      `);

      for (const pmt of trainPayments.rows) {
        try {
          await capturePayment(pmt.yookassa_id, pmt.amount / 100);
          await pool.query(
            `UPDATE payments SET status = 'succeeded', captured_at = NOW() WHERE id = $1`,
            [pmt.id]
          );
          console.log(`[CRON] Списано ${pmt.amount / 100} ₽ за тренировку, payment ${pmt.id}`);
        } catch (err) {
          console.error(`[CRON] Ошибка capture training payment ${pmt.id}:`, err);
        }
      }

      // === Напоминания: игры через 2 часа ===
      const upcoming = await pool.query(`
        SELECT g.id, a.name AS arena_name, g.time_start,
               ARRAY_AGG(u.push_token) FILTER (WHERE u.push_token IS NOT NULL) AS tokens
        FROM games g
        JOIN arenas a ON a.id = g.arena_id
        JOIN game_participants gp ON gp.game_id = g.id
        JOIN users u ON u.id = gp.user_id
        WHERE (g.game_date + g.time_start) BETWEEN NOW() + INTERVAL '1h 55m' AND NOW() + INTERVAL '2h 5m'
        GROUP BY g.id, a.name, g.time_start
      `);

      for (const game of upcoming.rows) {
        if (game.tokens?.length) {
          await sendPushMulti(game.tokens, {
            title: 'Напоминание об игре 🏒',
            body: `Игра на ${game.arena_name} начинается через 2 часа в ${game.time_start.slice(0, 5)}`,
          });
        }
      }

    } catch (err) {
      console.error('[CRON] Ошибка:', err);
    }
  });

  console.log('[CRON] Задача capture/notifications запущена (каждые 30 мин)');
}
