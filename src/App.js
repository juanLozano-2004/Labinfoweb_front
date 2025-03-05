import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import GestionLaboratorios from './pages/GestionLaboratorios';
import Laboratorios from './pages/Laboratorios.jsx';
import MisReservas from './pages/MisReservas';
import Navbar from './components/Navbar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<Home setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/gestion-laboratorios" element={isAuthenticated ? <GestionLaboratorios /> : <Navigate to="/" />} />
        <Route path="/laboratorios" element={<Laboratorios />} />
        <Route path="/mis-reservas" element={isAuthenticated ? <MisReservas /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
export default App;