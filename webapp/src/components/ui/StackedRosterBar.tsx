import { getCombinedBarToneClass } from '../../lib/utils';
import './StackedRosterBar.css';

interface RosterMixItem {
  age: string;
  skill: string;
  count: number;
}

interface StackedRosterBarProps {
  rosterMix: RosterMixItem[];
  filled: number;
  total: number;
}

export function StackedRosterBar({ rosterMix, filled, total }: StackedRosterBarProps) {
  const remaining = Math.max(total - filled, 0);

  return (
    <div className="stacked-roster-container">
      <div className="stacked-roster-bar">
        {rosterMix.map((item, index) => {
          const width = `${(item.count / total) * 100}%`;
          const toneClass = getCombinedBarToneClass(item.age, item.skill);
          
          return (
            <div
              key={`${item.age}-${item.skill}-${index}`}
              className={`stacked-roster-segment ${toneClass}`}
              style={{ width }}
              title={`${item.age} · ${item.skill} · ${item.count} игроков`}
            >
              <span className="stacked-roster-label">
                {item.age.replace('+', '')}/{item.skill} · {item.count}
              </span>
            </div>
          );
        })}
        {remaining > 0 ? (
          <div className="stacked-roster-remaining" style={{ width: `${(remaining / total) * 100}%` }} />
        ) : null}
      </div>
    </div>
  );
}
