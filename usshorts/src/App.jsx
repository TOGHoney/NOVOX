import { Routes, Route } from 'react-router-dom';

import Login from './pages/login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Articles from './pages/Articles';
import Debates from './pages/Debates';
import DebateRoom from './pages/DebateRoom';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import { ProtectedRoute } from './components/ProtectedRoutes';
import AppLayout from './layouts/AppLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup/>}/>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/debates" element={<Debates />} />
            <Route path="/debates/:id" element={<DebateRoom />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}