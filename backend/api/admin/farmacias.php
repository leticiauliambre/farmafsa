<?php
// ============================================================
// Archivo: backend/api/admin/farmacias.php
// Descripción: CRUD de farmacias para el panel administrativo
// PROTEGIDO: Solo accesible con sesión activa de administrador
//
// Métodos disponibles:
//   GET    → listar todas las farmacias
//   POST   → crear una farmacia nueva
//   PUT    → editar una farmacia existente
//   DELETE → eliminar una farmacia
// ============================================================

require_once '../../config/cors.php';
require_once '../../config/db.php';
require_once '../../config/auth.php';

// Verificar que el administrador esté autenticado (obligatorio)
verificarAdmin();

$metodo = $_SERVER['REQUEST_METHOD'];

// ============================================================
// GET: Listar todas las farmacias
// ============================================================
if ($metodo === 'GET') {
    $sql = "SELECT * FROM farmacias ORDER BY nombre ASC";
    $stmt = $pdo->query($sql);
    $farmacias = $stmt->fetchAll();
    echo json_encode($farmacias);
    exit;
}

// ============================================================
// POST: Crear una farmacia nueva
// ============================================================
if ($metodo === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);

    // Validar campo obligatorio
    if (empty($datos['nombre'])) {
        http_response_code(400);
        echo json_encode(['error' => 'El nombre de la farmacia es obligatorio.']);
        exit;
    }

    $sql = "
        INSERT INTO farmacias (nombre, direccion, telefono, localidad, maps_url, foto)
        VALUES (:nombre, :direccion, :telefono, :localidad, :maps_url, :foto)
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':nombre'    => trim($datos['nombre']),
        ':direccion' => $datos['direccion'] ?? null,
        ':telefono'  => $datos['telefono']  ?? null,
        ':localidad' => $datos['localidad'] ?? 'Formosa Capital',
        ':maps_url'  => $datos['maps_url']  ?? null,
        ':foto'      => $datos['foto']      ?? null,
    ]);

    $nuevoId = $pdo->lastInsertId();
    http_response_code(201); // 201 = Creado
    echo json_encode(['ok' => true, 'id' => $nuevoId, 'mensaje' => 'Farmacia creada correctamente.']);
    exit;
}

// ============================================================
// PUT: Editar una farmacia existente
// ============================================================
if ($metodo === 'PUT') {
    $datos = json_decode(file_get_contents('php://input'), true);

    // Validar campos obligatorios
    if (empty($datos['id']) || empty($datos['nombre'])) {
        http_response_code(400);
        echo json_encode(['error' => 'El ID y el nombre de la farmacia son obligatorios.']);
        exit;
    }

    $sql = "
        UPDATE farmacias
        SET
            nombre    = :nombre,
            direccion = :direccion,
            telefono  = :telefono,
            localidad = :localidad,
            maps_url  = :maps_url,
            foto      = :foto
        WHERE id = :id
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id'        => $datos['id'],
        ':nombre'    => trim($datos['nombre']),
        ':direccion' => $datos['direccion'] ?? null,
        ':telefono'  => $datos['telefono']  ?? null,
        ':localidad' => $datos['localidad'] ?? 'Formosa Capital',
        ':maps_url'  => $datos['maps_url']  ?? null,
        ':foto'      => $datos['foto']      ?? null,
    ]);

    echo json_encode(['ok' => true, 'mensaje' => 'Farmacia actualizada correctamente.']);
    exit;
}

// ============================================================
// DELETE: Eliminar una farmacia
// ============================================================
if ($metodo === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de farmacia inválido.']);
        exit;
    }

    $sql = "DELETE FROM farmacias WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':id' => $id]);

    echo json_encode(['ok' => true, 'mensaje' => 'Farmacia eliminada correctamente.']);
    exit;
}

// Método no permitido
http_response_code(405);
echo json_encode(['error' => 'Método no permitido.']);
