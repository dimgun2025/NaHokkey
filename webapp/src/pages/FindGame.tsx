import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/layout/Screen';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { games } from '../data/mockData';
import { formatDayLabel, groupByDay } from '../lib/utils';
import { useMemo } from 'react';
import { GameCardPreview } from '../components/ui/GameCardPreview';

export default function FindGame() {
  const navigate = useNavigate();

  const gamesWindow = useMemo(() => games.filter((item) => item.dayOffset <= 3), []);
  const gamesByDay = groupByDay(gamesWindow);

  return (
    <Screen
      title="На игру"
      subtitle="Игры только на текущий день и ближайшие три дня"
      actions={
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Button style={{ borderRadius: '1rem' }} onClick={() => navigate('/home')}>Назад</Button>
          <Button variant="outline" style={{ borderRadius: '1rem' }} onClick={() => navigate('/trainings')}>На подкатку</Button>
        </div>
      }
    >
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card>
          <CardHeader>
            <CardTitle>Фильтры игр</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'grid', gap: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>Период: сегодня + 3 дня</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>Формат: любительская игра</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>Возрастная группа: 18+ / 40+</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>Радиус: до 8 км</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>Уровень: C2–C3</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>Роль: полевой / вратарь</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>Бюджет: до 800 ₽</div>
            <Button style={{ borderRadius: '1rem' }}>Применить</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Игры по дням</CardTitle>
            <CardDescription>В выдаче остаются только сегодня и ближайшие три дня</CardDescription>
          </CardHeader>
          <CardContent style={{ display: 'grid', gap: '20px' }}>
            {Object.keys(gamesByDay).sort((a, b) => Number(a) - Number(b)).map((dayStr) => {
              const day = Number(dayStr);
              return (
                <div key={`find-game-${dayStr}`} style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em', color: 'var(--text-secondary)' }}>
                    {formatDayLabel(day)}
                  </div>
                  {gamesByDay[day].map((game) => (
                    <GameCardPreview key={game.id} game={game} />
                  ))}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </Screen>
  );
}
