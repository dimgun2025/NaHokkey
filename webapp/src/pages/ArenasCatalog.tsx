import { Screen } from '../components/layout/Screen';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Pill } from '../components/ui/Pill';
import { arenas } from '../data/mockData';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ArenasCatalog() {
  const navigate = useNavigate();

  return (
    <Screen
      title="Арены и аренда льда"
      subtitle="Каталог ледовых точек для игр, тренеров и выездных тренировок"
    >
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {arenas.map((arena) => (
          <Card key={arena.id}>
            <CardHeader>
              <CardTitle>{arena.name}</CardTitle>
              <CardDescription>{arena.sub}</CardDescription>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: '12px', fontSize: '0.875rem', color: 'var(--text-main)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-secondary)' }}>
                <MapPin size={16} style={{ marginTop: '2px' }} />
                <span>{arena.address}</span>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {arena.tags.map((tag) => <Pill key={tag}>{tag}</Pill>)}
              </div>
              
              <div>{arena.note}</div>
              
              <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '12px', color: '#475569' }}>
                {arena.id === 'ol-train' ? 'Подходит под подкатки 18+, мини-группы и рабочие окна тренеров.' : null}
                {arena.id === 'ol-main' ? 'Подходит под большие игровые слоты и набор команд.' : null}
                {arena.id === 'sasovo' ? 'Подходит под выездные дни, сборы и отдельные тренировочные группы.' : null}
                {arena.id === 'desant' ? 'Подходит и под любительские игры, и под тренировочные окна.' : null}
                {arena.id === 'iceberg' ? 'Подходит под взрослые любительские команды и групповые занятия.' : null}
              </div>
              
              <Button variant="outline" onClick={() => navigate('/home')}>{arena.cta}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </Screen>
  );
}
