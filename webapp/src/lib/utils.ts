export const formatDayLabel = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  
  const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  
  if (offset === 0) return `Сегодня, ${dateStr}`;
  if (offset === 1) return `Завтра, ${dateStr}`;
  
  // Простая логика окончаний для "дня/дней"
  const suffix = (offset % 10 === 1 && offset % 100 !== 11) ? 'день' : 
                 (offset % 10 >= 2 && offset % 10 <= 4 && (offset % 100 < 10 || offset % 100 >= 20)) ? 'дня' : 'дней';
  
  return `Через ${offset} ${suffix}, ${dateStr}`;
};

export const formatSlotMeta = (dayOffset: number, timeRange: string) => `${formatDayLabel(dayOffset)} · ${timeRange}`;

// В отличие от Tailwind-классов, мы возвращаем имена CSS-переменных или классов,
// которые будут определены в index.css.
export const getAgeToneClass = (age: string) => {
  if (age === '50+') return 'tone-age-50';
  if (age === '40+') return 'tone-age-40';
  return 'tone-age-18';
};

export const getSkillToneClass = (skill: string) => {
  return `tone-skill-${skill.toLowerCase()}`;
};

export const getCombinedBarToneClass = (age: string, skill: string) => {
  return `tone-combined-${age.replace('+', '')}-${skill.toLowerCase()}`;
};

export function calculateAgeGroup(birthDate: string): string {
  if (!birthDate) return '18+';
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  
  if (age >= 50) return '50+';
  if (age >= 40) return '40+';
  return '18+';
}

export function groupByDay<T extends { dayOffset: number }>(items: T[]): Record<number, T[]> {
  return items.reduce((acc, item) => {
    const key = item.dayOffset;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<number, T[]>);
}

function parseTimeRange(timeRange: string) {
  const [start, end] = timeRange.split('–');
  const toMinutes = (value: string) => {
    const [hours, minutes] = value.split(':').map(Number);
    return (hours * 60) + minutes;
  };
  return { start: toMinutes(start), end: toMinutes(end) };
}

export function findArenaConflicts(gameSlots: any[], trainingSlots: any[]) {
  const bookings = [
    ...gameSlots.map((item) => ({
      id: `game-${item.id}`,
      arena: item.arena,
      dayOffset: item.dayOffset,
      timeRange: item.timeRange,
      type: 'Игра',
      owner: item.organizerId,
    })),
    ...trainingSlots.map((item) => ({
      id: `training-${item.id}`,
      arena: item.arena,
      dayOffset: item.dayOffset,
      timeRange: item.timeRange,
      type: 'Подкатка',
      owner: item.coachId,
    })),
  ];

  const conflicts = [];
  for (let i = 0; i < bookings.length; i += 1) {
    for (let j = i + 1; j < bookings.length; j += 1) {
      const a = bookings[i];
      const b = bookings[j];
      if (a.arena !== b.arena || a.dayOffset !== b.dayOffset) continue;
      const first = parseTimeRange(a.timeRange);
      const second = parseTimeRange(b.timeRange);
      const overlap = first.start < second.end && second.start < first.end;
      if (overlap) conflicts.push([a, b]);
    }
  }
  return conflicts;
}
