import { useNavigate } from 'react-router-dom';
import { MapPin, Wallet, Users, ShieldCheck } from 'lucide-react';
import { Screen } from '../components/layout/Screen';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function GameDetails() {
  const navigate = useNavigate();

  return (
    <Screen
      title="Карточка игры"
      subtitle="Экран, где сходятся люди, деньги, лед и состав"
      actions={<Button variant="outline" onClick={() => navigate('/home')}>На главный</Button>}
    >
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <Card>
          <CardHeader>
            <CardTitle>Среда, 22:15–23:15 · Десант</CardTitle>
            <CardDescription>Любительский хоккей · уровень C2–C3 · добираем 4 игроков</CardDescription>
          </CardHeader>
          <CardContent style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}><MapPin style={{ marginBottom: '8px' }} size={16} /> ул. Солнечная, 1г</div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}><Wallet style={{ marginBottom: '8px' }} size={16} /> 690 ₽ за место</div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}><Users style={{ marginBottom: '8px' }} size={16} /> 16/20 полевых</div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}><ShieldCheck style={{ marginBottom: '8px' }} size={16} /> Депозит удерживается после поздней отмены</div>
            </div>

            <div style={{ borderRadius: '1.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}>
              <div style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Состав</div>
              <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))' }}>
                <div style={{ borderRadius: '1rem', backgroundColor: 'var(--bg-app)', padding: '12px' }}>Полевые: 16 / 20</div>
                <div style={{ borderRadius: '1rem', backgroundColor: 'var(--bg-app)', padding: '12px' }}>Вратари: 1 / 2</div>
                <div style={{ borderRadius: '1rem', backgroundColor: 'var(--bg-app)', padding: '12px' }}>Светлые джерси</div>
                <div style={{ borderRadius: '1rem', backgroundColor: 'var(--bg-app)', padding: '12px' }}>Шайбы: организатор</div>
              </div>
            </div>

            <div style={{ borderRadius: '1.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)', padding: '16px' }}>
              <div style={{ marginBottom: '12px', fontSize: '1rem', fontWeight: 600 }}>Правила</div>
              <div>• Место закрепляется после оплаты</div>
              <div>• Отмена без штрафа — не позднее чем за 6 часов</div>
              <div>• При освобождении места срабатывает waitlist</div>
              <div>• При недоборе слот может быть перенесен или отменен</div>
            </div>
          </CardContent>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Действия</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/payment')} fullWidth>Оплатить и занять место</Button>
              <Button variant="outline" fullWidth>Встать в waitlist</Button>
              <Button variant="outline" fullWidth>Нужен вратарь — позвать</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Чат события</CardTitle>
            </CardHeader>
            <CardContent style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
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
