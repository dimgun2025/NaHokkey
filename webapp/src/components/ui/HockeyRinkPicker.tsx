import clsx from 'clsx';
import { User, Shield, Target } from 'lucide-react';

export type HockeyPosition = 'Вратарь' | 'Левый защитник' | 'Правый защитник' | 'Центральный нападающий' | 'Левый нападающий' | 'Правый нападающий';

interface PositionConfig {
  id: HockeyPosition;
  short: string;
  icon: any;
  className: string;
}

const positions: PositionConfig[] = [
  { id: 'Вратарь', short: 'В', icon: Target, className: 'pos-g' },
  { id: 'Левый защитник', short: 'ЛЗ', icon: Shield, className: 'pos-ld' },
  { id: 'Правый защитник', short: 'ПЗ', icon: Shield, className: 'pos-rd' },
  { id: 'Левый нападающий', short: 'ЛН', icon: User, className: 'pos-lw' },
  { id: 'Центральный нападающий', short: 'ЦН', icon: User, className: 'pos-c' },
  { id: 'Правый нападающий', short: 'ПН', icon: User, className: 'pos-rw' },
];

interface HockeyRinkPickerProps {
  selectedPositions: string[];
  onToggle: (pos: string) => void;
}

export function HockeyRinkPicker({ selectedPositions, onToggle }: HockeyRinkPickerProps) {
  return (
    <div className="hockey-rink-container animate-fade-in">
      {/* Visual markings representing the diagram */}
      <div className="rink-markings">
        <div className="goal-line" />
        <div className="hockey-rink-crease" />
        <div className="face-off-circle circle-ld"><div className="face-off-dot" /></div>
        <div className="face-off-circle circle-rd"><div className="face-off-dot" /></div>
      </div>
      
      {positions.map((pos) => {
        const Icon = pos.icon;
        const isActive = selectedPositions.includes(pos.id);
        
        return (
          <div
            key={pos.id}
            className={clsx('player-spot', pos.className, isActive && 'selected')}
            onClick={() => onToggle(pos.id)}
            title={pos.id}
          >
            <Icon size={16} />
            <span className="player-spot-label">{pos.short}</span>
          </div>
        );
      })}
    </div>
  );
}
