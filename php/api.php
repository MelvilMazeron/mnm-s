<?php

function getConnexion()
{
    try {
        return new PDO("mysql:host=localhost;dbname=mnm;charset=utf8", "root", "");
    } catch (Exception $e) {
        die(json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]));
    }
}

function sendJSON($infos)
{
    header("Access-Control-Allow-Origin: *"); // Permet l'accès CORS
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode($infos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

function getJoueurs()
{
    $pdo = getConnexion();

    $req = "SELECT id_joueur, joueur_nom, id_partie, id_role, id_equipe FROM joueurs_";
    $stmt = $pdo->prepare($req);
    $stmt->execute();
    $joueurs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stmt->closeCursor();

    sendJSON($joueurs);
}

// Vérifie si l'API est appelée correctement
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    getJoueurs();
}
