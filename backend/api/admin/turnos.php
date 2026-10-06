<?php
// ============================================================
// Archivo: backend/api/admin/turnos.php
// Descripción: CRUD de turnos para el panel administrativo
// PROTEGIDO: Solo accesible con sesión activa de administrador
//
// Métodos disponibles:
//   GET    → listar todos los turnos
//   POST   → crear un turno nuevo
//   PUT    → editar un turno existente
//   DELETE → eliminar un turno
// ============================================================

require_once '../../config/cors.php';
require_once '../../config/db.php';
require_once '../../config/auth.php';

// Verificar que el administrador esté autenticado (obligatorio)
verificarAdmin();

$metodo = $_SERVER['REQUEST_METHOD'];

// ============================================================
// GET: Listar todos los turnos con el nombre de la farmacia
// ============================================================
if ($metodo === 'GET') {
    $sql = "
        SELECT
            t.id,
            t.farmacia_id,
            f.nombre AS farmacia_nombre,
            t.fecha_inicio,
            t.fecha_fin,
            t.horario_inicio,
            t.horario_fin,
            t.notas
        FROM turnos t
        JOIN farmacias f ON f.id = t.farmacia_id
        ORDER BY t.fecha_inicio DESC, f.nombre ASC
    ";
    $stmt = $pdo->query($sql);
    $turnos = $stmt->fetchAll();
    echo json_encode($turnos);
    exit;
}

// ============================================================
// POST: Crear un turno nuevo
// ============================================================
if ($metodo === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);

    // Validar campos obligatorios
    if (empty($datos['farmacia_id']) || empty($datos['fecha_inicio']) || empty($datos['fecha_fin'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Farmacia, fecha de inicio y fecha de fin son obligatorios.']);
        exit;
    }

    $sql = "
        INSERT INTO turnos (farmacia_id, fecha_inicio, fecha_fin, horario_inicio, horario_fin, notas)
        VALUES (:farmacia_id, :fecha_inicio, :fecha_fin, :horario_inicio, :horario_fin, :notas)
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':farmacia_id'    => intval($datos['farmacia_id']),
        ':fecha_inicio'   => $datos['fecha_inicio'],
        ':fecha_fin'      => $datos['fecha_fin'],
        ':horario_inicio' => $datos['horario_inicio'] ?? null,
        ':horario_fin'    => $datos['horario_fin']    ?? null,
        ':notas'          => $datos['notas']          ?? null,
    ]);

    $nuevoId = $pdo->lastInsertId();
    http_response_code(201);
    echo json_encode(['ok' => true, 'id' => $nuevoId, 'mensaje' => 'Turno creado correctamente.']);
    exit;
}

// ============================================================
// PUT: Editar un turno existente
// ============================================================
if ($metodo === 'PUT') {
    $datos = json_decode(file_get_contents('php://input'), true);

    if (empty($datos['id']) || empty($datos['farmacia_id']) || empty($datos['fecha_inicio']) || empty($datos['fecha_fin'])) {
        http_response_code(400);
        echo json_encode(['error' => 'ID, farmacia, fecha de inicio y fecha de fin son obligatorios.']);
        exit;
    }

    $sql = "
        UPDATE turnos
        SET
            farmacia_id    = :farmacia_id,
            fecha_inicio   = :fecha_inicio,
            fecha_fin      = :fecha_fin,
            horario_inicio = :horario_inicio,
            horario_fin    = :horario_fin,
            notas          = :notas
        WHERE id = :id
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id'             => intval($datos['id']),
        ':farmacia_id'    => intval($datos['farmacia_id']),
        ':fecha_inicio'   => $datos['fecha_inicio'],
        ':fecha_fin'      => $datos['fecha_fin'],
        ':horario_inicio' => $datos['horario_inicio'] ?? null,
        ':horario_fin'    => $datos['horario_fin']    ?? null,
        ':notas'          => $datos['notas']          ?? null,
    ]);

    echo json_encode(['ok' => true, 'mensaje' => 'Turno actualizado correctamente.']);
    exit;
}

// ============================================================
// DELETE: Eliminar un turno
// ============================================================
if ($metodo === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de turno inválido.']);
        exit;
    }

    $sql = "DELETE FROM turnos WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $id]);

    echo json_encode(['ok' => true, 'mensaje' => 'Turno eliminado correctamente.']);
    exit;
}

// Método no permitido
http_response_code(405);
echo json_encode(['error' => 'Método no permitido.']);
