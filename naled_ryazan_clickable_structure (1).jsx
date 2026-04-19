import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock3,
  Users,
  Wallet,
  ShieldCheck,
  Bell,
  Goal,
  ChevronRight,
  Plus,
  CalendarDays,
  Trophy,
  UserCircle2,
  Dumbbell,
  Building2,
  GraduationCap,
  BadgeCheck,
  Star,
  TimerReset,
  ShieldAlert,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const games = [
  {
    id: 1,
    arena: 'Десант',
    address: 'ул. Солнечная, 1г',
    dayOffset: 0,
    timeRange: '22:15–23:15',
    price: '690 ₽',
    level: 'C2–C3',
    ageBands: ['18+'],
    filled: 16,
    total: 20,
    goalies: '1/2',
    status: 'Добираем 4 игрока',
    urgent: true,
    organizerId: 'org-1',
    rosterMix: [
      { age: '18+', skill: 'C2', count: 7 },
      { age: '18+', skill: 'C3', count: 5 },
      { age: '40+', skill: 'C2', count: 4 },
    ],
  },
  {
    id: 2,
    arena: 'Айсберг',
    address: 'ул. Шевченко, 51',
    dayOffset: 1,
    timeRange: '21:30–22:30',
    price: '750 ₽',
    level: 'C3–C4',
    ageBands: ['40+'],
    filled: 18,
    total: 20,
    goalies: '2/2',
    status: 'Почти подтверждено',
    urgent: false,
    organizerId: 'org-1',
    rosterMix: [
      { age: '40+', skill: 'C2', count: 8 },
      { age: '40+', skill: 'C3', count: 6 },
      { age: '18+', skill: 'C3', count: 4 },
    ],
  },
  {
    id: 3,
    arena: 'Олимпийский · тренировочная арена',
    address: 'ул. Зубковой, 12 к.2',
    dayOffset: 3,
    timeRange: '08:00–09:00',
    price: '650 ₽',
    level: 'C1–C2',
    ageBands: ['18+', '40+'],
    filled: 12,
    total: 20,
    goalies: '0/2',
    status: 'Нужны игроки и вратарь',
    urgent: true,
    organizerId: 'org-2',
    rosterMix: [
      { age: '18+', skill: 'C1', count: 4 },
      { age: '18+', skill: 'C2', count: 3 },
      { age: '40+', skill: 'C1', count: 3 },
      { age: '40+', skill: 'C2', count: 2 },
    ],
  },
  {
    id: 4,
    arena: 'Олимпийский',
    address: 'ул. Зубковой, 12 к.2',
    dayOffset: 2,
    timeRange: '20:00–21:00',
    price: '720 ₽',
    level: 'C2–C4',
    ageBands: ['18+', '40+'],
    filled: 14,
    total: 20,
    goalies: '1/2',
    status: 'Идет набор',
    urgent: false,
    organizerId: 'org-2',
    rosterMix: [
      { age: '18+', skill: 'C2', count: 5 },
      { age: '18+', skill: 'C3', count: 4 },
      { age: '40+', skill: 'C2', count: 3 },
      { age: '40+', skill: 'C4', count: 2 },
    ],
  },
];

const trainings = [
  {
    id: 101,
    coach: 'Александр Морозов',
    coachId: 'coach-1',
    arena: 'Олимпийский · тренировочная арена',
    address: 'ул. Зубковой, 12 к.2',
    dayOffset: 0,
    timeRange: '21:15–22:15',
    price: '1 200 ₽',
    format: 'Мини-группа',
    goal: 'Подкатка: ребра, старт, баланс',
    level: 'C1–C3',
    filled: 6,
    total: 8,
    status: 'Осталось 2 места',
    iceLogic: 'Лед арендует тренер, цена собрана из льда + работы тренера',
  },
  {
    id: 102,
    coach: 'Илья Киселев',
    coachId: 'coach-2',
    arena: 'Десант',
    address: 'ул. Солнечная, 1г',
    dayOffset: 1,
    timeRange: '07:00–08:00',
    price: '1 500 ₽',
    format: 'Подкатка 18+',
    goal: 'Техника шага, торможение, ускорение',
    level: 'C0–C2',
    filled: 5,
    total: 6,
    status: 'Почти заполнено',
    iceLogic: 'Тренер выкупил ранний лед и открыл запись в приложение',
  },
  {
    id: 103,
    coach: 'Дмитрий Панов',
    coachId: 'coach-3',
    arena: 'Планета спорта · Сасово',
    address: 'г. Сасово',
    dayOffset: 3,
    timeRange: '10:00–11:00',
    price: '1 700 ₽',
    format: 'Выездная группа',
    goal: 'Подкатка для любителей и защитников',
    level: 'C1–C4',
    filled: 7,
    total: 10,
    status: 'Идет набор',
    iceLogic: 'Тренер бронирует лед под группу и добирает людей по записи',
  },
  {
    id: 104,
    coach: 'Александр Морозов',
    coachId: 'coach-1',
    arena: 'Олимпийский · тренировочная арена',
    address: 'ул. Зубковой, 12 к.2',
    dayOffset: 2,
    timeRange: '06:30–07:30',
    price: '1 100 ₽',
    format: 'Подкатка 18+',
    goal: 'Шаг, виражи, контроль корпуса',
    level: 'C0–C2',
    filled: 4,
    total: 8,
    status: 'Идет набор',
    iceLogic: 'Тренер арендует лед на раннее окно и добирает группу через приложение',
  },
];

