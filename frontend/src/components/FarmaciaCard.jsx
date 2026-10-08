// ============================================================
// Archivo: frontend/src/components/FarmaciaCard.jsx
// Descripción: Tarjeta que muestra la información de la farmacia
//              y su mapa interactivo incrustado directamente en la página.
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
    const fecha = new Date(fechaStr + 'T00:00:00'); // Evitar desfase de zona horaria
    return fecha.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  const horaInicio = formatearHora(farmacia.horario_inicio);
  const horaFin    = formatearHora(farmacia.horario_fin);

  // Dirección para incrustar en el mapa de Formosa
  const direccionParaMapa = farmacia.direccion
    ? `${farmacia.direccion}, Formosa, Argentina`
    : `${farmacia.nombre}, Formosa, Argentina`;

  // URL del mapa incrustado de Google Maps (sin necesidad de API Key ni librerías adicionales)
  const urlMapaEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(direccionParaMapa)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <article className="farmacia-card">
      <div className="farmacia-card__grid">

        {/* Columna 1: Información detallada de la farmacia */}
        <div className="farmacia-card__info-col">
          {/* Foto de la farmacia (si existe) */}
          {farmacia.foto && (
            <div className="farmacia-card__foto">
              <img
                src={`${FOTOS_BASE}${farmacia.foto}`}
                alt={`Foto de ${farmacia.nombre}`}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          {/* Fila superior: Badge de turno y localidad */}
          <div className="farmacia-card__estado-fila">
            <span className="badge-turno">🟢 De turno 24 hs</span>
            <span className="farmacia-card__localidad">📍 {farmacia.localidad || 'Formosa Capital'}</span>
          </div>

          {/* Nombre de la farmacia */}
          <h2 className="farmacia-card__nombre">{farmacia.nombre}</h2>

          {/* Lista de datos destacados */}
          <div className="farmacia-card__detalles">
            {/* Dirección */}
            {farmacia.direccion && (
              <div className="farmacia-card__detalle-item">
                <span className="farmacia-card__icono">📍</span>
                <div className="farmacia-card__detalle-texto">
                  <span className="farmacia-card__etiqueta">Dirección</span>
                  <span className="farmacia-card__valor">{farmacia.direccion}</span>
                </div>
              </div>
            )}

            {/* Teléfono */}
            {farmacia.telefono && (
              <div className="farmacia-card__detalle-item">
                <span className="farmacia-card__icono">📞</span>
                <div className="farmacia-card__detalle-texto">
                  <span className="farmacia-card__etiqueta">Teléfono</span>
                  <a href={`tel:${farmacia.telefono}`} className="farmacia-card__telefono-link">
                    {farmacia.telefono}
                    <span className="farmacia-card__llamar-chip">Llamar</span>
                  </a>
                </div>
              </div>
            )}

            {/* Horario */}
            {(horaInicio || farmacia.notas) && (
              <div className="farmacia-card__detalle-item">
                <span className="farmacia-card__icono">⏰</span>
                <div className="farmacia-card__detalle-texto">
                  <span className="farmacia-card__etiqueta">Horario de guardia</span>
                  <span className="farmacia-card__valor">
                    {horaInicio && horaFin
                      ? `${horaInicio} a ${horaFin} hs (Turno completo)`
                      : horaInicio || farmacia.notas || 'Consultar horario'}
                  </span>
                </div>
              </div>
            )}

            {/* Período del turno */}
            {farmacia.fecha_inicio && farmacia.fecha_fin && (
              <div className="farmacia-card__detalle-item">
                <span className="farmacia-card__icono">📅</span>
                <div className="farmacia-card__detalle-texto">
                  <span className="farmacia-card__etiqueta">Período de guardia</span>
                  <span className="farmacia-card__valor">
                    Del {formatearFecha(farmacia.fecha_inicio)} al {formatearFecha(farmacia.fecha_fin)}
                  </span>
                </div>
              </div>
            )}

            {/* Notas adicionales */}
            {farmacia.notas && (
              <div className="farmacia-card__detalle-item farmacia-card__detalle-item--nota">
                <span className="farmacia-card__icono">ℹ️</span>
                <div className="farmacia-card__detalle-texto">
                  <span className="farmacia-card__etiqueta">Notas</span>
                  <span className="farmacia-card__valor">{farmacia.notas}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna 2: Mapa incrustado en la propia página */}
        <div className="farmacia-card__mapa-col">
          <div className="farmacia-card__mapa-header">
            <div className="farmacia-card__mapa-header-info">
              <span className="farmacia-card__mapa-pin">🗺️</span>
              <div>
                <span className="farmacia-card__mapa-titulo">Ubicación en el mapa</span>
                <span className="farmacia-card__mapa-subtitulo">{farmacia.direccion || 'Formosa Capital'}</span>
              </div>
            </div>
            <span className="farmacia-card__mapa-badge">Interactivo</span>
          </div>

          <div className="farmacia-card__mapa-marco">
            <iframe
              className="farmacia-card__mapa-iframe"
              title={`Mapa interactivo con la ubicación de ${farmacia.nombre}`}
              src={urlMapaEmbed}
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>

      </div>
    </article>
  );
}

export default FarmaciaCard;
