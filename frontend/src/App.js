import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WelcomeAlert from './components/WelcomeAlert';
import { AuthContext } from './context/AuthContext';
import './App.css';

function AppContent() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <div className="flex flex-col min-h-screen">
      {user && <WelcomeAlert username={user.username} />}
      {!isDashboard && <Navbar />}
      <div className={isDashboard ? '' : 'flex-1'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isDashboard && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;