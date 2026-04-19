import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock3, Users, Wallet, ShieldCheck, Bell, Goal, ChevronRight, Plus, CalendarDays, Trophy, UserCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const games = [
  {
    id: 1,
    arena: 'Десант',
    address: 'ул. Солнечная, 1г',
    time: 'Среда, 22:15–23:15',
    price: '690 ₽',
    level: 'C2–C3',
    filled: 16,
    total: 20,
    goalies: '1/2',
    status: 'Добираем 4 игрока',
    urgent: true,
  },
  {
    id: 2,
    arena: 'Айсберг',
    address: 'ул. Шевченко, 51',
    time: 'Пятница, 21:30–22:30',
    price: '750 ₽',
    level: 'C3–C4',
    filled: 18,
    total: 20,
    goalies: '2/2',
    status: 'Почти подтверждено',
    urgent: false,
  },
  {
    id: 3,
    arena: 'Олимпийский',
    address: 'ул. Зубковой, 12 к.2',
    time: 'Воскресенье, 08:00–09:00',
    price: '650 ₽',
    level: 'C1–C2',
    filled: 12,
    total: 20,
    goalies: '0/2',
    status: 'Нужны игроки и вратарь',
    urgent: true,
  },
];

const Screen = ({ title, subtitle, children, actions }) => (
  <div className="min-h-screen bg-slate-50 p-4 md:p-8">
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-3xl font-semibold tracking-tight text-slate-900">{title}</div>
          <div className="mt-1 text-sm text-slate-500">{subtitle}</div>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  </div>
);

const Pill = ({ children }) => (
  <div className="rounded-full border bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">{children}</div>
);