const arenas = [
  {
    id: 'ol-main',
    name: 'Олимпийский',
    sub: 'Основная арена',
    address: 'ул. Зубковой, 12 к.2',
    tags: ['Игра', 'Аренда льда', 'Большая арена'],
    note: 'Под матчи, сборы, корпоративный лед и большие игровые слоты.',
    cta: 'Открыть игровые слоты',
  },
  {
    id: 'ol-train',
    name: 'Олимпийский',
    sub: 'Тренировочная арена',
    address: 'ул. Зубковой, 12 к.2',
    tags: ['Под тренера', 'Подкатки 18+', 'Мини-группы'],
    note: 'Удобна под взрослые тренировки, подкатки и набор небольших групп.',
    cta: 'Посмотреть окна под тренера',
  },
  {
    id: 'desant',
    name: 'Десант',
    sub: 'Ледовый дворец',
    address: 'ул. Солнечная, 1г',
    tags: ['Игра', 'Тренировка', 'Ранние слоты'],
    note: 'Под любительские игры и подкатки тренеров в утренние и поздние часы.',
    cta: 'Смотреть слоты',
  },
  {
    id: 'iceberg',
    name: 'Айсберг',
    sub: 'Ледовая арена',
    address: 'ул. Шевченко, 51',
    tags: ['Любительские команды', 'Взрослые группы'],
    note: 'Под игры команд и групповые тренировки взрослых любителей.',
    cta: 'Открыть арену',
  },
  {
    id: 'sasovo',
    name: 'Планета спорта',
    sub: 'Ледовая арена · Сасово',
    address: 'г. Сасово',
    tags: ['Выездной лед', 'Сборы', 'Под тренера'],
    note: 'Под выездные тренировки, сборы и отдельные тренировочные группы.',
    cta: 'Смотреть выездные занятия',
  },
];

const coachWindows = [
  {
    id: 'w1',
    arena: 'Олимпийский · тренировочная арена',
    dayOffset: 2,
    timeRange: '06:30–07:30',
    type: 'Подкатка 18+ / мини-группа',
    estimate: 'Лед + тренер = от 8 мест',
  },
  {
    id: 'w2',
    arena: 'Десант',
    dayOffset: 1,
    timeRange: '07:00–08:00',
    type: 'Индивидуально / 2–4 человека',
    estimate: 'Ранний лед под технику',
  },
  {
    id: 'w3',
    arena: 'Планета спорта · Сасово',
    dayOffset: 3,
    timeRange: '10:00–11:00',
    type: 'Выездная группа / тренировочный день',
    estimate: 'Лед под группу и тренера',
  },
];

const organizerProfiles = [
  {
    id: 'org-1',
    name: 'Алексей Смирнов',
    verified: true,
    priority: 'Высокий',
    rating: 4.9,
    completed: 38,
    noShowRate: '3%',
  },
  {
    id: 'org-2',
    name: 'Игорь Панов',
    verified: true,
    priority: 'Стандарт',
    rating: 4.7,
    completed: 21,
    noShowRate: '5%',
  },
];

const coachProfiles = [
  {
    id: 'coach-1',
    name: 'Александр Морозов',
    verified: true,
    priority: 'Высокий',
    rating: 4.9,
    completed: 46,
    specialization: 'Подкатка 18+, техника катания',
  },
  {
    id: 'coach-2',
    name: 'Илья Киселев',
    verified: true,
    priority: 'Стандарт',
    rating: 4.8,
    completed: 28,
    specialization: 'Старт, торможение, шаг',
  },
  {
    id: 'coach-3',
    name: 'Дмитрий Панов',
    verified: false,
    priority: 'На проверке',
    rating: 4.6,
    completed: 12,
    specialization: 'Выездные группы и любительская подкатка',
  },
];

const skillScale = [
  { code: 'C0', title: 'Новичок', desc: 'Первый лед, базовая устойчивость, простое катание.' },
  { code: 'C1', title: 'База', desc: 'Есть старт, торможение и базовые повороты.' },
  { code: 'C2', title: 'Любитель', desc: 'Уверенно катается и играет в любительском темпе.' },
  { code: 'C3', title: 'Сильный любитель', desc: 'Хороший темп, понимание игры, стабильная техника.' },
  { code: 'C4', title: 'Продвинутый / спортшкольник', desc: 'Высокий темп, интенсивная игра, сильная техника. Часто это уровень спортшкольника.' },
];

const ageGroups = [
  { key: '18+', title: '18+', desc: 'Общая взрослая группа' },
  { key: '40+', title: '40+', desc: 'Отдельный более комфортный темп' },
];

const formatDayLabel = (offset) => {
  if (offset === 0) return 'Сегодня';
  if (offset === 1) return 'Завтра';
  return `Через ${offset} дня`;
};

const formatSlotMeta = (dayOffset, timeRange) => `${formatDayLabel(dayOffset)} · ${timeRange}`;

const getAgeTone = (age) => {
  if (age === '40+') return 'border-amber-200 bg-amber-50 text-amber-700';
  return 'border-emerald-200 bg-emerald-50 text-emerald-700';
};

const getSkillTone = (skill) => {
  const tones = {
    C0: 'border-emerald-700 bg-emerald-700 text-white',
    C1: 'border-emerald-400 bg-emerald-100 text-emerald-900',
    C2: 'border-lime-300 bg-lime-100 text-lime-900',
    C3: 'border-orange-300 bg-orange-100 text-orange-900',
    C4: 'border-red-300 bg-red-100 text-red-900',
  };
  return tones[skill] || 'border-slate-200 bg-slate-50 text-slate-700';
};

