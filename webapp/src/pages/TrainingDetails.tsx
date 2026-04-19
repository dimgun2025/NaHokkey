import { Screen } from '../components/layout/Screen';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { trainings, coachProfiles } from '../data/mockData';
import { formatSlotMeta } from '../lib/utils';
import { GraduationCap, Clock3, Users, Wallet } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { EventChat } from '../components/ui/EventChat';

export default function TrainingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Ищем тренировку по ID или берем первую по умолчанию
  const trainingId = id ? parseInt(id, 10) : trainings[0].id;
  const training = trainings.find(t => t.id === trainingId) || trainings[0];
  const coach = coachProfiles.find((item) => item.id === training.coachId);

  return (
    <Screen
      title="Карточка тренировки / подкатки"
      subtitle="Здесь видна логика: тренер арендует лед, открывает запись и собирает группу"
    >
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card>
          <CardHeader>
            <CardTitle>{training.coach} · {training.arena}</CardTitle>
            <CardDescription>{training.format} · {formatSlotMeta(training.dayOffset, training.timeRange)} · уровень {training.level}</CardDescription>
          </CardHeader>
          <CardContent style={{ display: 'grid', gap: '16px', fontSize: '0.875rem', color: 'var(--text-main)' }}>
            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}><GraduationCap size={16} style={{ marginBottom: '8px' }} /> <br/>{training.goal}</div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}><Clock3 size={16} style={{ marginBottom: '8px' }} /> <br/>{formatSlotMeta(training.dayOffset, training.timeRange)}</div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}><Users size={16} style={{ marginBottom: '8px' }} /> <br/>{training.filled}/{training.total} мест занято</div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}><Wallet size={16} style={{ marginBottom: '8px' }} /> <br/>{training.price} за участие</div>
            </div>

            <div style={{ borderRadius: '1.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}>
              <div style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Тренер и регистрация</div>
              <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>{coach?.name}</div>
                <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>Рейтинг: {coach?.rating}</div>
                <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>Приоритет: {coach?.priority}</div>
                <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>Проведено занятий: {coach?.completed}</div>
              </div>
            </div>

            <div style={{ borderRadius: '1.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}>
              <div style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Логика цены и аренды льда</div>
              <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px', gridColumn: '1 / -1' }}>Лед: тренер выкупает тренировочное окно</div>
                <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>Формат: мини-группа 8 человек</div>
                <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>Цена = аренда льда + работа тренера + сервис</div>
                <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px', gridColumn: '1 / -1' }}>Запись закрывается после оплаты</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div style={{ display: 'grid', gap: '16px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: '12px' }}>
              <Button onClick={() => navigate('/payment')}>Записаться и оплатить</Button>
              <Button variant="outline" onClick={() => navigate('/coach')}>Профиль тренера</Button>
              <Button variant="outline">Задать вопрос по занятию</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Чат события</CardTitle>
            </CardHeader>
            <CardContent>
              <EventChat eventType="training" eventId={training.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Screen>
  );
}
