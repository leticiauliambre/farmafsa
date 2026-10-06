-- ============================================================
-- BASE DE DATOS: Farmacias de Turno - Formosa Capital
-- Archivo: farmacias.sql
-- Descripción: Crea la base de datos, tablas y datos de prueba
-- Importar desde: phpMyAdmin
-- ============================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS farmacias_turno
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE farmacias_turno;

-- ============================================================
-- TABLA: farmacias
-- Guarda la información permanente de cada farmacia
-- ============================================================
CREATE TABLE IF NOT EXISTS farmacias (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(150) NOT NULL,
  direccion  VARCHAR(200),
  telefono   VARCHAR(30),
  localidad  VARCHAR(100) DEFAULT 'Formosa Capital',
  maps_url   VARCHAR(500),       -- Enlace directo a Google Maps
  foto       VARCHAR(200)        -- Nombre del archivo de foto (opcional)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLA: turnos
-- Guarda los períodos de turno de cada farmacia
-- Una farmacia puede tener varios turnos a lo largo del tiempo
-- ============================================================
CREATE TABLE IF NOT EXISTS turnos (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  farmacia_id    INT NOT NULL,
  fecha_inicio   DATE NOT NULL,
  fecha_fin      DATE NOT NULL,
  horario_inicio TIME,
  horario_fin    TIME,
  notas          VARCHAR(300),
  FOREIGN KEY (farmacia_id) REFERENCES farmacias(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLA: administradores
-- Guarda los usuarios del panel administrativo
-- Las contraseñas se guardan cifradas con password_hash() de PHP
-- ============================================================
CREATE TABLE IF NOT EXISTS administradores (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  usuario     VARCHAR(60) NOT NULL UNIQUE,
  contrasena  VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DATOS DE PRUEBA: Farmacias
-- Datos ficticios para desarrollo y pruebas
-- ============================================================
INSERT INTO farmacias (nombre, direccion, telefono, localidad, maps_url) VALUES
('Farmacia Central',       'Av. 25 de Mayo 150',         '(0370) 442-1100', 'Formosa Capital', 'https://maps.google.com/?q=Av.+25+de+Mayo+150,+Formosa,+Argentina'),
('Farmacia San Miguel',    'Av. 9 de Julio 320',         '(0370) 442-2200', 'Formosa Capital', 'https://maps.google.com/?q=Av.+9+de+Julio+320,+Formosa,+Argentina'),
('Farmacia del Pueblo',    'Calle Belgrano 75',           '(0370) 442-3300', 'Formosa Capital', 'https://maps.google.com/?q=Calle+Belgrano+75,+Formosa,+Argentina'),
('Farmacia La Cruz Verde',  'Av. Gutnisky 1200',          '(0370) 442-4400', 'Formosa Capital', 'https://maps.google.com/?q=Av.+Gutnisky+1200,+Formosa,+Argentina'),
('Farmacia Norte',         'Calle J.B. Alberdi 480',     '(0370) 442-5500', 'Formosa Capital', 'https://maps.google.com/?q=Calle+Alberdi+480,+Formosa,+Argentina'),
('Farmacia Sur',           'Av. Hipólito Irigoyen 560',  '(0370) 442-6600', 'Formosa Capital', 'https://maps.google.com/?q=Av.+Yrigoyen+560,+Formosa,+Argentina'),
('Farmacia Oriental',      'Calle Moreno 200',            '(0370) 442-7700', 'Formosa Capital', 'https://maps.google.com/?q=Calle+Moreno+200,+Formosa,+Argentina'),
('Farmacia Villa del Parque', 'Av. Néstor Kirchner 890', '(0370) 442-8800', 'Formosa Capital', 'https://maps.google.com/?q=Av+Kirchner+890,+Formosa,+Argentina');

-- ============================================================
-- DATOS DE PRUEBA: Turnos - Octubre 2026
-- Cada farmacia cubre un período de varios días
-- Fuente: Datos de prueba para desarrollo
-- ============================================================
INSERT INTO turnos (farmacia_id, fecha_inicio, fecha_fin, horario_inicio, horario_fin, notas) VALUES
-- Farmacia Central: 1 al 4 de octubre
(1, '2026-10-01', '2026-10-04', '08:00:00', '08:00:00', 'Turno completo 24hs'),
-- Farmacia San Miguel: 5 al 8 de octubre
(2, '2026-10-05', '2026-10-08', '08:00:00', '08:00:00', 'Turno completo 24hs'),
-- Farmacia del Pueblo: 9 al 12 de octubre
(3, '2026-10-09', '2026-10-12', '08:00:00', '08:00:00', 'Turno completo 24hs'),
-- Farmacia La Cruz Verde: 13 al 16 de octubre
(4, '2026-10-13', '2026-10-16', '08:00:00', '08:00:00', 'Turno completo 24hs'),
-- Farmacia Norte: 17 al 20 de octubre
(5, '2026-10-17', '2026-10-20', '08:00:00', '08:00:00', 'Turno completo 24hs'),
-- Farmacia Sur: 21 al 24 de octubre
(6, '2026-10-21', '2026-10-24', '08:00:00', '08:00:00', 'Turno completo 24hs'),
-- Farmacia Oriental: 25 al 28 de octubre
(7, '2026-10-25', '2026-10-28', '08:00:00', '08:00:00', 'Turno completo 24hs'),
-- Farmacia Villa del Parque: 29 al 31 de octubre
(8, '2026-10-29', '2026-10-31', '08:00:00', '08:00:00', 'Turno completo 24hs');

-- ============================================================
-- USUARIO ADMINISTRADOR
-- Usuario: admin
-- Contraseña: admin123
-- Hash generado con password_hash('admin123', PASSWORD_DEFAULT) en PHP
-- ============================================================
INSERT INTO administradores (usuario, contrasena) VALUES
('admin', '$2y$10$YvX7gKk0vAQqVHMk5Tq.Z.fRTm3TJdtBTMgTXXBz3fN3DPa2xuIOu');

-- ============================================================
-- FIN DEL ARCHIVO SQL
-- Para importar: phpMyAdmin > Importar > Seleccionar este archivo
-- ============================================================
