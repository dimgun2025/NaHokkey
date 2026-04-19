import { MapPin, Clock3, Users } from 'lucide-react';
import { Badge } from './Badge';
import { Pill } from './Pill';
import { TonePill } from './TonePill';
import { Button } from './Button';
import { StackedRosterBar } from './StackedRosterBar';
import { formatSlotMeta, getAgeToneClass } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export function GameCardPreview({ game }: { game: any }) {
  const navigate = useNavigate();

  return (
    <div style={{
      borderRadius: '1.5rem',
      border: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-surface)',
      padding: '16px',
      boxShadow: 'var(--shadow-sm)',
      transition: 'transform 0.15s, box-shadow 0.15s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {game.arena}
            {game.urgent && <Badge variant="urgent" style={{ borderRadius: '9999px' }}>Срочно</Badge>}
          </div>
          <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={16} /> {game.address}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock3 size={16} /> {formatSlotMeta(game.dayOffset, game.timeRange)}</span>
          </div>
        </div>
        <Button variant="outline" style={{ borderRadius: '1rem' }} onClick={() => navigate(`/game/${game.id}`)}>Открыть</Button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        <Pill>Уровень {game.level}</Pill>
        <Pill>{game.price} / место</Pill>
        <Pill>Вратари {game.goalies}</Pill>
        {game.ageBands.map((age: string) => (
          <TonePill key={`${game.id}-${age}`} className={getAgeToneClass(age)}>Группа {age}</TonePill>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={16} /> {game.filled}/{game.total} полевых</span>
        <span>{game.status}</span>
      </div>
      
      <StackedRosterBar rosterMix={game.rosterMix} filled={game.filled} total={game.total} />

      <div style={{ marginTop: '12px' }}>
        <div style={{ marginBottom: '8px', fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.025em', color: 'var(--text-secondary)' }}>
          Уже записаны по возрасту и skill
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {game.rosterMix.map((item: any) => (
            <TonePill key={`${game.id}-${item.age}-${item.skill}`} className={getAgeToneClass(item.age)}>
              {item.age} · {item.skill} · {item.count}
            </TonePill>
          ))}
        </div>
      </div>
    </div>
  );
}
