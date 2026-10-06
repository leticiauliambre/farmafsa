// ============================================================
// Archivo: frontend/src/components/Header.jsx
// Descripción: Encabezado de la página pública
//
// Muestra el logo, el título del sitio y la fecha actual.
// Es el componente que aparece en la parte superior de la página.
// ============================================================

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
          {/* Logo e ícono */}
          <div className="header__logo">
            <span className="header__icono">🏥</span>
            <div>
              <h1 className="header__titulo">Farmacias de Turno</h1>
              <p className="header__subtitulo">Formosa Capital</p>
            </div>
          </div>

          {/* Fecha actual */}
          <div className="header__fecha">
            <span className="header__fecha-label">Hoy</span>
            <span className="header__fecha-valor">{fechaFormateada}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
