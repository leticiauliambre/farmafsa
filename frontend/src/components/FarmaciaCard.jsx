// ============================================================
// Archivo: frontend/src/components/FarmaciaCard.jsx
// Descripción: Tarjeta que muestra la información de una farmacia
//
// Recibe los datos de la farmacia como "props" (propiedades)
// y los muestra de forma organizada y clara.
// ============================================================

import './FarmaciaCard.css';

// URL base del backend para las fotos
const FOTOS_BASE = 'http://localhost/farmafsa-backend/uploads/fotos/';

function FarmaciaCard({ farmacia }) {
  // Formatear la hora (ej: "08:00:00" → "08:00")
  function formatearHora(hora) {
    if (!hora) return null;
    return hora.substring(0, 5); // Tomar solo HH:MM
  }

  // Formatear fecha (ej: "2026-10-01" → "1 de octubre de 2026")
  function formatearFecha(fechaStr) {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr + 'T00:00:00'); // Evitar problemas de zona horaria
    return fecha.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  const horaInicio = formatearHora(farmacia.horario_inicio);
  const horaFin    = formatearHora(farmacia.horario_fin);

  return (
    <div className="farmacia-card">

      {/* Foto de la farmacia (si existe) */}
      {farmacia.foto && (
        <div className="farmacia-card__foto">
          <img
            src={`${FOTOS_BASE}${farmacia.foto}`}
            alt={`Foto de ${farmacia.nombre}`}
            onError={(e) => { e.target.style.display = 'none'; }} // Ocultar si no carga
          />
        </div>
      )}

      {/* Cuerpo de la tarjeta */}
      <div className="farmacia-card__cuerpo">

        {/* Badge de turno activo */}
        <div className="farmacia-card__badge">
          <span className="badge-turno">De turno</span>
        </div>

        {/* Nombre de la farmacia */}
        <h2 className="farmacia-card__nombre">{farmacia.nombre}</h2>

        {/* Información de la farmacia */}
        <ul className="farmacia-card__info">

          {/* Dirección */}
          {farmacia.direccion && (
            <li className="farmacia-card__item">
              <span className="farmacia-card__icono">📍</span>
              <div>
                <span className="farmacia-card__etiqueta">Dirección</span>
                <span className="farmacia-card__valor">{farmacia.direccion}</span>
              </div>
            </li>
          )}

          {/* Teléfono */}
          {farmacia.telefono && (
            <li className="farmacia-card__item">
              <span className="farmacia-card__icono">📞</span>
              <div>
                <span className="farmacia-card__etiqueta">Teléfono</span>
                <a href={`tel:${farmacia.telefono}`} className="farmacia-card__telefono">
                  {farmacia.telefono}
                </a>
              </div>
            </li>
          )}

          {/* Horario */}
          {(horaInicio || farmacia.notas) && (
            <li className="farmacia-card__item">
              <span className="farmacia-card__icono">🕐</span>
              <div>
                <span className="farmacia-card__etiqueta">Horario</span>
                <span className="farmacia-card__valor">
                  {horaInicio && horaFin
                    ? `${horaInicio} a ${horaFin}`
                    : horaInicio || farmacia.notas || 'Consultar'}
                </span>
              </div>
            </li>
          )}

          {/* Período del turno */}
          {farmacia.fecha_inicio && farmacia.fecha_fin && (
            <li className="farmacia-card__item">
              <span className="farmacia-card__icono">📅</span>
              <div>
                <span className="farmacia-card__etiqueta">Período de turno</span>
                <span className="farmacia-card__valor">
                  Del {formatearFecha(farmacia.fecha_inicio)} al {formatearFecha(farmacia.fecha_fin)}
                </span>
              </div>
            </li>
          )}

        </ul>

        {/* Botón de Google Maps */}
        {farmacia.maps_url && (
          <a
            href={farmacia.maps_url}
            target="_blank"
            rel="noreferrer"
            className="farmacia-card__boton-maps btn-primario"
          >
            🗺️ Ver en Google Maps
          </a>
        )}

      </div>
    </div>
  );
}

export default FarmaciaCard;
