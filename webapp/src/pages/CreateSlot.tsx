import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/layout/Screen';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Goal, GraduationCap, TimerReset, ShieldCheck } from 'lucide-react';
import { games, trainings } from '../data/mockData';
import { findArenaConflicts } from '../lib/utils';

export default function CreateSlot() {
  const navigate = useNavigate();
  
  // Пример окна = 3 день (чтобы найти конфликты или их отсутствие, mockData имеет games на 3ий день)
  const conflicts = useMemo(() => findArenaConflicts(games, trainings), []);

  return (
    <Screen
      title="Создать слот или тренировку"
      subtitle="Регистрация организаторов и тренеров, приоритеты и антидубль льда заложены в логику MVP"
    >
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Goal size={20} /> Регистрация организатора игр</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'grid', gap: '12px', fontSize: '0.875rem', color: 'var(--text-main)' }}>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', padding: '12px' }}>ФИО и телефон</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', padding: '12px' }}>Подтвержденный профиль и история проведенных игр</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', padding: '12px' }}>Рейтинг по явке, оплате и отсутствию срывов</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', padding: '12px' }}>Приоритет в публикации зависит от рейтинга и количества успешно проведенных слотов</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', padding: '12px' }}>Низкий no-show и стабильная оплата повышают приоритет</div>
            <Button onClick={() => navigate('/organizer')} style={{ marginTop: '12px' }}>Перейти в кабинет организатора</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><GraduationCap size={20} /> Регистрация тренера</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'grid', gap: '12px', fontSize: '0.875rem', color: 'var(--text-main)' }}>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', padding: '12px' }}>ФИО, телефон, специализация и рабочие арены</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', padding: '12px' }}>Статус верификации тренера</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', padding: '12px' }}>Рейтинг по отзывам, повторным записям и посещаемости</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', padding: '12px' }}>Приоритет тренера влияет на видимость подкаток в выдаче</div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', padding: '12px' }}>Тренер с подтвержденным профилем получает более высокий приоритет</div>
            <Button onClick={() => navigate('/coach')} style={{ marginTop: '12px' }}>Перейти в кабинет тренера</Button>
          </CardContent>
        </Card>
      </div>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', marginTop: '16px' }}>
        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><TimerReset size={20} /> Антидубль бронирования льда</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'grid', gap: '12px', fontSize: '0.875rem', color: 'var(--text-main)' }}>
            <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>Перед публикацией система проверяет арену, день и пересечение времени.</div>
            <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>Если на той же арене уже есть игра или тренировка с пересечением по времени, новый слот не публикуется.</div>
            <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>Публикация доступна только при статусе «свободно».</div>
            
            <div style={{ 
              borderRadius: '1rem', 
              padding: '16px', 
              backgroundColor: conflicts.length === 0 ? '#ecfdf5' : '#fef2f2', 
              color: conflicts.length === 0 ? '#047857' : '#991b1b',
              fontWeight: 600
            }}>
              {conflicts.length === 0 
                ? 'Активных конфликтов по льду в демо-данных не найдено.' 
                : `Найдено конфликтов: ${conflicts.length} (это условная проверка)`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={20} /> Приоритеты и рейтинг</CardTitle>
          </CardHeader>
          <CardContent style={{ display: 'grid', gap: '12px', fontSize: '0.875rem', color: 'var(--text-main)' }}>
            <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>Высокий приоритет получают подтвержденные организаторы и тренеры с лучшим рейтингом.</div>
            <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>Приоритет влияет на видимость слотов в верхней части выдачи.</div>
            <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>Рейтинг пересчитывается после каждой игры и подкатки.</div>
            <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px' }}>Срывы, двойные попытки бронирования и частые отмены снижают приоритет.</div>
          </CardContent>
        </Card>
      </div>
    </Screen>
  );
}
