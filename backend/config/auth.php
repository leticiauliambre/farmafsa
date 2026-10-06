<?php
// ============================================================
// Archivo: backend/config/auth.php
// Descripción: Verifica que el administrador esté autenticado
//
// Esta función se usa al comienzo de cada endpoint del panel admin.
// Si el usuario no tiene una sesión activa, se rechaza la solicitud.
// ============================================================

function verificarAdmin() {
    // Iniciar o retomar la sesión de PHP
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Verificar si existe la variable de sesión del administrador
    if (!isset($_SESSION['admin_id'])) {
        // El usuario no está autenticado
        http_response_code(401); // 401 = No autorizado
        echo json_encode(['error' => 'No autorizado. Iniciá sesión para continuar.']);
        exit;
    }
}
