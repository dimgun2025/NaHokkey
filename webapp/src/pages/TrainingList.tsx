import { Screen } from '../components/layout/Screen';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { trainings } from '../data/mockData';
import { formatDayLabel, groupByDay } from '../lib/utils';
import { TrainingCardPreview } from '../components/ui/TrainingCardPreview';
import { useMemo } from 'react';

export default function TrainingList() {
  const trainingsWindow = useMemo(() => trainings.filter((item) => item.dayOffset <= 3), []);
  const trainingsByDay = groupByDay(trainingsWindow);

  return (
    <Screen
      title="На подкатку"
      subtitle="Подкатки и ледовые тренировки только на текущий день и ближайшие три дня"
    >
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card>
          <CardHeader>
            <CardTitle>Фильтры тренировок</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'grid', gap: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>Период: сегодня + 3 дня</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>Формат: подкатка / мини-группа</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>Уровень: C0–C3</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>Цель: техника катания</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>Бюджет: до 1 700 ₽</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '12px' }}>Арены: Рязань + Сасово</div>
            <Button>Показать занятия</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Подкатки по дням</CardTitle>
            <CardDescription>Только ближайшее окно времени: сегодня и следующие три дня</CardDescription>
          </CardHeader>
          <CardContent style={{ display: 'grid', gap: '20px' }}>
            {Object.keys(trainingsByDay).sort((a, b) => Number(a) - Number(b)).map((dayStr) => {
              const day = Number(dayStr);
              return (
                <div key={`find-training-${day}`} style={{ display: 'grid', gap: '12px' }}>
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
      </div>
    </Screen>
  );
}
