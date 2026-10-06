<?php
// ============================================================
// Archivo: backend/api/admin/logout.php
// Descripción: Cierra la sesión del administrador
// ============================================================

require_once '../../config/cors.php';

session_start();

// Destruir todos los datos de la sesión
$_SESSION = [];
session_destroy();

echo json_encode(['ok' => true, 'mensaje' => 'Sesión cerrada correctamente.']);
