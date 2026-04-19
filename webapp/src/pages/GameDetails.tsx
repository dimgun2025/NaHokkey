import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Wallet, Users, ShieldCheck, Clock3, Goal } from 'lucide-react';
import { Screen } from '../components/layout/Screen';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Pill } from '../components/ui/Pill';
import { TonePill } from '../components/ui/TonePill';
import { StackedRosterBar } from '../components/ui/StackedRosterBar';
import { Badge } from '../components/ui/Badge';
import { games } from '../data/mockData';
import { formatDayLabel, getAgeToneClass } from '../lib/utils';

export default function GameDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const gameId = id ? parseInt(id, 10) : 1;
  const game = games.find((g) => g.id === gameId) || games[0];

  if (!game) {
    return (
      <Screen title="Игра не найдена">
        <Button onClick={() => navigate('/find')}>Назад к списку</Button>
      </Screen>
    );
  }

  return (
    <Screen
      title="Карточка игры"
      subtitle={`${game.arena} · ${formatDayLabel(game.dayOffset)} · ${game.timeRange}`}
      actions={<Button variant="outline" onClick={() => navigate(-1)}>← Назад</Button>}
    >
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Goal size={20} /> {game.arena}
              {game.urgent && <Badge variant="urgent" style={{ borderRadius: '9999px' }}>Срочно</Badge>}
            </CardTitle>
            <CardDescription>{game.address} · уровень {game.level}</CardDescription>
          </CardHeader>
          <CardContent style={{ fontSize: '0.875rem', color: 'var(--text-main)', display: 'grid', gap: '12px' }}>
            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}>
                <MapPin size={16} style={{ marginBottom: '8px' }} />
                <div>{game.address}</div>
              </div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}>
                <Clock3 size={16} style={{ marginBottom: '8px' }} />
                <div>{formatDayLabel(game.dayOffset)}</div>
                <div style={{ fontWeight: 600 }}>{game.timeRange}</div>
              </div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}>
                <Wallet size={16} style={{ marginBottom: '8px' }} />
                <div style={{ fontWeight: 600 }}>{game.price}</div>
                <div style={{ color: 'var(--text-secondary)' }}>за место</div>
              </div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}>
                <Users size={16} style={{ marginBottom: '8px' }} />
                <div><strong>{game.filled}/{game.total}</strong> полевых</div>
                <div style={{ color: 'var(--text-secondary)' }}>Вратари: {game.goalies}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Pill>Уровень {game.level}</Pill>
              {game.ageBands.map((age: string) => (
                <TonePill key={age} className={getAgeToneClass(age)}>Группа {age}</TonePill>
              ))}
              <Pill>{game.status}</Pill>
            </div>

            <StackedRosterBar rosterMix={game.rosterMix} filled={game.filled} total={game.total} />

            <div style={{ borderRadius: '1.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}>
              <div style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Состав</div>
              <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
                <div style={{ borderRadius: '1rem', backgroundColor: 'var(--bg-app)', padding: '12px' }}>Полевые: {game.filled} / {game.total}</div>
                <div style={{ borderRadius: '1rem', backgroundColor: 'var(--bg-app)', padding: '12px' }}>Вратари: {game.goalies}</div>
                <div style={{ borderRadius: '1rem', backgroundColor: 'var(--bg-app)', padding: '12px' }}>Светлые джерси</div>
                <div style={{ borderRadius: '1rem', backgroundColor: 'var(--bg-app)', padding: '12px' }}>Шайбы: организатор</div>
              </div>
            </div>

            <div style={{ borderRadius: '1.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}>
              <div style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Правила</div>
              <div style={{ display: 'grid', gap: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <div>• Место закрепляется после оплаты</div>
                <div>• Отмена без штрафа — не позднее чем за 6 часов</div>
                <div>• При освобождении места срабатывает waitlist</div>
                <div>• При недоборе слот может быть перенесен или отменен</div>
                <ShieldCheck size={14} style={{ marginTop: '8px', color: 'var(--text-secondary)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: '12px' }}>
              <Button onClick={() => navigate('/payment')} fullWidth>Оплатить и занять место</Button>
              <Button variant="outline" fullWidth>Встать в waitlist</Button>
              <Button variant="outline" fullWidth>Нужен вратарь — позвать</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Чат события</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <div style={{ borderRadius: '1rem', backgroundColor: 'var(--bg-app)', padding: '12px' }}>Организатор: сбор в 21:45, вход через центральный холл.</div>
              <div style={{ borderRadius: '1rem', backgroundColor: 'var(--bg-app)', padding: '12px' }}>Игрок: могу взять 20 шайб и насос.</div>
              <div style={{ borderRadius: '1rem', backgroundColor: 'var(--bg-app)', padding: '12px' }}>Система: освободилось 1 место в составе.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}
