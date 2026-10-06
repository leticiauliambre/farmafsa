<?php
// ============================================================
// Archivo: backend/api/turnos.php
// Descripción: Endpoint PÚBLICO para consultar farmacias de turno
//
// ¿Cómo funciona?
// React envía una fecha, PHP busca en MySQL qué farmacias
// tienen turno en esa fecha y devuelve los resultados en JSON.
//
// Ejemplo de uso:
//   GET /api/turnos.php?fecha=2026-10-06
//   GET /api/turnos.php?fecha=hoy   (usa la fecha actual del servidor)
// ============================================================

require_once '../config/cors.php';
require_once '../config/db.php';

// Solo aceptar solicitudes GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido.']);
    exit;
}

// Obtener la fecha enviada por React
$fechaParam = isset($_GET['fecha']) ? trim($_GET['fecha']) : '';

// Si no se envió fecha, o se envió 'hoy', usar la fecha actual de Argentina
if ($fechaParam === '' || $fechaParam === 'hoy') {
    // Configurar la zona horaria de Argentina
    date_default_timezone_set('America/Argentina/Buenos_Aires');
    $fecha = date('Y-m-d'); // Formato: 2026-10-06
} else {
    $fecha = $fechaParam;
}

// Validar que la fecha tenga el formato correcto (YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $fecha)) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato de fecha inválido. Usá el formato AAAA-MM-DD.']);
    exit;
}

// Buscar en MySQL las farmacias que tienen turno en la fecha indicada
// La consulta JOIN une la tabla farmacias con la tabla turnos
$sql = "
    SELECT
        f.id,
        f.nombre,
        f.direccion,
        f.telefono,
        f.localidad,
        f.maps_url,
        f.foto,
        t.fecha_inicio,
        t.fecha_fin,
        t.horario_inicio,
        t.horario_fin,
        t.notas
    FROM farmacias f
    JOIN turnos t ON t.farmacia_id = f.id
    WHERE :fecha BETWEEN t.fecha_inicio AND t.fecha_fin
    ORDER BY f.nombre ASC
";

// Usar consulta preparada para evitar inyección SQL
$stmt = $pdo->prepare($sql);
$stmt->execute([':fecha' => $fecha]);
$farmacias = $stmt->fetchAll();

// Devolver el resultado en JSON
echo json_encode([
    'fecha'     => $fecha,
    'farmacias' => $farmacias,
    'total'     => count($farmacias)
]);
