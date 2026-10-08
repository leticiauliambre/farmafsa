// ============================================================
// Archivo: frontend/src/components/Footer.jsx
// Descripción: Pie de página con fuente oficial y teléfonos útiles
// ============================================================

import './Footer.css';

function Footer() {
  const anioActual = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="contenedor">
        <div className="footer__contenido">

          {/* Fuente oficial */}
          <div className="footer__bloque">
            <span className="footer__icono">🏛️</span>
            <div>
              <p className="footer__etiqueta">Fuente de información oficial</p>
              <a
                href="https://www.formosa.gob.ar/salud/farmaciaturnos"
                target="_blank"
                rel="noreferrer"
                className="footer__link"
              >
                Gobierno de la Provincia de Formosa — Farmacias de Turno
              </a>
            </div>
          </div>

          {/* Teléfonos de emergencia */}
          <div className="footer__bloque">
            <span className="footer__icono">📞</span>
            <div>
              <p className="footer__etiqueta">Teléfonos de Emergencias</p>
              <p className="footer__texto">
                SAME / Emergencias: <strong className="footer__resaltado">107</strong> &nbsp;|&nbsp; 
                Policía: <strong className="footer__resaltado">911</strong>
              </p>
            </div>
          </div>

          {/* Créditos académicos */}
          <div className="footer__creditos">
            <p>Farmacias de Turno • Formosa Capital © {anioActual}</p>
            <p className="footer__subcredito">Proyecto Académico de Software</p>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