function Home({ go }) {
  return (
    <Screen
      title="НаЛёд | Рязань"
      subtitle="Пилот: любительский хоккей, быстрый набор состава и предоплата мест"
      actions={
        <>
          <Button className="rounded-2xl" onClick={() => go('create')}>Создать слот</Button>
          <Button variant="outline" className="rounded-2xl" onClick={() => go('organizer')}>Кабинет организатора</Button>
        </>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><Goal className="h-5 w-5" /> Ближайшие игры</CardTitle>
            <CardDescription>То, что пользователь должен видеть сразу после входа</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {games.map((game) => {
              const percent = Math.round((game.filled / game.total) * 100);
              return (
                <motion.div
                  key={game.id}
                  whileHover={{ y: -2 }}
                  className="rounded-3xl border bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                        {game.arena}
                        {game.urgent ? <Badge className="rounded-full">Срочно</Badge> : null}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {game.address}</span>
                        <span className="flex items-center gap-1"><Clock3 className="h-4 w-4" /> {game.time}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="rounded-2xl" onClick={() => go('game')}>Открыть</Button>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    <Pill>Уровень {game.level}</Pill>
                    <Pill>{game.price} / место</Pill>
                    <Pill>Вратари {game.goalies}</Pill>
                  </div>

                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {game.filled}/{game.total} полевых</span>
                    <span>{game.status}</span>
                  </div>
                  <Progress value={percent} className="h-2" />
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button className="justify-between rounded-2xl" onClick={() => go('find')}>
                Найти игру рядом <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="justify-between rounded-2xl" onClick={() => go('payment')}>
                Посмотреть оплату слота <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="justify-between rounded-2xl" onClick={() => go('profile')}>
                Открыть профиль игрока <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Логика MVP</CardTitle>
              <CardDescription>Главные объекты первой версии</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-slate-600">
              <div>• Слот льда</div>
              <div>• Игра / тренировка</div>
              <div>• Игрок / вратарь / организатор</div>
              <div>• Предоплата места</div>
              <div>• Waitlist и автодобор</div>
              <div>• Рейтинг надежности</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}

function FindGame({ go }) {
  return (
    <Screen
      title="Найти игру"
      subtitle="Экран под пользователя, который хочет быстро занять место"
      actions={<Button variant="outline" className="rounded-2xl" onClick={() => go('home')}>На главный</Button>}
    >
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Фильтры</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl border bg-white p-3">Город: Рязань</div>
            <div className="rounded-2xl border bg-white p-3">Спорт: Хоккей</div>
            <div className="rounded-2xl border bg-white p-3">Радиус: до 8 км</div>
            <div className="rounded-2xl border bg-white p-3">Время: будни после 20:00</div>
            <div className="rounded-2xl border bg-white p-3">Уровень: C2–C3</div>
            <div className="rounded-2xl border bg-white p-3">Роль: полевой / вратарь</div>
            <div className="rounded-2xl border bg-white p-3">Бюджет: до 800 ₽</div>
            <Button className="rounded-2xl">Применить</Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Подходящие слоты</CardTitle>
            <CardDescription>Список того, что система показывает после матчинга</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {games.map((game) => (
              <div key={game.id} className="rounded-3xl border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-slate-900">{game.arena}</div>
                    <div className="mt-1 text-sm text-slate-500">{game.time} · {game.address}</div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-semibold text-slate-900">{game.price}</div>
                    <div className="text-slate-500">{game.level}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
                  <span>{game.filled}/{game.total} полевых</span>
                  <span>Вратари {game.goalies}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button className="rounded-2xl" onClick={() => go('payment')}>Занять место</Button>
                  <Button variant="outline" className="rounded-2xl" onClick={() => go('game')}>Детали</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Screen>
  );
}

function GameCard({ go }) {
  return (
    <Screen
      title="Карточка игры"
      subtitle="Экран, где сходятся люди, деньги, лед и состав"
      actions={<Button variant="outline" className="rounded-2xl" onClick={() => go('home')}>На главный</Button>}
    >
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Среда, 22:15–23:15 · Десант</CardTitle>
            <CardDescription>Любительский хоккей · уровень C2–C3 · добираем 4 игроков</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-slate-700">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border bg-white p-4"><MapPin className="mb-2 h-4 w-4" /> ул. Солнечная, 1г</div>
              <div className="rounded-2xl border bg-white p-4"><Wallet className="mb-2 h-4 w-4" /> 690 ₽ за место</div>
              <div className="rounded-2xl border bg-white p-4"><Users className="mb-2 h-4 w-4" /> 16/20 полевых</div>
              <div className="rounded-2xl border bg-white p-4"><ShieldCheck className="mb-2 h-4 w-4" /> Депозит удерживается после поздней отмены</div>
            </div>

            <div className="rounded-3xl border bg-white p-4">
              <div className="mb-3 text-base font-semibold text-slate-900">Состав</div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3">Полевые: 16 / 20</div>
                <div className="rounded-2xl bg-slate-50 p-3">Вратари: 1 / 2</div>
                <div className="rounded-2xl bg-slate-50 p-3">Светлые джерси</div>
                <div className="rounded-2xl bg-slate-50 p-3">Шайбы: организатор</div>
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-4">
              <div className="mb-3 text-base font-semibold text-slate-900">Правила</div>
              <div>• Место закрепляется после оплаты</div>
              <div>• Отмена без штрафа — не позднее чем за 6 часов</div>
              <div>• При освобождении места срабатывает waitlist</div>
              <div>• При недоборе слот может быть перенесен или отменен</div>
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
              <div className="rounded-2xl bg-slate-50 p-3">Организатор: сбор в 21:45, вход через центральный холл.</div>
              <div className="rounded-2xl bg-slate-50 p-3">Игрок: могу взять 20 шайб и насос.</div>
              <div className="rounded-2xl bg-slate-50 p-3">Система: освободилось 1 место в составе.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}

function CreateGame({ go }) {
  return (
    <Screen
      title="Создать слот"
      subtitle="Экран под организатора: лед, состав, цена и правила"
      actions={<Button variant="outline" className="rounded-2xl" onClick={() => go('home')}>На главный</Button>}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Параметры игры</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
            <div className="rounded-2xl border bg-white p-3">Арена: Десант</div>
            <div className="rounded-2xl border bg-white p-3">Дата: среда</div>
            <div className="rounded-2xl border bg-white p-3">Время: 22:15–23:15</div>
            <div className="rounded-2xl border bg-white p-3">Формат: любительская игра</div>
            <div className="rounded-2xl border bg-white p-3">Полевые: 20</div>
            <div className="rounded-2xl border bg-white p-3">Вратари: 2</div>
            <div className="rounded-2xl border bg-white p-3">Уровень: C2–C3</div>
            <div className="rounded-2xl border bg-white p-3">Стоимость льда: 12 000 ₽</div>
            <div className="rounded-2xl border bg-white p-3">Комиссия сервиса: 1 200 ₽</div>
            <div className="rounded-2xl border bg-white p-3">Цена за место: 690 ₽</div>
            <div className="rounded-2xl border bg-white p-3 md:col-span-2">Правило отмены: без штрафа не позднее 6 часов до начала</div>
            <div className="rounded-2xl border bg-white p-3 md:col-span-2">Инвентарь: шайбы организатор, светлые/темные джерси обязательны</div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Предпросмотр экономики</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-slate-50 p-3">Лед: 12 000 ₽</div>
            <div className="rounded-2xl bg-slate-50 p-3">Комиссия: 1 200 ₽</div>
            <div className="rounded-2xl bg-slate-50 p-3">Итого к сбору: 13 200 ₽</div>
            <div className="rounded-2xl bg-slate-50 p-3">20 игроков = 660 ₽</div>
            <div className="rounded-2xl bg-slate-50 p-3">Округление до 690 ₽ создает резерв на возвраты/no-show</div>
            <Button className="rounded-2xl">Опубликовать слот</Button>
          </CardContent>
        </Card>
      </div>
    </Screen>
  );
}

function Organizer({ go }) {
  return (
    <Screen
      title="Кабинет организатора"
      subtitle="Главный painkiller пилота: кто оплатил, кто выпал, кем добирать"
      actions={<Button variant="outline" className="rounded-2xl" onClick={() => go('home')}>На главный</Button>}
    >
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Среда, 22:15 · Десант</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border bg-white p-4"><Users className="mb-2 h-4 w-4" /> 16/20 полевых</div>
              <div className="rounded-2xl border bg-white p-4"><Goal className="mb-2 h-4 w-4" /> 1/2 вратарей</div>
              <div className="rounded-2xl border bg-white p-4"><Wallet className="mb-2 h-4 w-4" /> 11 040 ₽ собрано</div>
            </div>

            <div className="rounded-3xl border bg-white p-4">
              <div className="mb-3 text-base font-semibold text-slate-900">Участники</div>
              <div className="grid gap-2">
                {[
                  'Иван П. — оплачен — надежность 4.9',
                  'Алексей С. — оплачен — надежность 4.7',
                  'Денис К. — бронь 15 минут — не оплатил',
                  'Никита Р. — waitlist #1',
                ].map((row) => (
                  <div key={row} className="rounded-2xl bg-slate-50 p-3">{row}</div>
                ))}
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
              <Button variant="outline" className="rounded-2xl">Отправить push “нужен вратарь”</Button>
              <Button variant="outline" className="rounded-2xl">Повторить эту игру на следующую неделю</Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Риски слота</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-slate-600">
              <div className="rounded-2xl bg-amber-50 p-3">Нужны 4 полевых игрока</div>
              <div className="rounded-2xl bg-amber-50 p-3">Не хватает 1 вратаря</div>
              <div className="rounded-2xl bg-red-50 p-3">1 участник держит место без оплаты</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}

function Payment({ go }) {
  return (
    <Screen
      title="Оплата места"
      subtitle="Ключевой экран MVP: деньги должны собираться без переписок и переводов вручную"
      actions={<Button variant="outline" className="rounded-2xl" onClick={() => go('home')}>На главный</Button>}
    >
      <div className="mx-auto grid max-w-3xl gap-4">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl">Среда, 22:15 · Десант</CardTitle>
            <CardDescription>Место будет закреплено после оплаты</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl border bg-white p-4 flex items-center justify-between"><span>Базовая стоимость места</span><span className="font-semibold">650 ₽</span></div>
            <div className="rounded-2xl border bg-white p-4 flex items-center justify-between"><span>Сервисный сбор</span><span className="font-semibold">40 ₽</span></div>
            <div className="rounded-2xl border bg-white p-4 flex items-center justify-between"><span>Итого</span><span className="text-lg font-semibold">690 ₽</span></div>
            <div className="rounded-2xl bg-slate-50 p-4">Отмена без удержания — не позднее 6 часов до начала. После этого сервис может удержать часть суммы, если место не было заменено через waitlist.</div>
            <div className="flex gap-2">
              <Button className="rounded-2xl flex-1">Оплатить</Button>
              <Button variant="outline" className="rounded-2xl flex-1" onClick={() => go('game')}>Назад к игре</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Screen>
  );
}

function Profile({ go }) {
  return (
    <Screen
      title="Профиль игрока"
      subtitle="Здесь встречаются skill, надежность и привычка играть каждую неделю"
      actions={<Button variant="outline" className="rounded-2xl" onClick={() => go('home')}>На главный</Button>}
    >
      <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
        <Card className="rounded-3xl border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl"><UserCircle2 className="h-5 w-5" /> Алексей, 34</CardTitle>
            <CardDescription>Правый хват · Полевой игрок</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-slate-700">
            <div className="rounded-2xl bg-slate-50 p-3">Уровень: C2</div>
            <div className="rounded-2xl bg-slate-50 p-3">Надежность: 4.8 / 5</div>
            <div className="rounded-2xl bg-slate-50 p-3">Любимые арены: Десант, Айсберг</div>
            <div className="rounded-2xl bg-slate-50 p-3">Обычно играет: будни после 21:00</div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Подписки и уведомления</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <div className="rounded-2xl border bg-white p-3 flex items-center gap-2"><Bell className="h-4 w-4" /> Будни после 21:00</div>
              <div className="rounded-2xl border bg-white p-3 flex items-center gap-2"><MapPin className="h-4 w-4" /> Радиус 8 км</div>
              <div className="rounded-2xl border bg-white p-3 flex items-center gap-2"><Trophy className="h-4 w-4" /> Уровень C2–C3</div>
              <div className="rounded-2xl border bg-white p-3 flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Повторять напоминание еженедельно</div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Последние игры</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-3">Десант · 09.04 · пришел вовремя · рейтинг +</div>
              <div className="rounded-2xl bg-slate-50 p-3">Айсберг · 04.04 · играл · подтвержденный уровень C2</div>
              <div className="rounded-2xl bg-slate-50 p-3">Олимпийский · 30.03 · отмена заранее без штрафа</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}

export default function App() {
  const [screen, setScreen] = useState('home');

  const nav = useMemo(() => [
    { key: 'home', label: 'Главная', icon: Goal },
    { key: 'find', label: 'Поиск', icon: MapPin },
    { key: 'game', label: 'Игра', icon: Users },
    { key: 'create', label: 'Создать', icon: Plus },
    { key: 'organizer', label: 'Организатор', icon: ShieldCheck },
    { key: 'profile', label: 'Профиль', icon: UserCircle2 },
  ], []);

  const go = (next) => setScreen(next);

  let content;
  if (screen === 'home') content = <Home go={go} />;
  if (screen === 'find') content = <FindGame go={go} />;
  if (screen === 'game') content = <GameCard go={go} />;
  if (screen === 'create') content = <CreateGame go={go} />;
  if (screen === 'organizer') content = <Organizer go={go} />;
  if (screen === 'payment') content = <Payment go={go} />;
  if (screen === 'profile') content = <Profile go={go} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-24px)] max-w-4xl -translate-x-1/2 rounded-3xl border bg-white/95 p-2 shadow-2xl backdrop-blur">
        <div className="grid grid-cols-6 gap-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = screen === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setScreen(item.key)}
                className={`rounded-2xl px-2 py-3 text-xs transition ${active ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'}`}
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
