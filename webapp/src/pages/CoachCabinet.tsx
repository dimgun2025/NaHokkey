import { Screen } from '../components/layout/Screen';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TonePill } from '../components/ui/TonePill';
import { coachProfiles, trainings } from '../data/mockData';
import { formatSlotMeta } from '../lib/utils';
import { BadgeCheck, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CoachCabinet() {
  const navigate = useNavigate();
  const coach = coachProfiles[0];

  return (
    <Screen
      title="Кабинет тренера"
      subtitle="У тренера отображаются регистрационные данные, рейтинг, приоритет и публикация свободных окон льда"
    >
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card>
          <CardHeader>
            <CardTitle>Профиль тренера</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'grid', gap: '12px', fontSize: '0.875rem', color: 'var(--text-main)' }}>
            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BadgeCheck size={16} /> {coach.name}
              </div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={16} color="#f59e0b" /> Рейтинг {coach.rating}
              </div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}>Приоритет: {coach.priority}</div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}>Проведено занятий: {coach.completed}</div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px', gridColumn: '1 / -1' }}>{coach.specialization}</div>
            </div>

            <div style={{ borderRadius: '1.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px', marginTop: '12px' }}>
              <div style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Активные тренировки</div>
              <div style={{ display: 'grid', gap: '8px' }}>
                {trainings.filter((item) => item.coachId === coach.id).map((item) => (
                  <div key={item.id} style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <span>{item.arena} · {formatSlotMeta(item.dayOffset, item.timeRange)}</span>
                    <TonePill style={{ backgroundColor: 'white', color: '#334155' }}>{item.filled}/{item.total}</TonePill>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div style={{ display: 'grid', gap: '16px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Действия тренера</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: '12px' }}>
              <Button onClick={() => navigate('/create')}>Забронировать лед под группу</Button>
              <Button variant="outline" onClick={() => navigate('/create')}>Открыть запись на подкатку</Button>
              <Button variant="outline">Повторить тренировку на неделю</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Риски и контроль</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
              <div style={{ borderRadius: '1rem', backgroundColor: '#ecfdf5', padding: '12px', color: '#047857' }}>Двойных бронирований по тренировочной арене не найдено.</div>
              <div style={{ borderRadius: '1rem', backgroundColor: '#fffbeb', padding: '12px', color: '#b45309' }}>Не хватает 2 участников до полной группы.</div>
              <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>Окна льда публикуются только после проверки занятости арены.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}
