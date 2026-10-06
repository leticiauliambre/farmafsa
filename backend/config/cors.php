<?php
// ============================================================
// Archivo: backend/config/cors.php
// Descripción: Configura los encabezados CORS
//
// ¿Qué es CORS?
// Cuando React corre en http://localhost:5173 (Vite)
// y PHP corre en http://localhost (XAMPP),
// el navegador bloquea las solicitudes entre dominios distintos.
// CORS le dice al navegador que está permitido hacer esas solicitudes.
// ============================================================

// Permitir solicitudes desde el servidor de desarrollo de React
header('Access-Control-Allow-Origin: http://localhost:5173');

// Permitir credenciales (necesario para las sesiones de PHP)
header('Access-Control-Allow-Credentials: true');

// Métodos HTTP permitidos
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Encabezados permitidos
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Las respuestas siempre serán en formato JSON
header('Content-Type: application/json; charset=utf-8');

// Cuando el navegador hace una solicitud "preflight" (OPTIONS),
// responder con 200 y terminar
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
