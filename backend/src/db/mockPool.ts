import { v4 as uuidv4 } from 'uuid';

/**
 * Имитация базы данных в оперативной памяти для демо-режима.
 */
class MockPool {
  private users: any[] = [
    {
      id: 'u1',
      phone: '79001112233',
      name: 'Алексей',
      role: 'player',
      age_group: '18+',
      skill: 'Amateur',
      positions: ['ЦН'],
      avatar_url: null,
    },
    {
      id: 'u2',
      phone: '79991112233',
      name: 'Сергей Тренеров',
      role: 'coach',
      age_group: '40+',
      skill: 'Pro',
    }
  ];

  private arenas: any[] = [
    { id: 'a1', slug: 'desant', name: 'Дворец спорта Олимпиец', sub: 'Ледовая арена Десант', address: 'г. Рязань, ул. Железнодорожная, 5а', tags: ['game', 'training'], note: 'Основная база' },
    { id: 'a2', slug: 'olimp', name: 'ДС Олимпийский', sub: 'Большая арена', address: 'г. Рязань, ул. Зубковой, 12г', tags: ['game'], note: 'Профессиональный лед' },
    { id: 'a3', slug: 'almaz', name: 'ЛК Алмаз', sub: 'Малая арена', address: 'г. Рязань, ул. Спортивная, 1', tags: ['training'], note: 'Для тренировок' }
  ];

  private games: any[] = [
    {
      id: 'g1',
      arena_id: 'a1',
      game_date: new Date(Date.now() + 86400000).toISOString(),
      time_start: '22:15:00',
      time_end: '23:30:00',
      price: 650,
      total_slots: 22,
      filled: 12,
      goalie_slots: 2,
      goalies_filled: 1,
      organizer_id: 'u1',
      age_bands: ['18+', '40+'],
      level_min: 1,
      level_max: 5,
      arena_name: 'Дворец спорта Олимпиец',
      organizer_name: 'Алексей'
    }
  ];

  private otp_codes: any[] = [];
  private participants: any[] = [];
  private messages: any[] = [];

  async query(sql: string, params: any[] = []): Promise<any> {
    const s = sql.toLowerCase();
    console.log(`[MOCK DB] Executing: ${sql.slice(0, 50)}...`);

    // --- АВТОРИЗАЦИЯ: OTP ---
    if (s.includes('insert into otp_codes')) {
      const code = { phone: params[0], code: params[1], expires_at: new Date(Date.now() + 300000), used: false, created_at: new Date() };
      this.otp_codes.push(code);
      return { rowCount: 1 };
    }
    if (s.includes('select id from otp_codes where phone = $1 and created_at > now()')) {
      return { rowCount: 0 }; // Антифлуд отключен в демо
    }
    if (s.includes('select id from otp_codes where phone = $1 and code = $2')) {
      const found = this.otp_codes.find(c => c.phone === params[0] && c.code === params[1] && !c.used);
      if (found) { found.used = true; return { rows: [{ id: 'otp_id' }] }; }
      return { rows: [] };
    }

    // --- ПОЛЬЗОВАТЕЛИ ---
    if (s.includes('select * from users where phone = $1')) {
      const user = this.users.find(u => u.phone === params[0]);
      return { rows: user ? [user] : [] };
    }
    if (s.includes('insert into users (phone, role)')) {
      const newUser = { id: uuidv4(), phone: params[0], role: params[1], name: null, age_group: '18+' };
      this.users.push(newUser);
      return { rows: [newUser] };
    }
    if (s.includes('update users set')) {
      const userIdx = this.users.findIndex(u => u.id === params[params.length - 1]);
      if (userIdx !== -1) {
        // Упрощенное обновление для демо
        if (params[0]) this.users[userIdx].name = params[0];
        if (params[1]) this.users[userIdx].birth_date = params[1];
        if (params[3]) this.users[userIdx].role = params[3];
        return { rows: [this.users[userIdx]] };
      }
      return { rows: [] };
    }

    // --- ИГРЫ ---
    if (s.includes('select g.*, a.name as arena_name')) {
      return { rows: this.games };
    }
    if (s.includes('select g.*, a.name as arena_name, a.address')) {
      const game = this.games.find(g => g.id === params[0]);
      return { rows: game ? [game] : [] };
    }
    if (s.includes('select u.id, u.name, u.skill, u.age_group')) {
      // Участники игры
      return { rows: this.users.slice(0, 5).map(u => ({ ...u, is_goalie: false })) };
    }

    // --- АРЕНЫ ---
    if (s.includes('select * from arenas')) {
      return { rows: this.arenas };
    }

    // --- ТРЕНИРОВКИ ---
    if (s.includes('from trainings')) {
      return { rows: [] };
    }

    // --- ЧАТ ---
    if (s.includes('select * from event_messages')) {
      return { rows: this.messages.filter(m => m.event_id === params[0]) };
    }
    if (s.includes('insert into event_messages')) {
      const msg = { id: uuidv4(), event_type: params[0], event_id: params[1], user_id: params[2], content: params[3], created_at: new Date() };
      this.messages.push(msg);
      return { rows: [msg] };
    }

    // Дефолтный ответ
    return { rows: [], rowCount: 0 };
  }

  // Заглушка для событий пула
  on(event: string, callback: Function) {
    console.log(`[MOCK DB] Event listener added for: ${event}`);
  }
}

export const mockPool = new MockPool();
