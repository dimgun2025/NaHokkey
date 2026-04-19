import { NavLink } from 'react-router-dom';
import { Goal, Users, Dumbbell, Building2, Plus, ShieldCheck, UserCircle2 } from 'lucide-react';
import './BottomTabBar.css';

const navItems = [
  { path: '/home', label: 'Главная', icon: <Goal size={16} /> },
  { path: '/find', label: 'Игры', icon: <Users size={16} /> },
  { path: '/trainings', label: 'Тренировки', icon: <Dumbbell size={16} /> },
  { path: '/arenas', label: 'Арены', icon: <Building2 size={16} /> },
  { path: '/create', label: 'Создать', icon: <Plus size={16} /> },
  { path: '/organizer', label: 'Кабинет', icon: <ShieldCheck size={16} /> },
  { path: '/profile', label: 'Профиль', icon: <UserCircle2 size={16} /> },
];

export function BottomTabBar() {
  return (
    <div className="bottom-tab-container">
      <nav className="bottom-tab-bar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `tab-item flex-1 ${isActive ? 'active' : ''}`}
          >
            <div className="tab-icon">{item.icon}</div>
            <span className="tab-label truncate text-[10px]">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
