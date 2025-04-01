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

function getEquipes()
{
    $pdo = getConnexion();

    $req = "SELECT id_equipe, equipe_nom, equipe_score, id_score FROM equipe";
    $stmt = $pdo->prepare($req);
    $stmt->execute();
    $equipes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $stmt->closeCursor();

    sendJSON($equipes);
}

function addJoueur()
{
    $pdo = getConnexion();
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["joueur_nom"], $data["id_partie"], $data["id_role"], $data["id_equipe"])) {
        $req = "INSERT INTO joueurs_ (joueur_nom, id_partie, id_role, id_equipe) VALUES (:joueur_nom, :id_partie, :id_role, :id_equipe)";
        $stmt = $pdo->prepare($req);
        $stmt->execute([
            ":joueur_nom" => $data["joueur_nom"],
            ":id_partie" => $data["id_partie"],
            ":id_role" => $data["id_role"],
            ":id_equipe" => $data["id_equipe"]
        ]);

        sendJSON(["message" => "Joueur ajouté avec succès"]);
    } else {
        sendJSON(["error" => "Données incomplètes"], 400);
    }
}

// Vérifie si l'API est appelée correctement
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    getJoueurs();
    getEquipes();
}