const getCombinedBarTone = (age, skill) => {
  const map = {
    '18+-C0': 'bg-emerald-700 text-white',
    '18+-C1': 'bg-emerald-500 text-white',
    '18+-C2': 'bg-lime-500 text-slate-950',
    '18+-C3': 'bg-orange-400 text-slate-950',
    '18+-C4': 'bg-red-500 text-white',
    '40+-C0': 'bg-teal-800 text-white',
    '40+-C1': 'bg-teal-600 text-white',
    '40+-C2': 'bg-amber-400 text-slate-950',
    '40+-C3': 'bg-amber-500 text-slate-950',
    '40+-C4': 'bg-rose-500 text-white',
  };
  return map[`${age}-${skill}`] || 'bg-slate-300 text-slate-900';
};

const Screen = ({ title, subtitle, children, actions }) => (
  <div className="min-h-screen bg-slate-50 p-4 pb-28 md:p-8 md:pb-32">
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-3xl font-semibold tracking-tight text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
        </div>
        {actions ? <div className="w-full max-w-md">{actions}</div> : null}
      </div>
      {children}
    </div>
  </div>
);

const Pill = ({ children }) => (
  <div className="rounded-full border bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">{children}</div>
);

const TonePill = ({ children, className = '' }) => (
  <div className={`rounded-full border px-3 py-1 text-xs font-medium shadow-sm ${className}`}>{children}</div>
);

function StackedRosterBar({ rosterMix, filled, total }) {
  const remaining = Math.max(total - filled, 0);

  return (
    <div className="mt-2 overflow-hidden rounded-full border bg-slate-100">
      <div className="flex h-7 w-full">
        {rosterMix.map((item, index) => {
          const width = `${(item.count / total) * 100}%`;
          return (
            <div
              key={`${item.age}-${item.skill}-${index}`}
              className={`flex items-center justify-center px-1 text-[10px] font-semibold whitespace-nowrap ${getCombinedBarTone(item.age, item.skill)}`}
              style={{ width }}
              title={`${item.age} · ${item.skill} · ${item.count} игроков`}
            >
              <span className="truncate">{item.age.replace('+', '')}/{item.skill} · {item.count}</span>
            </div>
          );
        })}
        {remaining > 0 ? <div className="bg-slate-200" style={{ width: `${(remaining / total) * 100}%` }} /> : null}
      </div>
    </div>
  );
}

function DaySection({ title, children }) {
  return (
    <div className="grid gap-3">
      <div className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      {children}
    </div>
  );
}

