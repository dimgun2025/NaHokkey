import { SlotCard } from '../components/ui/SlotCard';

export default function MyGames() {
  return (
    <div className="page-container animate-fade-in" style={{ padding: '16px', paddingBottom: '100px' }}>
      <header style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Мои слоты</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Ваши предстоящие игры и тренировки</p>
      </header>

      <section style={{ marginBottom: '24px' }}>
        <SlotCard 
          type="game"
          arena="Айсберг (Дашково-Песочня)"
          date="Сегодня"
          time="21:15"
          level="Любитель / D1"
          price="Оплачено"
          spotsTotal={20}
          spotsBooked={20}
        />
        <SlotCard 
          type="training"
          coachName="Тренер: Алексей Смирнов"
          arena="Айсберг"
          date="16 Апр"
          time="08:00"
          level="Новичок"
          price="Оплачено"
          spotsTotal={6}
          spotsBooked={5}
          trainingGoal="Техника катания"
        />
      </section>
      
      <section>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>Прошедшие</h3>
        <div style={{ opacity: 0.6 }}>
          <SlotCard 
            type="game"
            arena="ДС Олимпийский"
            date="10 Апр"
            time="19:30"
            level="Любитель"
            price="Завершено"
            spotsTotal={20}
            spotsBooked={20}
          />
        </div>
      </section>
    </div>
  );
}
