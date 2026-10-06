<?php
// ============================================================
// Archivo: backend/api/admin/login.php
// Descripción: Autenticación del administrador
//
// ¿Cómo funciona?
// React envía usuario y contraseña en formato JSON.
// PHP verifica contra la base de datos.
// Si los datos son correctos, crea una sesión PHP.
// La sesión guarda que el administrador está autenticado.
// ============================================================

require_once '../../config/cors.php';
require_once '../../config/db.php';

// Iniciar la sesión de PHP
session_start();

// Solo aceptar solicitudes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido.']);
    exit;
}

// Leer los datos enviados por React (vienen en formato JSON)
$datos = json_decode(file_get_contents('php://input'), true);

$usuario   = isset($datos['usuario'])   ? trim($datos['usuario'])   : '';
$contrasena = isset($datos['contrasena']) ? trim($datos['contrasena']) : '';

// Validar que los campos no estén vacíos
if ($usuario === '' || $contrasena === '') {
    http_response_code(400);
    echo json_encode(['error' => 'El usuario y la contraseña son obligatorios.']);
    exit;
}

// Buscar el administrador en la base de datos
$sql = "SELECT id, usuario, contrasena FROM administradores WHERE usuario = :usuario LIMIT 1";
$stmt = $pdo->prepare($sql);
$stmt->execute([':usuario' => $usuario]);
$admin = $stmt->fetch();

// Verificar si el usuario existe y la contraseña es correcta
// password_verify() compara la contraseña ingresada con el hash guardado en MySQL
if ($admin && password_verify($contrasena, $admin['contrasena'])) {
    // Login exitoso: guardar el ID del admin en la sesión
    $_SESSION['admin_id']      = $admin['id'];
    $_SESSION['admin_usuario'] = $admin['usuario'];

    echo json_encode([
        'ok'      => true,
        'mensaje' => 'Bienvenido, ' . $admin['usuario'],
        'usuario' => $admin['usuario']
    ]);
} else {
    // Login fallido: no especificar si el usuario o la contraseña son incorrectos
    http_response_code(401);
    echo json_encode(['error' => 'Usuario o contraseña incorrectos.']);
}
