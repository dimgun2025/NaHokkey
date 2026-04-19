import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen } from '../components/layout/Screen';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TonePill } from '../components/ui/TonePill';
import { Bell, Trophy, Calendar, Camera, User2 } from 'lucide-react';
import { skillScale } from '../data/mockData';
import { getAgeToneClass, getSkillToneClass, calculateAgeGroup } from '../lib/utils';
import { HockeyRinkPicker } from '../components/ui/HockeyRinkPicker';
import clsx from 'clsx';

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State from User Request
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState('1992-05-15');
  const [positions, setPositions] = useState<string[]>(['Центральный нападающий']);
  const [grip, setGrip] = useState<'Левый' | 'Правый'>('Правый');
  const [selectedSkill, setSelectedSkill] = useState('C2');
  const [selectedAge, setSelectedAge] = useState('18+');

  useEffect(() => {
    setSelectedAge(calculateAgeGroup(birthDate));
  }, [birthDate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTogglePosition = (pos: string) => {
    setPositions(prev => {
      if (prev.includes(pos)) {
        return prev.filter(p => p !== pos);
      }
      if (prev.length >= 2) {
        return [prev[1], pos];
      }
      return [...prev, pos];
    });
  };

  const calculateAge = (dob: string) => {
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  };

  const selectedSkillMeta = skillScale.find((item) => item.code === selectedSkill) || skillScale[2];

  return (
    <Screen
      title="Профиль игрока"
      subtitle="Загрузите фото и настройте позиции на площадке"
    >
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div style={{ display: 'grid', gap: '16px' }}>
          <Card>
            <CardHeader style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ 
                  position: 'relative', 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  backgroundColor: '#f1f5f9', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  border: '2px solid var(--border-color)',
                  flexShrink: 0
                }}
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User2 size={40} color="#94a3b8" />
                )}
                <div style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'var(--primary-color)', padding: '4px', borderRadius: '50%', color: 'white', border: '2px solid white' }}>
                  <Camera size={12} />
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>
              <div style={{ display: 'grid', gap: '4px' }}>
                <CardTitle style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '1.25rem' }}>
                  Алексей, {calculateAge(birthDate)}
                </CardTitle>
                <CardDescription style={{ fontSize: '0.875rem' }}>
                  {grip} хват · {positions.join(' / ') || 'Амплуа не выбрано'}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: '16px', fontSize: '0.875rem' }}>
              
              <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '16px' }}>
                <div style={{ marginBottom: '8px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={14} /> Дата рождения
                </div>
                <input 
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '0.75rem',
                    border: '1px solid var(--border-color)',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                    outline: 'none'
                  }}
                />
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Категория:</span>
                  <TonePill className={getAgeToneClass(selectedAge)} style={{ fontWeight: 700 }}>{selectedAge}</TonePill>
                </div>
              </div>

              <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '16px' }}>
                <div style={{ marginBottom: '4px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>Ваше амплуа (до 2-х)</div>
                <HockeyRinkPicker 
                  selectedPositions={positions}
                  onToggle={handleTogglePosition}
                />
                <div style={{ textAlign: 'center', fontWeight: 600, color: 'var(--primary-color)', fontSize: '1rem', minHeight: '1.5rem' }}>
                  {positions.join(' / ')}
                </div>
              </div>

              <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '16px' }}>
                <div style={{ marginBottom: '8px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>Хват клюшки</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {['Левый', 'Правый'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGrip(g as any)}
                      className={clsx('grip-btn-small flex-1', grip === g && 'active')}
                      style={{ 
                        border: '1px solid var(--border-color)', 
                        padding: '10px', 
                        borderRadius: '0.75rem',
                        backgroundColor: grip === g ? 'var(--text-main)' : 'white',
                        color: grip === g ? 'white' : 'var(--text-main)',
                        fontWeight: 600,
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ borderRadius: '1rem', backgroundColor: '#f8fafc', padding: '16px' }}>
                <div style={{ marginBottom: '8px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>Мой текущий skill</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {skillScale.map((item) => {
                    const active = selectedSkill === item.code;
                    return (
                      <button
                        key={item.code}
                        onClick={() => setSelectedSkill(item.code)}
                        className={clsx('tone-pill-component', active ? getSkillToneClass(item.code) : '')}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: active ? '' : '#ffffff',
                          border: active ? '' : '1px solid var(--border-color)',
                          color: active ? '' : 'var(--text-main)',
                        }}
                      >
                        {item.code}
                      </button>
                    );
                  })}
                </div>
                <div style={{ marginTop: '12px', borderRadius: '1rem', backgroundColor: '#ffffff', border: '1px solid var(--border-color)', padding: '12px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{selectedSkillMeta.code} · {selectedSkillMeta.title}</div>
                  <div style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>{selectedSkillMeta.desc}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          <Card>
            <CardHeader>
              <CardTitle>Как я отображаюсь в слотах</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: '12px', fontSize: '0.875rem' }}>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', padding: '16px' }}>
                <div style={{ marginBottom: '8px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748b' }}>Мои цветовые метки</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <TonePill className={getAgeToneClass(selectedAge)}>{selectedAge}</TonePill>
                  <TonePill className={getSkillToneClass(selectedSkill)}>{selectedSkill}</TonePill>
                  {positions.map(p => (
                    <TonePill key={p} style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>{p}</TonePill>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Подписки</CardTitle>
            </CardHeader>
            <CardContent style={{ display: 'grid', gap: '12px', fontSize: '0.875rem', color: 'var(--text-main)' }}>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: '#ffffff', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={16} /> Последние окна льда
              </div>
              <div style={{ borderRadius: '1rem', border: '1px solid var(--border-color)', backgroundColor: '#ffffff', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={16} /> Игры {selectedAge} · {selectedSkill}
              </div>
            </CardContent>
          </Card>
          
          <Button variant="outline" onClick={() => navigate('/home')}>Сохранить профиль</Button>
        </div>
      </div>
    </Screen>
  );
}
