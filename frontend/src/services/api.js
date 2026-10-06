// ============================================================
// Archivo: frontend/src/services/api.js
// Descripción: Funciones para comunicarse con el backend PHP
//
// Este archivo centraliza todas las llamadas al backend.
// React usa fetch() (función nativa del navegador) para enviar
// solicitudes HTTP al servidor PHP.
// ============================================================

// URL base del backend PHP en XAMPP
// Cambiar según donde esté instalado el proyecto en XAMPP
const API_BASE = 'http://localhost/farmafsa-backend/api';

// ============================================================
// ENDPOINTS PÚBLICOS
// ============================================================

/**
 * Obtiene las farmacias de turno para una fecha específica.
 * Si no se pasa fecha, el backend usa la fecha de hoy.
 * @param {string} fecha - Formato YYYY-MM-DD, o 'hoy'
 */
export async function obtenerFarmaciasPorFecha(fecha = 'hoy') {
  const respuesta = await fetch(`${API_BASE}/turnos.php?fecha=${fecha}`);
  if (!respuesta.ok) {
    throw new Error('Error al consultar las farmacias de turno.');
  }
  return await respuesta.json();
}

// ============================================================
// ENDPOINTS ADMINISTRATIVOS
// ============================================================

/**
 * Inicia sesión del administrador.
 * @param {string} usuario
 * @param {string} contrasena
 */
export async function loginAdmin(usuario, contrasena) {
  const respuesta = await fetch(`${API_BASE}/admin/login.php`, {
    method: 'POST',
    credentials: 'include',       // Necesario para enviar cookies de sesión
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, contrasena }),
  });
  return await respuesta.json();
}

/**
 * Cierra la sesión del administrador.
 */
export async function logoutAdmin() {
  await fetch(`${API_BASE}/admin/logout.php`, {
    method: 'POST',
    credentials: 'include',
  });
}

// --- Farmacias (admin) ---

export async function obtenerFarmacias() {
  const respuesta = await fetch(`${API_BASE}/admin/farmacias.php`, {
    credentials: 'include',
  });
  return await respuesta.json();
}

export async function crearFarmacia(datos) {
  const respuesta = await fetch(`${API_BASE}/admin/farmacias.php`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return await respuesta.json();
}

export async function editarFarmacia(datos) {
  const respuesta = await fetch(`${API_BASE}/admin/farmacias.php`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return await respuesta.json();
}

export async function eliminarFarmacia(id) {
  const respuesta = await fetch(`${API_BASE}/admin/farmacias.php?id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return await respuesta.json();
}

// --- Turnos (admin) ---

export async function obtenerTurnos() {
  const respuesta = await fetch(`${API_BASE}/admin/turnos.php`, {
    credentials: 'include',
  });
  return await respuesta.json();
}

export async function crearTurno(datos) {
  const respuesta = await fetch(`${API_BASE}/admin/turnos.php`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return await respuesta.json();
}

export async function editarTurno(datos) {
  const respuesta = await fetch(`${API_BASE}/admin/turnos.php`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return await respuesta.json();
}

export async function eliminarTurno(id) {
  const respuesta = await fetch(`${API_BASE}/admin/turnos.php?id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return await respuesta.json();
}
