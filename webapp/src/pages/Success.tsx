import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Success() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      padding: '24px', backgroundColor: 'var(--bg-app)', minHeight: '100dvh'
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} className="animate-fade-in">
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(46, 204, 113, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
          <CheckCircle size={48} color="var(--status-confirmed)" />
        </div>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Готово!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem' }}>
          Вы успешно оплатили место.<br/>Ждем вас на льду!
        </p>

        <div style={{ backgroundColor: 'var(--bg-surface)', padding: '16px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', width: '100%', marginBottom: '32px' }}>
           <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Арена</div>
           <div style={{ fontWeight: 600, marginBottom: '12px' }}>Айсберг (Дашково-Песочня)</div>
           
           <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Время</div>
           <div style={{ fontWeight: 600 }}>Сегодня, 21:15</div>
        </div>

        <Button size="lg" fullWidth onClick={() => navigate('/my-games')}>
          Мои слоты
        </Button>
      </div>
    </div>
  );
}
