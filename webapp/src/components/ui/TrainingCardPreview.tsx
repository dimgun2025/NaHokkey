import { Badge } from './Badge';
import { Pill } from './Pill';
import { Button } from './Button';
import { formatSlotMeta } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export function TrainingCardPreview({ training }: { training: any }) {
  const navigate = useNavigate();
  const percent = Math.round((training.filled / training.total) * 100);

  return (
    <div style={{
      borderRadius: '1.5rem',
      border: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-surface)',
      padding: '16px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {training.coach}
            <Badge style={{ backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '9999px' }}>{training.format}</Badge>
          </div>
          <div style={{ marginTop: '4px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{training.arena} · {training.address}</div>
          <div style={{ marginTop: '4px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{formatSlotMeta(training.dayOffset, training.timeRange)}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.875rem' }}>
          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{training.price}</div>
          <div style={{ color: 'var(--text-secondary)' }}>{training.level}</div>
        </div>
      </div>
      
      <div style={{ marginTop: '12px', fontSize: '0.875rem', color: 'var(--text-main)' }}>{training.goal}</div>
      
      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Pill>{training.filled}/{training.total} мест</Pill>
        <Pill>{training.status}</Pill>
        <Pill>{training.iceLogic}</Pill>
      </div>
      
      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        <span>Группа набрана на {percent}%</span>
        <span>{training.status}</span>
      </div>
      
      <div style={{ marginTop: '8px', height: '8px', overflow: 'hidden', borderRadius: '9999px', backgroundColor: '#f1f5f9' }}>
        <div style={{ height: '100%', backgroundColor: '#0f172a', width: `${percent}%` }} />
      </div>
      
      <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
        <Button style={{ borderRadius: '1rem' }} onClick={() => navigate(`/training/${training.id}`)}>Записаться</Button>
        <Button variant="outline" style={{ borderRadius: '1rem' }} onClick={() => navigate('/coach')}>Профиль тренера</Button>
      </div>
    </div>
  );
}
