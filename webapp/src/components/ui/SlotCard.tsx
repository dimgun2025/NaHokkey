
import { MapPin, Users, Calendar, Shield } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';
import './SlotCard.css';

export interface SlotCardProps {
  type: 'game' | 'training';
  arena: string;
  date: string;
  time: string;
  price: string;
  level: string;
  spotsTotal: number;
  spotsBooked: number;
  goaliesTotal?: number;
  goaliesBooked?: number;
  goaliesNeeded?: boolean;
  coachName?: string;
  trainingGoal?: string;
}

export function SlotCard({
  type,
  arena,
  date,
  time,
  price,
  level,
  spotsTotal,
  spotsBooked,
  goaliesTotal,
  goaliesBooked,
  goaliesNeeded,
  coachName,
  trainingGoal,
  onClick
}: SlotCardProps & { onClick?: () => void }) {
  const isGame = type === 'game';
  const spotsLeft = spotsTotal - spotsBooked;
  const isFull = spotsLeft <= 0;

  return (
    <div className={`slot-card hover-lift ${isGame ? 'slot-card-game' : 'slot-card-training'}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="slot-header">
        <Badge variant={isGame ? 'game' : 'training'}>
          {isGame ? 'Игра' : 'Тренировка'}
        </Badge>
        {goaliesNeeded && <Badge variant="urgent">Нужен вратарь!</Badge>}
      </div>
      
      <div className="slot-title-section">
        {isGame ? (
          <h3 className="slot-title truncate-1">{arena}</h3>
        ) : (
          <h3 className="slot-title truncate-1">{coachName}</h3>
        )}
        <div className="slot-subtitle">
          <Calendar size={14} className="icon-sub" /> {date}, {time}
        </div>
        {!isGame && trainingGoal && (
          <div className="slot-training-goal truncate-1">
            Цель: {trainingGoal}
          </div>
        )}
      </div>

      <div className="slot-details">
        <div className="detail-item">
          <MapPin size={16} />
          <span>{isGame ? 'Арена' : arena}</span>
        </div>
        <div className="detail-item">
          <Users size={16} />
          <span>{spotsBooked}/{spotsTotal} мест</span>
        </div>
        <div className="detail-item">
          <Shield size={16} />
          <span>Уровень: {level}</span>
        </div>
        {isGame && goaliesTotal !== undefined && (
          <div className="detail-item detail-goalie">
            <span className="goalie-indicator" />
            <span>Вратари: {goaliesBooked}/{goaliesTotal}</span>
          </div>
        )}
      </div>

      <div className="slot-footer">
        <div className="slot-price">{price} ₽</div>
        <Button variant={isFull ? 'secondary' : 'primary'} size="sm">
          {isFull ? 'Встать в очередь' : isGame ? 'Занять место' : 'Записаться'}
        </Button>
      </div>
    </div>
  );
}
