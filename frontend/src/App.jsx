// ============================================================
// Archivo: frontend/src/App.jsx
// Descripción: Componente principal de la aplicación
//
// Define las rutas de navegación usando React Router:
//   /          → Página pública (farmacias de turno)
//   /admin     → Login del administrador
//   /admin/panel → Panel administrativo (requiere login)
// ============================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicio      from './pages/Inicio';
import LoginAdmin  from './pages/LoginAdmin';
import PanelAdmin  from './pages/PanelAdmin';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página pública */}
        <Route path="/" element={<Inicio />} />

        {/* Acceso al panel admin */}
        <Route path="/admin" element={<LoginAdmin />} />

        {/* Panel administrativo */}
        <Route path="/admin/panel" element={<PanelAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
