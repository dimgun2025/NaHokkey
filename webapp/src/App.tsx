import { Routes, Route, Navigate } from 'react-router-dom';
import { BottomTabBar } from './components/layout/BottomTabBar';
import Home from './pages/Home';
import FindGame from './pages/FindGame';
import TrainingList from './pages/TrainingList';
import ArenasCatalog from './pages/ArenasCatalog';
import CreateSlot from './pages/CreateSlot';
import OrganizerDashboard from './pages/OrganizerDashboard';
import CoachCabinet from './pages/CoachCabinet';
import Profile from './pages/Profile';
import GameDetails from './pages/GameDetails';
import TrainingDetails from './pages/TrainingDetails';
import Payment from './pages/Payment';

function App() {
  return (
    <>
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/find" element={<FindGame />} />
          <Route path="/trainings" element={<TrainingList />} />
          <Route path="/arenas" element={<ArenasCatalog />} />
          <Route path="/create" element={<CreateSlot />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/coach" element={<CoachCabinet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/game/:id" element={<GameDetails />} />
          <Route path="/training/:id" element={<TrainingDetails />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </div>
      <BottomTabBar />
    </>
  );
}

export default App;
