-- НаХоккей/Рязань — схема базы данных
-- Запуск: psql $DATABASE_URL -f src/db/schema.sql

-- Расширения
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===== ПОЛЬЗОВАТЕЛИ =====
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone         VARCHAR(20) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL DEFAULT '',
  name          VARCHAR(100),
  birth_date    DATE,
  skill         VARCHAR(4) DEFAULT 'C2',     -- C0..C4
  age_group     VARCHAR(5),                  -- 18+, 40+, 50+ (авто из даты рождения)
  grip          VARCHAR(10) DEFAULT 'Правый',
  positions     TEXT[],                      -- массив амплуа (до 2)
  avatar_url    TEXT,
  role          VARCHAR(20) DEFAULT 'player', -- player | coach | organizer | admin
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ===== АРЕНЫ =====
CREATE TABLE IF NOT EXISTS arenas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        VARCHAR(50) UNIQUE NOT NULL,
  name        VARCHAR(100) NOT NULL,
  sub         VARCHAR(100),
  address     VARCHAR(200),
  tags        TEXT[],
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ===== ТРЕНЕРЫ (расширение пользователя) =====
CREATE TABLE IF NOT EXISTS coaches (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  verified        BOOLEAN DEFAULT FALSE,
  priority        VARCHAR(30) DEFAULT 'На проверке',
  rating          NUMERIC(3,2) DEFAULT 0,
  completed       INT DEFAULT 0,
  specialization  TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ===== ОРГАНИЗАТОРЫ =====
CREATE TABLE IF NOT EXISTS organizers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  verified      BOOLEAN DEFAULT FALSE,
  priority      VARCHAR(30) DEFAULT 'Стандарт',
  rating        NUMERIC(3,2) DEFAULT 0,
  completed     INT DEFAULT 0,
  no_show_rate  VARCHAR(10) DEFAULT '0%',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ===== ИГРОВЫЕ СЛОТЫ (хоккейные игры) =====
CREATE TABLE IF NOT EXISTS games (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arena_id      UUID REFERENCES arenas(id),
  organizer_id  UUID REFERENCES users(id),
  game_date     DATE NOT NULL,
  time_start    TIME NOT NULL,
  time_end      TIME NOT NULL,
  price         INT NOT NULL,              -- в рублях
  level_from    VARCHAR(4) DEFAULT 'C1',
  level_to      VARCHAR(4) DEFAULT 'C4',
  age_bands     TEXT[],                   -- ['18+', '40+']
  total_slots   INT DEFAULT 20,
  goalie_slots  INT DEFAULT 2,
  status        VARCHAR(100),
  urgent        BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ===== УЧАСТНИКИ ИГРЫ =====
CREATE TABLE IF NOT EXISTS game_participants (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id    UUID REFERENCES games(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  is_goalie  BOOLEAN DEFAULT FALSE,
  joined_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, user_id)
);

-- ===== ТРЕНИРОВКИ (подкатки) =====
CREATE TABLE IF NOT EXISTS trainings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arena_id      UUID REFERENCES arenas(id),
  coach_id      UUID REFERENCES users(id),
  train_date    DATE NOT NULL,
  time_start    TIME NOT NULL,
  time_end      TIME NOT NULL,
  price         INT NOT NULL,
  format        VARCHAR(100),
  goal          TEXT,
  level_from    VARCHAR(4) DEFAULT 'C0',
  level_to      VARCHAR(4) DEFAULT 'C4',
  total_slots   INT DEFAULT 10,
  ice_logic     TEXT,
  status        VARCHAR(100),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ===== УЧАСТНИКИ ТРЕНИРОВКИ =====
CREATE TABLE IF NOT EXISTS training_participants (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id  UUID REFERENCES trainings(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(training_id, user_id)
);

-- ===== СООБЩЕНИЯ ЧАТА =====
CREATE TABLE IF NOT EXISTS event_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type   VARCHAR(10) NOT NULL CHECK (event_type IN ('game', 'training')),
  event_id     UUID NOT NULL,
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  content      VARCHAR(50),
  image_url    TEXT, -- Ссылка на фото или base64
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Индекс для быстрого поиска сообщений события
CREATE INDEX IF NOT EXISTS idx_messages_event ON event_messages(event_id, event_type);

-- ===== ИНДЕКСЫ =====
CREATE INDEX IF NOT EXISTS idx_games_date ON games(game_date);
CREATE INDEX IF NOT EXISTS idx_games_arena ON games(arena_id);
CREATE INDEX IF NOT EXISTS idx_trainings_date ON trainings(train_date);
CREATE INDEX IF NOT EXISTS idx_trainings_coach ON trainings(coach_id);

-- ===== НАЧАЛЬНЫЕ ДАННЫЕ (Арены) =====
INSERT INTO arenas (slug, name, sub, address, tags, note) VALUES
  ('ol-main',  'Олимпийский',      'Основная арена',      'ул. Зубковой, 12 к.2', ARRAY['Игра','Аренда льда'],      'Под матчи и большие слоты.'),
  ('ol-train', 'Олимпийский',      'Тренировочная арена', 'ул. Зубковой, 12 к.2', ARRAY['Под тренера','Подкатки'], 'Удобна для взрослых тренировок.'),
  ('desant',   'Десант',           'Ледовый дворец',      'ул. Солнечная, 1г',    ARRAY['Игра','Тренировка'],      'Утренние и поздние слоты.'),
  ('iceberg',  'Айсберг',          'Ледовая арена',       'ул. Шевченко, 51',     ARRAY['Любительские команды'],    'Под игры команд.'),
  ('sasovo',   'Планета спорта',   'Сасово',              'г. Сасово',            ARRAY['Выездной лед','Сборы'],    'Выездные тренировки.')
ON CONFLICT (slug) DO NOTHING;
