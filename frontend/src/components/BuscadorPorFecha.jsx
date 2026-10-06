// ============================================================
// Archivo: frontend/src/components/BuscadorPorFecha.jsx
// Descripción: Formulario para consultar farmacias por fecha
//
// Permite al usuario elegir una fecha y buscar qué farmacia
// estaba de turno ese día.
// ============================================================

import { useState } from 'react';
import './BuscadorPorFecha.css';

function BuscadorPorFecha({ onBuscar, cargando }) {
  // Estado local: la fecha seleccionada por el usuario
  const [fecha, setFecha] = useState('');

  // Obtener la fecha de hoy en formato YYYY-MM-DD (para el valor máximo del input)
  const hoy = new Date().toISOString().split('T')[0];

  // Manejar el envío del formulario
  function handleSubmit(e) {
    e.preventDefault(); // Evitar recarga de la página

    if (!fecha) return; // No hacer nada si no se eligió fecha

    // Llamar a la función del componente padre con la fecha elegida
    onBuscar(fecha);
  }

  // Botón para volver a la fecha de hoy
  function handleHoy() {
    onBuscar('hoy');
    setFecha('');
  }

  return (
    <div className="buscador">
      <h2 className="buscador__titulo">¿Querés consultar otra fecha?</h2>
      <p className="buscador__descripcion">
        Seleccioná una fecha para ver qué farmacia estaba de turno ese día.
      </p>

      <form className="buscador__form" onSubmit={handleSubmit}>
        <div className="buscador__grupo">
          <label htmlFor="fecha-busqueda" className="etiqueta-form">
            Seleccioná una fecha
          </label>
          <input
            id="fecha-busqueda"
            type="date"
            className="campo-form buscador__input"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            max={hoy}
          />
        </div>

        <div className="buscador__botones">
          <button
            type="submit"
            className="btn-primario"
            disabled={!fecha || cargando}
          >
            {cargando ? 'Buscando...' : '🔍 Buscar'}
          </button>

          <button
            type="button"
            className="btn-secundario"
            onClick={handleHoy}
            disabled={cargando}
          >
            📅 Ver de hoy
          </button>
        </div>
      </form>
    </div>
  );
}

export default BuscadorPorFecha;
