import { Screen } from '../components/layout/Screen';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { organizerProfiles } from '../data/mockData';
import { BadgeCheck, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const organizer = organizerProfiles[0];

  return (
    <Screen
      title="Кабинет организатора"
      subtitle="У организатора есть регистрационные данные, рейтинг, приоритет и защита от двойного льда"
    >
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card>
          <CardHeader>
            <CardTitle>Профиль организатора</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'grid', gap: '12px', fontSize: '0.875rem', color: 'var(--text-main)' }}>
            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BadgeCheck size={16} /> {organizer.name}
              </div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={16} color="#f59e0b" /> Рейтинг {organizer.rating}
              </div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}>Приоритет: {organizer.priority}</div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}>Проведено игр: {organizer.completed}</div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px', gridColumn: '1 / -1' }}>No-show команды: {organizer.noShowRate}</div>
            </div>

            <div style={{ borderRadius: '1.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px', marginTop: '12px' }}>
              <div style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Текущий слот</div>
              <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>16/20 полевых</div>
                <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>1/2 вратарей</div>
                <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>11 040 ₽ собрано</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div style={{ display: 'grid', gap: '16px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: '12px' }}>
              <Button onClick={() => navigate('/create')}>Позвать игроков C2–C3 рядом</Button>
              <Button variant="outline">Отправить push «нужен вратарь»</Button>
              <Button variant="outline" onClick={() => navigate('/create')}>Повторить игру на неделю</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Контроль льда</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: '8px', fontSize: '0.875rem', color: '#475569' }}>
              <div style={{ borderRadius: '1rem', backgroundColor: '#ecfdf5', padding: '12px', color: '#047857' }}>Слот на арене уникален: дубль времени не найден.</div>
              <div style={{ borderRadius: '1rem', backgroundColor: '#fffbeb', padding: '12px', color: '#b45309' }}>Нужны 4 полевых игрока.</div>
              <div style={{ borderRadius: '1rem', backgroundColor: '#fffbeb', padding: '12px', color: '#b45309' }}>Не хватает 1 вратаря.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}
