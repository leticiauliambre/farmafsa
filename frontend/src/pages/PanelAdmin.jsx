// ============================================================
// Archivo: frontend/src/pages/PanelAdmin.jsx
// Descripción: Panel administrativo completo
//
// Desde acá el administrador puede:
// - Ver, agregar, editar y eliminar farmacias
// - Ver, agregar, editar y eliminar turnos
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  obtenerFarmacias, crearFarmacia, editarFarmacia, eliminarFarmacia,
  obtenerTurnos, crearTurno, editarTurno, eliminarTurno,
  logoutAdmin
} from '../services/api';
import './PanelAdmin.css';

function PanelAdmin() {
  // Pestaña activa: 'farmacias' o 'turnos'
  const [pestanaActiva, setPestanaActiva] = useState('farmacias');

  // --- Estado de farmacias ---
  const [farmacias, setFarmacias] = useState([]);
  const [formFarmacia, setFormFarmacia] = useState({ id: null, nombre: '', direccion: '', telefono: '', localidad: 'Formosa Capital', maps_url: '' });
  const [editandoFarmacia, setEditandoFarmacia] = useState(false);

  // --- Estado de turnos ---
  const [turnos, setTurnos]     = useState([]);
  const [formTurno, setFormTurno] = useState({ id: null, farmacia_id: '', fecha_inicio: '', fecha_fin: '', horario_inicio: '08:00', horario_fin: '08:00', notas: '' });
  const [editandoTurno, setEditandoTurno] = useState(false);

  // --- Estado general ---
  const [cargando, setCargando]   = useState(true);
  const [mensaje, setMensaje]     = useState({ texto: '', tipo: '' });

  const navigate = useNavigate();

  // Al cargar el panel, obtener los datos
  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    try {
      const [dataFarmacias, dataTurnos] = await Promise.all([
        obtenerFarmacias(),
        obtenerTurnos(),
      ]);
      // Si el backend responde con error 401 (no autenticado)
      if (dataFarmacias.error) {
        navigate('/admin');
        return;
      }
      setFarmacias(Array.isArray(dataFarmacias) ? dataFarmacias : []);
      setTurnos(Array.isArray(dataTurnos) ? dataTurnos : []);
    } catch {
      mostrarMensaje('Error al cargar los datos.', 'error');
    } finally {
      setCargando(false);
    }
  }

  // Mostrar mensaje temporal (éxito o error)
  function mostrarMensaje(texto, tipo) {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
  }

  // ============================================================
  // FARMACIAS
  // ============================================================

  function limpiarFormFarmacia() {
    setFormFarmacia({ id: null, nombre: '', direccion: '', telefono: '', localidad: 'Formosa Capital', maps_url: '' });
    setEditandoFarmacia(false);
  }

  function prepararEdicionFarmacia(farmacia) {
    setFormFarmacia({
      id:        farmacia.id,
      nombre:    farmacia.nombre    || '',
      direccion: farmacia.direccion || '',
      telefono:  farmacia.telefono  || '',
      localidad: farmacia.localidad || 'Formosa Capital',
      maps_url:  farmacia.maps_url  || '',
    });
    setEditandoFarmacia(true);
    // Scroll al formulario
    document.getElementById('form-farmacia')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleGuardarFarmacia(e) {
    e.preventDefault();
    if (!formFarmacia.nombre.trim()) {
      mostrarMensaje('El nombre de la farmacia es obligatorio.', 'error');
      return;
    }

    try {
      const resultado = editandoFarmacia
        ? await editarFarmacia(formFarmacia)
        : await crearFarmacia(formFarmacia);

      if (resultado.ok) {
        mostrarMensaje(resultado.mensaje, 'exito');
        limpiarFormFarmacia();
        await cargarDatos();
      } else {
        mostrarMensaje(resultado.error || 'Ocurrió un error.', 'error');
      }
    } catch {
      mostrarMensaje('Error al guardar la farmacia.', 'error');
    }
  }

  async function handleEliminarFarmacia(id, nombre) {
    if (!window.confirm(`¿Estás segura de que querés eliminar "${nombre}"? Esta acción también eliminará sus turnos.`)) return;
    try {
      const resultado = await eliminarFarmacia(id);
      if (resultado.ok) {
        mostrarMensaje(resultado.mensaje, 'exito');
        await cargarDatos();
      } else {
        mostrarMensaje(resultado.error || 'Error al eliminar.', 'error');
      }
    } catch {
      mostrarMensaje('Error al eliminar la farmacia.', 'error');
    }
  }

  // ============================================================
  // TURNOS
  // ============================================================

  function limpiarFormTurno() {
    setFormTurno({ id: null, farmacia_id: '', fecha_inicio: '', fecha_fin: '', horario_inicio: '08:00', horario_fin: '08:00', notas: '' });
    setEditandoTurno(false);
  }

  function prepararEdicionTurno(turno) {
    setFormTurno({
      id:             turno.id,
      farmacia_id:    turno.farmacia_id,
      fecha_inicio:   turno.fecha_inicio,
      fecha_fin:      turno.fecha_fin,
      horario_inicio: turno.horario_inicio?.substring(0, 5) || '08:00',
      horario_fin:    turno.horario_fin?.substring(0, 5)    || '08:00',
      notas:          turno.notas || '',
    });
    setEditandoTurno(true);
    document.getElementById('form-turno')?.scrollIntoView({ behavior: 'smooth' });
  }

  async function handleGuardarTurno(e) {
    e.preventDefault();
    if (!formTurno.farmacia_id || !formTurno.fecha_inicio || !formTurno.fecha_fin) {
      mostrarMensaje('Farmacia, fecha de inicio y fecha de fin son obligatorios.', 'error');
      return;
    }

    try {
      const resultado = editandoTurno
        ? await editarTurno(formTurno)
        : await crearTurno(formTurno);

      if (resultado.ok) {
        mostrarMensaje(resultado.mensaje, 'exito');
        limpiarFormTurno();
        await cargarDatos();
      } else {
        mostrarMensaje(resultado.error || 'Ocurrió un error.', 'error');
      }
    } catch {
      mostrarMensaje('Error al guardar el turno.', 'error');
    }
  }

  async function handleEliminarTurno(id) {
    if (!window.confirm('¿Estás segura de que querés eliminar este turno?')) return;
    try {
      const resultado = await eliminarTurno(id);
      if (resultado.ok) {
        mostrarMensaje(resultado.mensaje, 'exito');
        await cargarDatos();
      } else {
        mostrarMensaje(resultado.error || 'Error al eliminar.', 'error');
      }
    } catch {
      mostrarMensaje('Error al eliminar el turno.', 'error');
    }
  }

  // Cerrar sesión
  async function handleLogout() {
    await logoutAdmin();
    navigate('/admin');
  }

  // ============================================================
  // RENDER
  // ============================================================

  if (cargando) {
    return <div className="spinner" style={{ paddingTop: '120px' }}>Cargando panel...</div>;
  }

  return (
    <div className="panel">

      {/* Barra superior del panel */}
      <div className="panel__barra">
        <div className="contenedor panel__barra-contenido">
          <div className="panel__barra-titulo">
            <span>🏥</span>
            <span>Panel Administrativo</span>
          </div>
          <div className="panel__barra-acciones">
            <a href="/" className="panel__link-inicio">Ver sitio público</a>
            <button className="btn-peligro" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="contenedor panel__contenido">

        {/* Mensaje de éxito o error */}
        {mensaje.texto && (
          <div className={mensaje.tipo === 'exito' ? 'mensaje-exito' : 'mensaje-error'} style={{ marginBottom: '20px' }}>
            {mensaje.texto}
          </div>
        )}

        {/* Pestañas de navegación */}
        <div className="panel__pestanas">
          <button
            className={`panel__pestana ${pestanaActiva === 'farmacias' ? 'panel__pestana--activa' : ''}`}
            onClick={() => setPestanaActiva('farmacias')}
          >
            🏪 Farmacias ({farmacias.length})
          </button>
          <button
            className={`panel__pestana ${pestanaActiva === 'turnos' ? 'panel__pestana--activa' : ''}`}
            onClick={() => setPestanaActiva('turnos')}
          >
            📅 Turnos ({turnos.length})
          </button>
        </div>

        {/* ── PESTAÑA: FARMACIAS ── */}
        {pestanaActiva === 'farmacias' && (
          <div className="panel__seccion">

            {/* Formulario de farmacia */}
            <div className="card" id="form-farmacia">
              <h2 className="panel__form-titulo">
                {editandoFarmacia ? '✏️ Editar farmacia' : '➕ Nueva farmacia'}
              </h2>
              <form onSubmit={handleGuardarFarmacia}>
                <div className="panel__form-grid">
                  <div className="grupo-campo">
                    <label className="etiqueta-form">Nombre *</label>
                    <input
                      type="text"
                      className="campo-form"
                      placeholder="Nombre de la farmacia"
                      value={formFarmacia.nombre}
                      onChange={(e) => setFormFarmacia({ ...formFarmacia, nombre: e.target.value })}
                    />
                  </div>
                  <div className="grupo-campo">
                    <label className="etiqueta-form">Dirección</label>
                    <input
                      type="text"
                      className="campo-form"
                      placeholder="Av. 25 de Mayo 150"
                      value={formFarmacia.direccion}
                      onChange={(e) => setFormFarmacia({ ...formFarmacia, direccion: e.target.value })}
                    />
                  </div>
                  <div className="grupo-campo">
                    <label className="etiqueta-form">Teléfono</label>
                    <input
                      type="text"
                      className="campo-form"
                      placeholder="(0370) 442-0000"
                      value={formFarmacia.telefono}
                      onChange={(e) => setFormFarmacia({ ...formFarmacia, telefono: e.target.value })}
                    />
                  </div>
                  <div className="grupo-campo">
                    <label className="etiqueta-form">Localidad</label>
                    <input
                      type="text"
                      className="campo-form"
                      value={formFarmacia.localidad}
                      onChange={(e) => setFormFarmacia({ ...formFarmacia, localidad: e.target.value })}
                    />
                  </div>
                  <div className="grupo-campo panel__campo-ancho">
                    <label className="etiqueta-form">Enlace de Google Maps</label>
                    <input
                      type="url"
                      className="campo-form"
                      placeholder="https://maps.google.com/?q=..."
                      value={formFarmacia.maps_url}
                      onChange={(e) => setFormFarmacia({ ...formFarmacia, maps_url: e.target.value })}
                    />
                  </div>
                </div>
                <div className="panel__form-botones">
                  <button type="submit" className="btn-primario">
                    {editandoFarmacia ? '💾 Guardar cambios' : '➕ Agregar farmacia'}
                  </button>
                  {editandoFarmacia && (
                    <button type="button" className="btn-secundario" onClick={limpiarFormFarmacia}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Lista de farmacias */}
            <div className="panel__lista">
              <h3 className="panel__lista-titulo">Farmacias registradas</h3>
              {farmacias.length === 0 ? (
                <p className="panel__lista-vacio">No hay farmacias registradas todavía.</p>
              ) : (
                <div className="tabla-contenedor">
                  <table className="tabla">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {farmacias.map((f) => (
                        <tr key={f.id}>
                          <td><strong>{f.nombre}</strong></td>
                          <td>{f.direccion || '—'}</td>
                          <td>{f.telefono || '—'}</td>
                          <td className="tabla__acciones">
                            <button className="btn-editar" onClick={() => prepararEdicionFarmacia(f)}>
                              ✏️ Editar
                            </button>
                            <button className="btn-peligro" onClick={() => handleEliminarFarmacia(f.id, f.nombre)}>
                              🗑️ Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── PESTAÑA: TURNOS ── */}
        {pestanaActiva === 'turnos' && (
          <div className="panel__seccion">

            {/* Formulario de turno */}
            <div className="card" id="form-turno">
              <h2 className="panel__form-titulo">
                {editandoTurno ? '✏️ Editar turno' : '➕ Nuevo turno'}
              </h2>
              <form onSubmit={handleGuardarTurno}>
                <div className="panel__form-grid">
                  <div className="grupo-campo panel__campo-ancho">
                    <label className="etiqueta-form">Farmacia *</label>
                    <select
                      className="campo-form"
                      value={formTurno.farmacia_id}
                      onChange={(e) => setFormTurno({ ...formTurno, farmacia_id: e.target.value })}
                    >
                      <option value="">— Seleccioná una farmacia —</option>
                      {farmacias.map((f) => (
                        <option key={f.id} value={f.id}>{f.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grupo-campo">
                    <label className="etiqueta-form">Fecha de inicio *</label>
                    <input
                      type="date"
                      className="campo-form"
                      value={formTurno.fecha_inicio}
                      onChange={(e) => setFormTurno({ ...formTurno, fecha_inicio: e.target.value })}
                    />
                  </div>
                  <div className="grupo-campo">
                    <label className="etiqueta-form">Fecha de fin *</label>
                    <input
                      type="date"
                      className="campo-form"
                      value={formTurno.fecha_fin}
                      onChange={(e) => setFormTurno({ ...formTurno, fecha_fin: e.target.value })}
                    />
                  </div>
                  <div className="grupo-campo">
                    <label className="etiqueta-form">Horario de inicio</label>
                    <input
                      type="time"
                      className="campo-form"
                      value={formTurno.horario_inicio}
                      onChange={(e) => setFormTurno({ ...formTurno, horario_inicio: e.target.value })}
                    />
                  </div>
                  <div className="grupo-campo">
                    <label className="etiqueta-form">Horario de fin</label>
                    <input
                      type="time"
                      className="campo-form"
                      value={formTurno.horario_fin}
                      onChange={(e) => setFormTurno({ ...formTurno, horario_fin: e.target.value })}
                    />
                  </div>
                  <div className="grupo-campo panel__campo-ancho">
                    <label className="etiqueta-form">Notas adicionales</label>
                    <input
                      type="text"
                      className="campo-form"
                      placeholder="Ej: Turno completo 24hs"
                      value={formTurno.notas}
                      onChange={(e) => setFormTurno({ ...formTurno, notas: e.target.value })}
                    />
                  </div>
                </div>
                <div className="panel__form-botones">
                  <button type="submit" className="btn-primario">
                    {editandoTurno ? '💾 Guardar cambios' : '➕ Agregar turno'}
                  </button>
                  {editandoTurno && (
                    <button type="button" className="btn-secundario" onClick={limpiarFormTurno}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Lista de turnos */}
            <div className="panel__lista">
              <h3 className="panel__lista-titulo">Turnos registrados</h3>
              {turnos.length === 0 ? (
                <p className="panel__lista-vacio">No hay turnos registrados todavía.</p>
              ) : (
                <div className="tabla-contenedor">
                  <table className="tabla">
                    <thead>
                      <tr>
                        <th>Farmacia</th>
                        <th>Desde</th>
                        <th>Hasta</th>
                        <th>Horario</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {turnos.map((t) => (
                        <tr key={t.id}>
                          <td><strong>{t.farmacia_nombre}</strong></td>
                          <td>{t.fecha_inicio}</td>
                          <td>{t.fecha_fin}</td>
                          <td>
                            {t.horario_inicio && t.horario_fin
                              ? `${t.horario_inicio.substring(0,5)} a ${t.horario_fin.substring(0,5)}`
                              : '—'}
                          </td>
                          <td className="tabla__acciones">
                            <button className="btn-editar" onClick={() => prepararEdicionTurno(t)}>
                              ✏️ Editar
                            </button>
                            <button className="btn-peligro" onClick={() => handleEliminarTurno(t.id)}>
                              🗑️ Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default PanelAdmin;
