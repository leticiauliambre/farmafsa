<?php
// ============================================================
// Archivo: backend/config/db.php
// Descripción: Conexión a la base de datos MySQL usando PDO
// PDO es la forma recomendada en PHP para conectarse a MySQL.
// Permite usar consultas preparadas, que son más seguras.
// ============================================================

$host      = 'localhost';      // Servidor de base de datos (XAMPP usa localhost)
$dbname    = 'farmacias_turno'; // Nombre de la base de datos
$usuario   = 'root';           // Usuario de MySQL (en XAMPP el default es root)
$contrasena = '';               // Contraseña de MySQL (en XAMPP suele estar vacía)

try {
    // Intentar conectar a MySQL
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $usuario,
        $contrasena
    );

    // Configurar PDO para que muestre errores cuando haya un problema
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Devolver arrays asociativos por defecto (más fácil de usar)
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    // Si la conexión falla, devolver error en JSON
    // No mostrar el error técnico al usuario final
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'No se pudo conectar a la base de datos.']);
    exit;
}
