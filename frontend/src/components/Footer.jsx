// ============================================================
// Archivo: frontend/src/components/Footer.jsx
// Descripción: Pie de página con fuente oficial e información
// ============================================================

import './Footer.css';

function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="contenedor">
        <div className="footer__contenido">

          {/* Fuente oficial */}
          <div className="footer__fuente">
            <span className="footer__fuente-icono">🏛️</span>
            <div>
              <p className="footer__fuente-texto">Fuente oficial:</p>
              <a
                href="https://www.formosa.gob.ar/salud/farmaciaturnos"
                target="_blank"
                rel="noreferrer"
                className="footer__fuente-link"
              >
                Gobierno de la Provincia de Formosa — Farmacias de turno
              </a>
            </div>
          </div>

          {/* Derechos */}
          <p className="footer__derechos">
            Farmacias de Turno Formosa © {anioActual}
          </p>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
