import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/layout/Screen';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Pill } from '../components/ui/Pill';
import { Goal, GraduationCap, Building2 } from 'lucide-react';
import { games, trainings, coachWindows } from '../data/mockData';
import { formatDayLabel, formatSlotMeta, groupByDay } from '../lib/utils';
import { useMemo } from 'react';
import { GameCardPreview } from '../components/ui/GameCardPreview';
import { TrainingCardPreview } from '../components/ui/TrainingCardPreview';

export default function Home() {
  const navigate = useNavigate();
  // Ограничиваемся 3 днями (0, 1, 2, 3) 
  const gamesWindow = useMemo(() => games.filter((item) => item.dayOffset <= 3), []);
  const trainingsWindow = useMemo(() => trainings.filter((item) => item.dayOffset <= 3), []);
  
  const gamesByDay = groupByDay(gamesWindow);
  const trainingsByDay = groupByDay(trainingsWindow);

  return (
    <Screen
      title="НаХоккей/Рязань"
      subtitle="Игры и подкатки на сегодня и ближайшие три дня"
      actions={
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Button style={{ borderRadius: '1rem' }} onClick={() => navigate('/find')}>На игру</Button>
          <Button style={{ borderRadius: '1rem' }} onClick={() => navigate('/trainings')}>На подкатку</Button>
          <Button variant="outline" style={{ borderRadius: '1rem' }} onClick={() => navigate('/coach')}>Кабинет тренера</Button>
          <Button variant="outline" style={{ borderRadius: '1rem' }} onClick={() => navigate('/organizer')}>Кабинет организатора</Button>
        </div>
      }
    >
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Goal size={20} /> Игры на 4 дня</CardTitle>
            <CardDescription>При нажатии «На игру» пользователь видит только сегодня и ближайшие три дня</CardDescription>
          </CardHeader>
          <CardContent style={{ display: 'grid', gap: '20px' }}>
            {Object.keys(gamesByDay).sort((a, b) => Number(a) - Number(b)).map((dayStr) => {
              const day = Number(dayStr);
              return (
                <div key={`home-game-${dayStr}`} style={{ display: 'grid', gap: '12px' }}>
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

        <div style={{ display: 'grid', gap: '16px' }}>
          <Card>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><GraduationCap size={20} /> Подкатки на 4 дня</CardTitle>
              <CardDescription>При нажатии «На подкатку» показываются подкатки на сегодня и ближайшие три дня</CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: '20px' }}>
              {Object.keys(trainingsByDay).sort((a, b) => Number(a) - Number(b)).map((dayStr) => {
                const day = Number(dayStr);
                return (
                  <div key={`home-training-${dayStr}`} style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em', color: 'var(--text-secondary)' }}>
                      {formatDayLabel(day)}
                    </div>
                    {trainingsByDay[day].map((training) => (
                      <TrainingCardPreview key={training.id} training={training} />
                    ))}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Building2 size={20} /> Лед под тренера</CardTitle>
              <CardDescription>Свободные окна льда на ближайшие дни</CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: '8px', fontSize: '0.875rem', color: 'var(--text-main)' }}>
              {coachWindows.map((window) => (
                <div key={window.id} style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>
                  <div style={{ fontWeight: 500 }}>{window.arena}</div>
                  <div style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>{formatSlotMeta(window.dayOffset, window.timeRange)}</div>
                  <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
