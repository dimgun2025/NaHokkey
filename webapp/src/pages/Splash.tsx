import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Mock loading delay to show splash screen, then go to login
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      backgroundColor: 'var(--primary-dark)',
      color: 'var(--text-inverse)',
      padding: '24px',
      textAlign: 'center'
    }}>
      <h1 className="animate-fade-in" style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
        НаХоккей<span style={{ color: 'var(--accent-color)' }}>/</span>Рязань
      </h1>
      <p className="animate-fade-in" style={{ opacity: 0.8, animationDelay: '0.2s', fontSize: '1.1rem' }}>
        Любительский хоккей без хаоса
      </p>
    </div>
  );
}
