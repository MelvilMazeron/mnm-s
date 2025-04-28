<?php

// Affiche toutes les erreurs PHP pour debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Gère les pré-requêtes CORS (OPTIONS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
    exit();
}

// Headers CORS pour toutes les requêtes
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Connexion base de données
function getConnexion()
{
    try {
        return new PDO("mysql:host=localhost;dbname=mnm;charset=utf8", "root", "");
    } catch (PDOException $e) {
        die(json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]));
    }
}

$pdo = getConnexion();

// Seulement les requêtes POST sont acceptées
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

// Récupérer les données POST
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier si l'ID de l'équipe est présent
if (!isset($data['id_equipe'])) {
    http_response_code(400);
    echo json_encode(["error" => "ID d'équipe manquant"]);
    exit;
}

$idEquipe = (int)$data['id_equipe'];

try {
    $stmt = $pdo->prepare("SELECT equipe_score FROM equipe WHERE id_equipe = ?");
    $stmt->execute([$idEquipe]);
    $currentScore = $stmt->fetchColumn();
    
    if ($currentScore === false) {
        http_response_code(404);
        echo json_encode(["error" => "Équipe non trouvée"]);
        exit;
    }
    
    // Mettre à jour le score
    $newScore = $currentScore + 1;
    $stmt = $pdo->prepare("UPDATE equipe SET equipe_score = ? WHERE id_equipe = ?");
    $stmt->execute([$newScore, $idEquipe]);
    
    echo json_encode([
        "success" => true,
        "id_equipe" => $idEquipe,
        "new_score" => $newScore
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur de base de données : " . $e->getMessage()]);
}
?>