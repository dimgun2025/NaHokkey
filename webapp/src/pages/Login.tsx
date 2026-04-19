import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      padding: '24px', backgroundColor: 'var(--bg-app)', minHeight: '100dvh'
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Вход</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          Введите номер телефона для входа в НаХоккей/Рязань
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Номер телефона
            </label>
            <input
              type="tel"
              placeholder="+7 (999) 000-00-00"
              style={{
                width: '100%', padding: '16px', borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)',
                fontSize: '1rem', color: 'var(--text-main)', outline: 'none'
              }}
            />
          </div>
          
          <Button type="submit" size="lg" fullWidth>
            Получить код
          </Button>
        </form>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        Нажимая кнопку, вы соглашаетесь с условиями сервиса
      </div>
    </div>
  );
}
