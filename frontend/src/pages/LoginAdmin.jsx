// ============================================================
// Archivo: frontend/src/pages/LoginAdmin.jsx
// Descripción: Página de login para el administrador
//
// Solo el administrador puede ver el panel.
// Esta página pide usuario y contraseña.
// Si son correctos, redirige al panel administrativo.
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/api';
import './LoginAdmin.css';

function LoginAdmin() {
  // Estado del formulario
  const [usuario, setUsuario]       = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError]           = useState('');
  const [cargando, setCargando]     = useState(false);

  // useNavigate permite redirigir a otra página
  const navigate = useNavigate();

  // Manejar el envío del formulario
  async function handleSubmit(e) {
    e.preventDefault(); // Evitar recarga de página
    setError('');

    // Validar que ambos campos estén completos
    if (!usuario || !contrasena) {
      setError('El usuario y la contraseña son obligatorios.');
      return;
    }

    setCargando(true);

    try {
      const resultado = await loginAdmin(usuario, contrasena);

      if (resultado.ok) {
        // Login exitoso: ir al panel administrativo
        navigate('/admin/panel');
      } else {
        // Error de credenciales
        setError(resultado.error || 'Usuario o contraseña incorrectos.');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor. Verificá tu conexión.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-pagina">
      <div className="login-caja">

        {/* Logo */}
        <div className="login-logo">
          <span className="login-logo__icono">🏥</span>
          <h1 className="login-logo__titulo">Panel Administrativo</h1>
          <p className="login-logo__subtitulo">Farmacias de Turno Formosa</p>
        </div>

        {/* Formulario */}
        <form className="login-form" onSubmit={handleSubmit}>

          {/* Campo: Usuario */}
          <div className="grupo-campo">
            <label htmlFor="admin-usuario" className="etiqueta-form">
              Usuario
            </label>
            <input
              id="admin-usuario"
              type="text"
              className="campo-form"
              placeholder="Ingresá tu usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoComplete="username"
            />
          </div>

          {/* Campo: Contraseña */}
          <div className="grupo-campo">
            <label htmlFor="admin-contrasena" className="etiqueta-form">
              Contraseña
            </label>
            <input
              id="admin-contrasena"
              type="password"
              className="campo-form"
              placeholder="Ingresá tu contraseña"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="mensaje-error" role="alert">
              {error}
            </div>
          )}

          {/* Botón de ingreso */}
          <button
            type="submit"
            className="btn-primario login-form__boton"
            disabled={cargando}
          >
            {cargando ? 'Ingresando...' : '🔐 Ingresar'}
          </button>

        </form>

        {/* Volver a la página pública */}
        <div className="login-volver">
          <a href="/" className="login-volver__link">
            ← Volver al inicio
          </a>
        </div>

      </div>
    </div>
  );
}

export default LoginAdmin;
