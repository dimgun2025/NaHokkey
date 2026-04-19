import { Badge } from './Badge';
import { Pill } from './Pill';
import { Button } from './Button';
import { formatSlotMeta } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';

export function TrainingCardPreview({ training }: { training: any }) {
  const navigate = useNavigate();
  const percent = Math.round((training.filled / training.total) * 100);

  // Цвет прогресс-бара по заполненности
  const barColor = percent >= 80 ? '#ef4444' : percent >= 50 ? '#f59e0b' : '#22c55e';

  return (
    <div
      style={{
        borderRadius: '1.5rem',
        border: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-surface)',
        padding: '16px',
        boxShadow: 'var(--shadow-sm)',
        transition: 'transform 0.15s, box-shadow 0.15s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {training.coach}
            <Badge style={{ backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '9999px' }}>{training.format}</Badge>
          </div>
          <div style={{ marginTop: '4px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{training.arena} · {training.address}</div>
          <div style={{ marginTop: '4px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{formatSlotMeta(training.dayOffset, training.timeRange)}</div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '0.875rem', flexShrink: 0 }}>
          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{training.price}</div>
          <div style={{ color: 'var(--text-secondary)' }}>{training.level}</div>
        </div>
      </div>

      <div style={{ marginTop: '12px', fontSize: '0.875rem', color: 'var(--text-main)' }}>{training.goal}</div>

      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        <Pill>
          <Users size={12} style={{ marginRight: '4px' }} />
          {training.filled}/{training.total} мест
        </Pill>
        <Pill>{training.iceLogic}</Pill>
        {training.status && (
          <Pill style={{ backgroundColor: training.status.includes('Набр') ? '#dcfce7' : '#f1f5f9', color: training.status.includes('Набр') ? '#166534' : '#475569' }}>
            {training.status}
          </Pill>
        )}
      </div>

      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        <span>Группа набрана на {percent}%</span>
      </div>

      <div style={{ marginTop: '8px', height: '8px', overflow: 'hidden', borderRadius: '9999px', backgroundColor: '#f1f5f9' }}>
        <div style={{ height: '100%', backgroundColor: barColor, width: `${percent}%`, transition: 'width 0.3s' }} />
      </div>

      <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
        <Button style={{ borderRadius: '1rem' }} onClick={() => navigate(`/training/${training.id}`)}>Записаться</Button>
        <Button variant="outline" style={{ borderRadius: '1rem' }} onClick={() => navigate('/coach')}>Тренер</Button>
      </div>
    </div>
  );
}
