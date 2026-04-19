import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/layout/Screen';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function Payment() {
  const navigate = useNavigate();

  return (
    <Screen
      title="Оплата места"
      subtitle="Ключевой экран MVP: деньги должны собираться без переписок и переводов вручную"
      actions={<Button variant="outline" onClick={() => navigate('/home')}>На главный</Button>}
    >
      <div style={{ maxWidth: '768px', margin: '0 auto' }}>
        <Card>
          <CardHeader>
            <CardTitle>Среда, 22:15 · Десант</CardTitle>
            <CardDescription>Место будет закреплено после оплаты</CardDescription>
          </CardHeader>
          <CardContent style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Базовая стоимость места</span>
              <span style={{ fontWeight: 600 }}>650 ₽</span>
            </div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Сервисный сбор</span>
              <span style={{ fontWeight: 600 }}>40 ₽</span>
            </div>
            <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Итого</span>
              <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>690 ₽</span>
            </div>
            <div style={{ borderRadius: '1rem', backgroundColor: 'var(--bg-app)', padding: '16px', color: 'var(--text-secondary)' }}>
              Отмена без удержания — не позднее 6 часов до начала. После этого сервис может удержать часть суммы, если место не было заменено через waitlist.
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <Button fullWidth onClick={() => navigate('/success')}>Оплатить</Button>
              <Button variant="outline" fullWidth onClick={() => navigate(-1)}>Назад к игре</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Screen>
  );
}