function groupByDay(items) {
  return items.reduce((acc, item) => {
    const key = item.dayOffset;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function parseTimeRange(timeRange) {
  const [start, end] = timeRange.split('–');
  const toMinutes = (value) => {
    const [hours, minutes] = value.split(':').map(Number);
    return (hours * 60) + minutes;
  };
  return { start: toMinutes(start), end: toMinutes(end) };
}

function findArenaConflicts(gameSlots, trainingSlots) {
  const bookings = [
    ...gameSlots.map((item) => ({
      id: `game-${item.id}`,
      arena: item.arena,
      dayOffset: item.dayOffset,
      timeRange: item.timeRange,
      type: 'Игра',
      owner: item.organizerId,
    })),
    ...trainingSlots.map((item) => ({
      id: `training-${item.id}`,
      arena: item.arena,
      dayOffset: item.dayOffset,
      timeRange: item.timeRange,
      type: 'Подкатка',
      owner: item.coachId,
    })),
  ];

  const conflicts = [];
  for (let i = 0; i < bookings.length; i += 1) {
    for (let j = i + 1; j < bookings.length; j += 1) {
      const a = bookings[i];
      const b = bookings[j];
      if (a.arena !== b.arena || a.dayOffset !== b.dayOffset) continue;
      const first = parseTimeRange(a.timeRange);
      const second = parseTimeRange(b.timeRange);
      const overlap = first.start < second.end && second.start < first.end;
      if (overlap) conflicts.push([a, b]);
    }
  }
  return conflicts;
}

function TopActionGrid({ go }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button className="rounded-2xl" onClick={() => go('find')}>На игру</Button>
      <Button className="rounded-2xl" onClick={() => go('trainingList')}>На подкатку</Button>
      <Button variant="outline" className="rounded-2xl" onClick={() => go('coach')}>Кабинет тренера</Button>
      <Button variant="outline" className="rounded-2xl" onClick={() => go('organizer')}>Кабинет организатора</Button>
    </div>
  );
}

function GameCardPreview({ game, go }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-3xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            {game.arena}
            {game.urgent ? <Badge className="rounded-full">Срочно</Badge> : null}
          </div>
          <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-500">
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {game.address}</span>
            <span className="flex items-center gap-1"><Clock3 className="h-4 w-4" /> {formatSlotMeta(game.dayOffset, game.timeRange)}</span>
          </div>
        </div>
        <Button variant="outline" className="rounded-2xl" onClick={() => go('game')}>Открыть</Button>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <Pill>Уровень {game.level}</Pill>
        <Pill>{game.price} / место</Pill>
        <Pill>Вратари {game.goalies}</Pill>
        {game.ageBands.map((age) => (
          <TonePill key={`${game.id}-${age}`} className={getAgeTone(age)}>Группа {age}</TonePill>
        ))}
      </div>

      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
        <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {game.filled}/{game.total} полевых</span>
        <span>{game.status}</span>
      </div>
      <StackedRosterBar rosterMix={game.rosterMix} filled={game.filled} total={game.total} />

      <div className="mt-3">
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Уже записаны по возрасту и skill</div>
        <div className="flex flex-wrap gap-2">
          {game.rosterMix.map((item) => (
            <TonePill key={`${game.id}-${item.age}-${item.skill}`} className={getAgeTone(item.age)}>
              {item.age} · {item.skill} · {item.count}
            </TonePill>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function TrainingCardPreview({ training, go }) {
  const percent = Math.round((training.filled / training.total) * 100);
  return (
    <div className="rounded-3xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            {training.coach}
            <Badge variant="secondary" className="rounded-full">{training.format}</Badge>
          </div>
          <div className="mt-1 text-sm text-slate-500">{training.arena} · {training.address}</div>
          <div className="mt-1 text-sm text-slate-500">{formatSlotMeta(training.dayOffset, training.timeRange)}</div>
        </div>
        <div className="text-right text-sm">
          <div className="font-semibold text-slate-900">{training.price}</div>
          <div className="text-slate-500">{training.level}</div>
        </div>
      </div>
      <div className="mt-3 text-sm text-slate-700">{training.goal}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Pill>{training.filled}/{training.total} мест</Pill>
        <Pill>{training.status}</Pill>
        <Pill>{training.iceLogic}</Pill>
      </div>
      <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
        <span>Группа набрана на {percent}%</span>
        <span>{training.status}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full bg-slate-900" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-4 flex gap-2">
        <Button className="rounded-2xl" onClick={() => go('training')}>Записаться</Button>
        <Button variant="outline" className="rounded-2xl" onClick={() => go('coach')}>Профиль тренера</Button>
      </div>
    </div>
  );
}

function Home({ go, gamesWindow, trainingsWindow }) {
  const gamesByDay = groupByDay(gamesWindow);
  const trainingsByDay = groupByDay(trainingsWindow);

  return (
    <Screen
      title="НаХоккей/Рязань"
      subtitle="Игры и подкатки на сегодня и ближайшие три дня"
      actions={<TopActionGrid go={go} />}
    >
      <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><Goal className="h-5 w-5" /> Игры на 4 дня</CardTitle>
            <CardDescription>При нажатии «На игру» пользователь видит только сегодня и ближайшие три дня</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            {Object.keys(gamesByDay).sort((a, b) => Number(a) - Number(b)).map((day) => (
              <DaySection key={`home-game-${day}`} title={formatDayLabel(Number(day))}>
                {gamesByDay[day].map((game) => <GameCardPreview key={game.id} game={game} go={go} />)}
              </DaySection>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><GraduationCap className="h-5 w-5" /> Подкатки на 4 дня</CardTitle>
              <CardDescription>При нажатии «На подкатку» показываются подкатки на сегодня и ближайшие три дня</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5">
              {Object.keys(trainingsByDay).sort((a, b) => Number(a) - Number(b)).map((day) => (
                <DaySection key={`home-training-${day}`} title={formatDayLabel(Number(day))}>
                  {trainingsByDay[day].map((training) => <TrainingCardPreview key={training.id} training={training} go={go} />)}
                </DaySection>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><Building2 className="h-5 w-5" /> Лед под тренера</CardTitle>
              <CardDescription>Свободные окна льда на ближайшие дни</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-slate-700">
              {coachWindows.map((window) => (
                <div key={window.id} className="rounded-2xl border bg-white p-3">
                  <div className="font-medium text-slate-900">{window.arena}</div>
                  <div className="mt-1 text-slate-500">{formatSlotMeta(window.dayOffset, window.timeRange)}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Pill>{window.type}</Pill>
                    <Pill>{window.estimate}</Pill>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}

function FindGame({ go, gamesWindow }) {
  const gamesByDay = groupByDay(gamesWindow);

  return (
    <Screen
      title="На игру"
      subtitle="Игры только на текущий день и ближайшие три дня"
      actions={<TopActionGrid go={go} />}
    >
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Фильтры игр</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl border bg-white p-3">Период: сегодня + 3 дня</div>
            <div className="rounded-2xl border bg-white p-3">Формат: любительская игра</div>
            <div className="rounded-2xl border bg-white p-3">Возрастная группа: 18+ / 40+</div>
            <div className="rounded-2xl border bg-white p-3">Радиус: до 8 км</div>
            <div className="rounded-2xl border bg-white p-3">Уровень: C2–C3</div>
            <div className="rounded-2xl border bg-white p-3">Роль: полевой / вратарь</div>
            <div className="rounded-2xl border bg-white p-3">Бюджет: до 800 ₽</div>
            <Button className="rounded-2xl">Применить</Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Игры по дням</CardTitle>
            <CardDescription>В выдаче остаются только сегодня и ближайшие три дня</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            {Object.keys(gamesByDay).sort((a, b) => Number(a) - Number(b)).map((day) => (
              <DaySection key={`find-game-${day}`} title={formatDayLabel(Number(day))}>
                {gamesByDay[day].map((game) => <GameCardPreview key={game.id} game={game} go={go} />)}
              </DaySection>
            ))}
          </CardContent>
        </Card>
      </div>
    </Screen>
  );
}

function TrainingList({ go, trainingsWindow }) {
  const trainingsByDay = groupByDay(trainingsWindow);

  return (
    <Screen
      title="На подкатку"
      subtitle="Подкатки и ледовые тренировки только на текущий день и ближайшие три дня"
      actions={<TopActionGrid go={go} />}
    >
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Фильтры тренировок</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl border bg-white p-3">Период: сегодня + 3 дня</div>
            <div className="rounded-2xl border bg-white p-3">Формат: подкатка / мини-группа / группа</div>
            <div className="rounded-2xl border bg-white p-3">Уровень: C0–C3</div>
            <div className="rounded-2xl border bg-white p-3">Цель: техника катания</div>
            <div className="rounded-2xl border bg-white p-3">Бюджет: до 1 700 ₽</div>
            <div className="rounded-2xl border bg-white p-3">Арены: Рязань + Сасово</div>
            <Button className="rounded-2xl">Показать занятия</Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Подкатки по дням</CardTitle>
            <CardDescription>Только ближайшее окно времени: сегодня и следующие три дня</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            {Object.keys(trainingsByDay).sort((a, b) => Number(a) - Number(b)).map((day) => (
              <DaySection key={`find-training-${day}`} title={formatDayLabel(Number(day))}>
                {trainingsByDay[day].map((training) => <TrainingCardPreview key={training.id} training={training} go={go} />)}
              </DaySection>
            ))}
          </CardContent>
        </Card>
      </div>
    </Screen>
  );
}

function GameCard({ go }) {
  const game = games[0];
  const organizer = organizerProfiles.find((item) => item.id === game.organizerId);

  return (
    <Screen
      title="Карточка игры"
      subtitle="Экран, где пользователь видит слот, возраст / skill состава и данные организатора"
      actions={<TopActionGrid go={go} />}
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">{formatSlotMeta(game.dayOffset, game.timeRange)} · {game.arena}</CardTitle>
            <CardDescription>Любительский хоккей · уровень {game.level} · добираем 4 игроков</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-slate-700">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border bg-white p-4"><MapPin className="mb-2 h-4 w-4" /> {game.address}</div>
              <div className="rounded-2xl border bg-white p-4"><Wallet className="mb-2 h-4 w-4" /> {game.price} за место</div>
              <div className="rounded-2xl border bg-white p-4"><Users className="mb-2 h-4 w-4" /> {game.filled}/{game.total} полевых</div>
              <div className="rounded-2xl border bg-white p-4"><ShieldCheck className="mb-2 h-4 w-4" /> Депозит удерживается после поздней отмены</div>
            </div>

            <div className="rounded-3xl border bg-white p-4">
              <div className="mb-3 text-base font-semibold text-slate-900">Возрастная группа и skill</div>
              <div className="mb-3 flex flex-wrap gap-2">
                {game.ageBands.map((age) => (
                  <TonePill key={`card-age-${age}`} className={getAgeTone(age)}>Группа {age}</TonePill>
                ))}
                <TonePill className={getSkillTone('C2')}>Основной skill: {game.level}</TonePill>
              </div>
              <StackedRosterBar rosterMix={game.rosterMix} filled={game.filled} total={game.total} />
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {game.rosterMix.map((item) => (
                  <div key={`card-mix-${item.age}-${item.skill}`} className="rounded-2xl bg-slate-50 p-3 flex items-center justify-between">
                    <span>{item.age} · {item.skill}</span>
                    <TonePill className={getAgeTone(item.age)}>{item.count} чел.</TonePill>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-4">
              <div className="mb-3 text-base font-semibold text-slate-900">Организатор</div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3">{organizer?.name}</div>
                <div className="rounded-2xl bg-slate-50 p-3">Рейтинг: {organizer?.rating}</div>
                <div className="rounded-2xl bg-slate-50 p-3">Приоритет: {organizer?.priority}</div>
                <div className="rounded-2xl bg-slate-50 p-3">Проведено игр: {organizer?.completed}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Действия</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button className="rounded-2xl" onClick={() => go('payment')}>Оплатить и занять место</Button>
              <Button variant="outline" className="rounded-2xl">Встать в waitlist</Button>
              <Button variant="outline" className="rounded-2xl">Нужен вратарь — позвать</Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Чат события</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-3">Организатор: сбор за 30 минут до льда.</div>
              <div className="rounded-2xl bg-slate-50 p-3">Система: если игрок не оплачивает бронь, место уходит в waitlist.</div>
              <div className="rounded-2xl bg-slate-50 p-3">Система: состав показывается по возрасту и skill прямо в полоске.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}

function TrainingCard({ go }) {
  const training = trainings[0];
  const coach = coachProfiles.find((item) => item.id === training.coachId);

  return (
    <Screen
      title="Карточка тренировки / подкатки"
      subtitle="Здесь видна логика: тренер арендует лед, открывает запись и собирает группу"
      actions={<TopActionGrid go={go} />}
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">{training.coach} · {training.arena}</CardTitle>
            <CardDescription>{training.format} · {formatSlotMeta(training.dayOffset, training.timeRange)} · уровень {training.level}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-slate-700">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border bg-white p-4"><GraduationCap className="mb-2 h-4 w-4" /> {training.goal}</div>
              <div className="rounded-2xl border bg-white p-4"><Clock3 className="mb-2 h-4 w-4" /> {formatSlotMeta(training.dayOffset, training.timeRange)}</div>
              <div className="rounded-2xl border bg-white p-4"><Users className="mb-2 h-4 w-4" /> {training.filled}/{training.total} мест занято</div>
              <div className="rounded-2xl border bg-white p-4"><Wallet className="mb-2 h-4 w-4" /> {training.price} за участие</div>
            </div>

            <div className="rounded-3xl border bg-white p-4">
              <div className="mb-3 text-base font-semibold text-slate-900">Тренер и регистрация</div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3">{coach?.name}</div>
                <div className="rounded-2xl bg-slate-50 p-3">Рейтинг: {coach?.rating}</div>
                <div className="rounded-2xl bg-slate-50 p-3">Приоритет: {coach?.priority}</div>
                <div className="rounded-2xl bg-slate-50 p-3">Проведено занятий: {coach?.completed}</div>
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-4">
              <div className="mb-3 text-base font-semibold text-slate-900">Логика цены и аренды льда</div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3">Лед: тренер выкупает тренировочное окно</div>
                <div className="rounded-2xl bg-slate-50 p-3">Формат: мини-группа 8 человек</div>
                <div className="rounded-2xl bg-slate-50 p-3">Цена = аренда льда + работа тренера + сервис</div>
                <div className="rounded-2xl bg-slate-50 p-3">Запись закрывается после оплаты</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Действия</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button className="rounded-2xl" onClick={() => go('payment')}>Записаться и оплатить</Button>
              <Button variant="outline" className="rounded-2xl" onClick={() => go('coach')}>Профиль тренера</Button>
              <Button variant="outline" className="rounded-2xl">Задать вопрос по занятию</Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Что получит пользователь</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-3">Понятную цель занятия</div>
              <div className="rounded-2xl bg-slate-50 p-3">Группу нужного уровня</div>
              <div className="rounded-2xl bg-slate-50 p-3">Прозрачную оплату без чатов</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}

function CreateSlot({ go, conflicts }) {
  return (
    <Screen
      title="Создать слот или тренировку"
      subtitle="Регистрация организаторов и тренеров, приоритеты и антидубль льда заложены в логику MVP"
      actions={<TopActionGrid go={go} />}
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><Goal className="h-5 w-5" /> Регистрация организатора игр</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl border bg-white p-3">ФИО и телефон</div>
            <div className="rounded-2xl border bg-white p-3">Подтвержденный профиль и история проведенных игр</div>
            <div className="rounded-2xl border bg-white p-3">Рейтинг по явке, оплате и отсутствию срывов</div>
            <div className="rounded-2xl border bg-white p-3">Приоритет в публикации зависит от рейтинга и количества успешно проведенных слотов</div>
            <div className="rounded-2xl border bg-white p-3">Низкий no-show и стабильная оплата повышают приоритет</div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><GraduationCap className="h-5 w-5" /> Регистрация тренера</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl border bg-white p-3">ФИО, телефон, специализация и рабочие арены</div>
            <div className="rounded-2xl border bg-white p-3">Статус верификации тренера</div>
            <div className="rounded-2xl border bg-white p-3">Рейтинг по отзывам, повторным записям и посещаемости</div>
            <div className="rounded-2xl border bg-white p-3">Приоритет тренера влияет на видимость подкаток в выдаче</div>
            <div className="rounded-2xl border bg-white p-3">Тренер с подтвержденным профилем получает более высокий приоритет</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><TimerReset className="h-5 w-5" /> Антидубль бронирования льда</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-slate-50 p-3">Перед публикацией система проверяет арену, день и пересечение времени.</div>
            <div className="rounded-2xl bg-slate-50 p-3">Если на той же арене уже есть игра или тренировка с пересечением по времени, новый слот не публикуется.</div>
            <div className="rounded-2xl bg-slate-50 p-3">Публикация доступна только при статусе «свободно».</div>
            <div className={`rounded-2xl p-3 ${conflicts.length === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {conflicts.length === 0 ? 'Активных конфликтов по льду в демо-данных не найдено.' : `Найдено конфликтов: ${conflicts.length}`}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><ShieldCheck className="h-5 w-5" /> Приоритеты и рейтинг</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-slate-50 p-3">Высокий приоритет получают подтвержденные организаторы и тренеры с лучшим рейтингом.</div>
            <div className="rounded-2xl bg-slate-50 p-3">Приоритет влияет на видимость слотов в верхней части выдачи.</div>
            <div className="rounded-2xl bg-slate-50 p-3">Рейтинг пересчитывается после каждой игры и подкатки.</div>
            <div className="rounded-2xl bg-slate-50 p-3">Срывы, двойные попытки бронирования и частые отмены снижают приоритет.</div>
          </CardContent>
        </Card>
      </div>
    </Screen>
  );
}

function Organizer({ go }) {
  const organizer = organizerProfiles[0];

  return (
    <Screen
      title="Кабинет организатора"
      subtitle="У организатора есть регистрационные данные, рейтинг, приоритет и защита от двойного льда"
      actions={<TopActionGrid go={go} />}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Профиль организатора</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border bg-white p-4 flex items-center gap-2"><BadgeCheck className="h-4 w-4" /> {organizer.name}</div>
              <div className="rounded-2xl border bg-white p-4 flex items-center gap-2"><Star className="h-4 w-4" /> Рейтинг {organizer.rating}</div>
              <div className="rounded-2xl border bg-white p-4">Приоритет: {organizer.priority}</div>
              <div className="rounded-2xl border bg-white p-4">Проведено игр: {organizer.completed}</div>
              <div className="rounded-2xl border bg-white p-4 md:col-span-2">No-show команды: {organizer.noShowRate}</div>
            </div>

            <div className="rounded-3xl border bg-white p-4">
              <div className="mb-3 text-base font-semibold text-slate-900">Текущий слот</div>
              <div className="grid gap-2 md:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-3">16/20 полевых</div>
                <div className="rounded-2xl bg-slate-50 p-3">1/2 вратарей</div>
                <div className="rounded-2xl bg-slate-50 p-3">11 040 ₽ собрано</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button className="rounded-2xl">Позвать игроков C2–C3 рядом</Button>
              <Button variant="outline" className="rounded-2xl">Отправить push «нужен вратарь»</Button>
              <Button variant="outline" className="rounded-2xl">Повторить игру на неделю</Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Контроль льда</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-slate-600">
              <div className="rounded-2xl bg-emerald-50 p-3">Слот на арене уникален: дубль времени не найден.</div>
              <div className="rounded-2xl bg-amber-50 p-3">Нужны 4 полевых игрока.</div>
              <div className="rounded-2xl bg-amber-50 p-3">Не хватает 1 вратаря.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}

function CoachCabinet({ go }) {
  const coach = coachProfiles[0];

  return (
    <Screen
      title="Кабинет тренера"
      subtitle="У тренера отображаются регистрационные данные, рейтинг, приоритет и публикация свободных окон льда"
      actions={<TopActionGrid go={go} />}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Профиль тренера</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border bg-white p-4 flex items-center gap-2"><BadgeCheck className="h-4 w-4" /> {coach.name}</div>
              <div className="rounded-2xl border bg-white p-4 flex items-center gap-2"><Star className="h-4 w-4" /> Рейтинг {coach.rating}</div>
              <div className="rounded-2xl border bg-white p-4">Приоритет: {coach.priority}</div>
              <div className="rounded-2xl border bg-white p-4">Проведено занятий: {coach.completed}</div>
              <div className="rounded-2xl border bg-white p-4 md:col-span-2">{coach.specialization}</div>
            </div>

            <div className="rounded-3xl border bg-white p-4">
              <div className="mb-3 text-base font-semibold text-slate-900">Активные тренировки</div>
              <div className="grid gap-2">
                {trainings.filter((item) => item.coachId === coach.id).map((item) => (
                  <div key={item.id} className="rounded-2xl bg-slate-50 p-3 flex items-center justify-between gap-3">
                    <span>{item.arena} · {formatSlotMeta(item.dayOffset, item.timeRange)}</span>
                    <TonePill className="border-slate-200 bg-white text-slate-700">{item.filled}/{item.total}</TonePill>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Действия тренера</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button className="rounded-2xl">Забронировать лед под группу</Button>
              <Button variant="outline" className="rounded-2xl">Открыть запись на подкатку</Button>
              <Button variant="outline" className="rounded-2xl">Повторить тренировку на неделю</Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Риски и контроль</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-slate-600">
              <div className="rounded-2xl bg-emerald-50 p-3">Двойных бронирований по тренировочной арене не найдено.</div>
              <div className="rounded-2xl bg-amber-50 p-3">Не хватает 2 участников до полной группы.</div>
              <div className="rounded-2xl bg-slate-50 p-3">Окна льда публикуются только после проверки занятости арены.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}

function ArenasCatalog({ go }) {
  return (
    <Screen
      title="Арены и аренда льда"
      subtitle="Каталог ледовых точек для игр, тренеров и выездных тренировок"
      actions={<TopActionGrid go={go} />}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {arenas.map((arena) => (
          <Card key={arena.id} className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">{arena.name}</CardTitle>
              <CardDescription>{arena.sub}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-slate-700">
              <div className="flex items-start gap-2 text-slate-500">
                <MapPin className="mt-0.5 h-4 w-4" />
                <span>{arena.address}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {arena.tags.map((tag) => <Pill key={tag}>{tag}</Pill>)}
              </div>
              <div>{arena.note}</div>
              <div className="rounded-2xl bg-slate-50 p-3 text-slate-600">
                {arena.id === 'ol-train' ? 'Подходит под подкатки 18+, мини-группы и рабочие окна тренеров.' : null}
                {arena.id === 'ol-main' ? 'Подходит под большие игровые слоты и набор команд.' : null}
                {arena.id === 'sasovo' ? 'Подходит под выездные дни, сборы и отдельные тренировочные группы.' : null}
                {arena.id === 'desant' ? 'Подходит и под любительские игры, и под тренировочные окна.' : null}
                {arena.id === 'iceberg' ? 'Подходит под взрослые любительские команды и групповые занятия.' : null}
              </div>
              <Button variant="outline" className="rounded-2xl">{arena.cta}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Screen>
  );
}

function Payment({ go }) {
  return (
    <Screen
      title="Оплата записи"
      subtitle="Экран подходит и для игры, и для тренировки: деньги должны собираться без переводов вручную"
      actions={<TopActionGrid go={go} />}
    >
      <div className="mx-auto grid max-w-3xl gap-4">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Подкатка 18+ · Олимпийский · тренировочная арена</CardTitle>
            <CardDescription>Место будет закреплено после оплаты</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl border bg-white p-4 flex items-center justify-between"><span>Аренда льда в доле участника</span><span className="font-semibold">800 ₽</span></div>
            <div className="rounded-2xl border bg-white p-4 flex items-center justify-between"><span>Работа тренера</span><span className="font-semibold">350 ₽</span></div>
            <div className="rounded-2xl border bg-white p-4 flex items-center justify-between"><span>Сервисный сбор</span><span className="font-semibold">50 ₽</span></div>
            <div className="rounded-2xl border bg-white p-4 flex items-center justify-between"><span>Итого</span><span className="text-lg font-semibold">1 200 ₽</span></div>
            <div className="rounded-2xl bg-slate-50 p-4">Система закрепляет место только после оплаты и не позволяет занять то же окно второй раз.</div>
            <div className="flex gap-2">
              <Button className="rounded-2xl flex-1">Оплатить</Button>
              <Button variant="outline" className="rounded-2xl flex-1" onClick={() => go('training')}>Назад к тренировке</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Screen>
  );
}

function Profile({ go }) {
  const [selectedAge, setSelectedAge] = useState('18+');
  const [selectedSkill, setSelectedSkill] = useState('C2');
  const selectedSkillMeta = skillScale.find((item) => item.code === selectedSkill) || skillScale[2];

  return (
    <Screen
      title="Профиль игрока"
      subtitle="Здесь пользователь видит таблицу skill, выбирает свой возрастной сегмент и свой уровень"
      actions={<TopActionGrid go={go} />}
    >
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-4">
          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl"><UserCircle2 className="h-5 w-5" /> Алексей, 34</CardTitle>
              <CardDescription>Правый хват · Полевой игрок</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-slate-700">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Мой возрастной сегмент</div>
                <div className="flex flex-wrap gap-2">
                  {ageGroups.map((group) => {
                    const active = selectedAge === group.key;
                    return (
                      <button
                        key={group.key}
                        type="button"
                        onClick={() => setSelectedAge(group.key)}
                        className={`rounded-2xl border px-4 py-3 text-left transition ${active ? getAgeTone(group.key) : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                      >
                        <div className="font-semibold">{group.title}</div>
                        <div className="mt-1 text-xs opacity-80">{group.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Мой текущий skill</div>
                <div className="flex flex-wrap gap-2">
                  {skillScale.map((item) => {
                    const active = selectedSkill === item.code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setSelectedSkill(item.code)}
                        className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${active ? getSkillTone(item.code) : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                      >
                        {item.code}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 rounded-2xl border bg-white p-3">
                  <div className="font-semibold text-slate-900">{selectedSkillMeta.code} · {selectedSkillMeta.title}</div>
                  <div className="mt-1 text-sm text-slate-600">{selectedSkillMeta.desc}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Таблица градации skill</CardTitle>
              <CardDescription>Игрок должен видеть шкалу и понимать, какой уровень выбрать в профиле</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {skillScale.map((item) => {
                const active = selectedSkill === item.code;
                return (
                  <div
                    key={item.code}
                    className={`rounded-2xl border p-4 transition ${getSkillTone(item.code)} ${active ? 'ring-2 ring-slate-900/10 shadow-sm' : 'opacity-95'}`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold">{item.code} · {item.title}</div>
                      <TonePill className={getSkillTone(item.code)}>{item.code}</TonePill>
                    </div>
                    <div className="mt-2 text-sm opacity-90">{item.desc}</div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Как я отображаюсь в слотах</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-slate-700">
              <div className="rounded-2xl border bg-white p-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Мои цветовые метки</div>
                <div className="flex flex-wrap gap-2">
                  <TonePill className={getAgeTone(selectedAge)}>{selectedAge}</TonePill>
                  <TonePill className={getSkillTone(selectedSkill)}>{selectedSkill}</TonePill>
                </div>
              </div>
              <div className="rounded-2xl border bg-white p-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Пример строки в карточке игры</div>
                <div className="flex flex-wrap gap-2">
                  <TonePill className={getAgeTone(selectedAge)}>{selectedAge} · {selectedSkill} · 1</TonePill>
                  <TonePill className={getAgeTone('18+')}>18+ · C3 · 5</TonePill>
                  <TonePill className={getAgeTone('40+')}>40+ · C2 · 4</TonePill>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Подписки и уведомления</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-slate-700">
              <div className="rounded-2xl border bg-white p-3 flex items-center gap-2"><Bell className="h-4 w-4" /> Будни после 21:00</div>
              <div className="rounded-2xl border bg-white p-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> Радиус 8 км</div>
              <div className="rounded-2xl border bg-white p-3 flex items-center gap-2"><Trophy className="h-4 w-4" /> Игры {selectedAge} · {selectedSkill}</div>
              <div className="rounded-2xl border bg-white p-3 flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Подкатки по вторникам</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}

export default function App() {
  const [screen, setScreen] = useState('home');

  const gamesWindow = useMemo(() => games.filter((item) => item.dayOffset <= 3), []);
  const trainingsWindow = useMemo(() => trainings.filter((item) => item.dayOffset <= 3), []);
  const conflicts = useMemo(() => findArenaConflicts(gamesWindow, trainingsWindow), [gamesWindow, trainingsWindow]);

  const nav = useMemo(() => [
    { key: 'home', label: 'Главная', icon: Goal },
    { key: 'find', label: 'Игры', icon: Users },
    { key: 'trainingList', label: 'Тренировки', icon: Dumbbell },
    { key: 'arenas', label: 'Арены', icon: Building2 },
    { key: 'create', label: 'Создать', icon: Plus },
    { key: 'organizer', label: 'Кабинет', icon: ShieldCheck },
    { key: 'profile', label: 'Профиль', icon: UserCircle2 },
  ], []);

  const go = (next) => setScreen(next);

  let content;
  if (screen === 'home') content = <Home go={go} gamesWindow={gamesWindow} trainingsWindow={trainingsWindow} />;
  if (screen === 'find') content = <FindGame go={go} gamesWindow={gamesWindow} />;
  if (screen === 'trainingList') content = <TrainingList go={go} trainingsWindow={trainingsWindow} />;
  if (screen === 'game') content = <GameCard go={go} />;
  if (screen === 'training') content = <TrainingCard go={go} />;
  if (screen === 'create') content = <CreateSlot go={go} conflicts={conflicts} />;
  if (screen === 'organizer') content = <Organizer go={go} />;
  if (screen === 'coach') content = <CoachCabinet go={go} />;
  if (screen === 'arenas') content = <ArenasCatalog go={go} />;
  if (screen === 'payment') content = <Payment go={go} />;
  if (screen === 'profile') content = <Profile go={go} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-5xl -translate-x-1/2 rounded-3xl border bg-white/95 p-2 shadow-2xl backdrop-blur">
        <div className="grid grid-cols-7 gap-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = screen === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setScreen(item.key)}
                className={`rounded-2xl px-2 py-3 text-[11px] transition ${active ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <div className="mb-1 flex justify-center"><Icon className="h-4 w-4" /></div>
                <div className="truncate">{item.label}</div>
              </button>
            );
          })}
        </div>
      </div>
      {content}
    </div>
  );
}
