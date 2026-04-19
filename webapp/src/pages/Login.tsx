import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, KeyRound, ChevronRight, Loader } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cooldown, setCooldown] = useState(0);

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';
    const n = digits.startsWith('8') ? '7' + digits.slice(1) : digits;
    if (n.length <= 1) return '+' + n;
    if (n.length <= 4) return '+' + n.slice(0, 1) + ' (' + n.slice(1);
    if (n.length <= 7) return '+' + n.slice(0, 1) + ' (' + n.slice(1, 4) + ') ' + n.slice(4);
    if (n.length <= 9) return '+' + n.slice(0, 1) + ' (' + n.slice(1, 4) + ') ' + n.slice(4, 7) + '-' + n.slice(7);
    return '+' + n.slice(0, 1) + ' (' + n.slice(1, 4) + ') ' + n.slice(4, 7) + '-' + n.slice(7, 9) + '-' + n.slice(9, 11);
  };

  const handleSendOtp = async () => {
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setError('Введите корректный номер телефона');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep('code');
        // Отсчёт cooldown 60 секунд
        let s = 60;
        setCooldown(s);
        const timer = setInterval(() => {
          s--;
          setCooldown(s);
          if (s <= 0) clearInterval(timer);
        }, 1000);
      } else {
        setError(data.error);
      }
    } catch {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (code.length < 4) { setError('Введите 4-значный код'); return; }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Новый юзер → на профиль для заполнения, существующий → на главную
        navigate(data.is_new ? '/profile' : '/home');
      } else {
        setError(data.error);
      }
    } catch {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: 'var(--bg-app)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Логотип */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'linear-gradient(135deg, var(--accent) 0%, #2563eb 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: '2rem'
          }}>🏒</div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>НаХоккей</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.875rem' }}>Рязань / любительский хоккей</p>
        </div>

        <div style={{
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '1.5rem',
          padding: '28px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
        }}>
          {step === 'phone' ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Phone size={18} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Вход по номеру телефона</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Без пароля — только SMS</div>
                </div>
              </div>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="+7 (___) ___-__-__"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '1rem',
                  border: `1.5px solid ${error ? '#ef4444' : 'var(--border-color)'}`,
                  fontSize: '1.125rem',
                  fontFamily: 'inherit',
                  color: 'var(--text-main)',
                  backgroundColor: 'var(--bg-app)',
                  boxSizing: 'border-box',
                  letterSpacing: '0.05em',
                  outline: 'none',
                }}
                inputMode="tel"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
              />

              {error && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '8px' }}>{error}</div>
              )}

              <button
                onClick={handleSendOtp}
                disabled={loading}
                style={{
                  marginTop: '16px',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '1rem',
                  background: 'linear-gradient(135deg, var(--accent) 0%, #2563eb 100%)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: loading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'opacity 0.15s',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <ChevronRight size={18} />}
                {loading ? 'Отправляю SMS...' : 'Получить код'}
              </button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <KeyRound size={18} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Введите код из SMS</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Отправлен на {phone}</div>
                </div>
              </div>

              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="_ _ _ _"
                inputMode="numeric"
                autoFocus
                style={{
                  width: '100%',
                  padding: '20px',
                  borderRadius: '1rem',
                  border: `1.5px solid ${error ? '#ef4444' : 'var(--border-color)'}`,
                  fontSize: '2rem',
                  fontFamily: 'monospace',
                  color: 'var(--text-main)',
                  backgroundColor: 'var(--bg-app)',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  letterSpacing: '0.5em',
                  outline: 'none',
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
              />

              {error && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '8px' }}>{error}</div>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading || code.length < 4}
                style={{
                  marginTop: '16px',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '1rem',
                  background: 'linear-gradient(135deg, var(--accent) 0%, #2563eb 100%)',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  cursor: (loading || code.length < 4) ? 'not-allowed' : 'pointer',
                  opacity: (loading || code.length < 4) ? 0.6 : 1,
                  transition: 'opacity 0.15s',
                }}
              >
                {loading ? 'Проверяю...' : 'Войти'}
              </button>

              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                {cooldown > 0 ? (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Повторная отправка через {cooldown} сек
                  </span>
                ) : (
                  <button
                    onClick={() => { setStep('phone'); setCode(''); setError(''); }}
                    style={{ fontSize: '0.75rem', color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Изменить номер или отправить снова
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          Нажимая «Получить код», вы соглашаетесь с правилами сервиса
        </div>
      </div>
    </div>
  );
}
