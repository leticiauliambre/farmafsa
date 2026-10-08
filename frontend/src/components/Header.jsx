// ============================================================
// Archivo: frontend/src/components/Header.jsx
// Descripción: Encabezado de la página pública con el logo oficial
// ============================================================

import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import './Header.css';

function Header() {
  // Obtener la fecha actual formateada en español
  const fechaHoy = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Capitalizar la primera letra
  const fechaFormateada = fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1);

  return (
    <header className="header">
      <div className="contenedor">
        <div className="header__contenido">
          {/* Logo oficial (el logo ya incluye el texto 'Farmacia de Turno') */}
          <Link to="/" className="header__logo-link" title="Farmacia de Turno — Inicio">
            <div className="header__logo-wrapper">
              <img
                src={logoImg}
                alt="Farmacia de Turno — Formosa Capital"
                className="header__logo-img"
              />
              <span className="header__logo-jurisdiccion">Formosa Capital</span>
            </div>
          </Link>

          {/* Acciones y datos del encabezado */}
          <div className="header__derecha">
            {/* Teléfono de emergencias médicas */}
            <div className="header__emergencia" title="Línea gratuita de emergencias médicas en Formosa">
              <span className="header__emergencia-icono">🚑</span>
              <div>
                <span className="header__emergencia-label">Emergencias</span>
                <span className="header__emergencia-numero">107</span>
              </div>
            </div>

            {/* Fecha actual */}
            <div className="header__fecha">
              <span className="header__fecha-label">Hoy</span>
              <span className="header__fecha-valor">{fechaFormateada}</span>
            </div>

            {/* Acceso al Panel Admin */}
            <Link to="/admin" className="header__admin-btn" title="Panel de Administración">
              <span className="header__admin-icono">🔐</span>
              <span className="header__admin-texto">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
