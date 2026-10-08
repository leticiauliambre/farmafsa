// ============================================================
// Archivo: frontend/src/pages/Inicio.jsx
// Descripción: Página principal pública
//
// Esta es la página que ve cualquier persona que ingresa al sitio.
// Muestra automáticamente la farmacia de turno del día actual
// y permite buscar por otra fecha.
// ============================================================

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import FarmaciaCard from '../components/FarmaciaCard';
import BuscadorPorFecha from '../components/BuscadorPorFecha';
import Footer from '../components/Footer';
import { obtenerFarmaciasPorFecha } from '../services/api';
import './Inicio.css';

function Inicio() {
  // Estado: lista de farmacias de turno
  const [farmacias, setFarmacias] = useState([]);

  // Estado: si está cargando la información
  const [cargando, setCargando] = useState(true);

  // Estado: mensaje de error si algo falla
  const [error, setError] = useState(null);

  // Estado: la fecha que se está consultando
  const [fechaConsultada, setFechaConsultada] = useState('hoy');

  // Al cargar la página, buscar automáticamente las farmacias de hoy
  useEffect(() => {
    buscarFarmacias('hoy');
  }, []); // El [] significa "ejecutar solo una vez, cuando carga el componente"

  // Función para buscar farmacias por fecha
  async function buscarFarmacias(fecha) {
    setCargando(true);
    setError(null);
    setFechaConsultada(fecha);

    try {
      const datos = await obtenerFarmaciasPorFecha(fecha);
      setFarmacias(datos.farmacias);
    } catch (err) {
      setError('No pudimos conectar con el servidor. Verificá tu conexión.');
      setFarmacias([]);
    } finally {
      setCargando(false);
    }
  }

  // Formatear la fecha consultada para mostrarla al usuario
  function formatearFechaConsultada() {
    if (fechaConsultada === 'hoy') {
      return 'Hoy';
    }
    const fecha = new Date(fechaConsultada + 'T00:00:00');
    return fecha.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  return (
    <div className="pagina-inicio">
      {/* Encabezado */}
      <Header />

      {/* Contenido principal */}
      <main className="inicio__main">
        <div className="contenedor">

          {/* Banner Hero / Presentación */}
          <section className="inicio__hero">
            <div className="inicio__hero-contenido">
              <div className="inicio__hero-badge">
                <span className="inicio__hero-punto"></span>
                <span>Servicio a la Comunidad • Formosa Capital</span>
              </div>
              <h2 className="inicio__hero-titulo">
                ¿Qué farmacia está de turno hoy?
              </h2>
              <p className="inicio__hero-descripcion">
                Consultá de manera rápida y sencilla la farmacia de guardia activa las 24 horas,
                su dirección exacta con mapa interactivo y número de teléfono.
              </p>
              <div className="inicio__hero-tags">
                <span className="inicio__hero-tag">⏰ Guardia 24 horas</span>
                <span className="inicio__hero-tag">📍 Ubicación en el mapa</span>
                <span className="inicio__hero-tag">🏛️ Datos oficiales de Formosa</span>
              </div>
            </div>
          </section>

          {/* Título de la sección de resultados */}
          <div className="inicio__seccion-titulo">
            <div>
              <span className="inicio__seccion-sub">Cronograma oficial</span>
              <h3 className="inicio__titulo-fecha">
                {fechaConsultada === 'hoy'
                  ? 'Farmacia de turno hoy'
                  : `Farmacia de turno: ${formatearFechaConsultada()}`}
              </h3>
            </div>
            {farmacias.length > 0 && !cargando && (
              <span className="inicio__contador-badge">
                {farmacias.length === 1 ? '1 farmacia activa' : `${farmacias.length} farmacias activas`}
              </span>
            )}
          </div>

          {/* Estado: Cargando */}
          {cargando && (
            <div className="spinner">
              Buscando farmacia de turno...
            </div>
          )}

          {/* Estado: Error de conexión */}
          {!cargando && error && (
            <div className="inicio__estado">
              <div className="inicio__estado-icono">⚠️</div>
              <h3 className="inicio__estado-titulo">Ocurrió un problema</h3>
              <p className="inicio__estado-mensaje">{error}</p>
              <p className="inicio__estado-ayuda">
                Verificá que XAMPP esté corriendo y que la base de datos esté configurada.
              </p>
            </div>
          )}

          {/* Estado: Sin farmacias para esa fecha */}
          {!cargando && !error && farmacias.length === 0 && (
            <div className="inicio__estado">
              <div className="inicio__estado-icono">🔍</div>
              <h3 className="inicio__estado-titulo">Sin información disponible</h3>
              <p className="inicio__estado-mensaje">
                No encontramos información de farmacias de turno para esta fecha.
              </p>
              <p className="inicio__estado-ayuda">
                Es posible que los turnos correspondientes a este período aún no hayan sido cargados.
              </p>
            </div>
          )}

          {/* Mostrar farmacias encontradas con mapa incrustado */}
          {!cargando && !error && farmacias.length > 0 && (
            <div className="inicio__farmacias">
              {farmacias.map((farmacia) => (
                <FarmaciaCard key={farmacia.id} farmacia={farmacia} />
              ))}
            </div>
          )}

          {/* Buscador por fecha para ver otros días */}
          <BuscadorPorFecha onBuscar={buscarFarmacias} cargando={cargando} />

        </div>
      </main>

      {/* Pie de página */}
      <Footer />
    </div>
  );
}

export default Inicio;
