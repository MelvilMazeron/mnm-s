<?php

// 🔥 Gérer les requêtes CORS preflight (OPTIONS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200);
    exit(0);
}

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
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode($infos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

// Connexion à la base de données
$pdo = getConnexion();

switch ($_SERVER["REQUEST_METHOD"]) {
    case "GET":
        // 🔹 Récupération des données
        $stmt1 = $pdo->prepare("SELECT * FROM joueurs_");
        $stmt1->execute();
        $joueurs = $stmt1->fetchAll(PDO::FETCH_ASSOC);
        $stmt1->closeCursor();

        $stmt2 = $pdo->prepare("SELECT * FROM joueurs_ WHERE id_equipe = 1");
        $stmt2->execute();
        $joueursEquipeA = $stmt2->fetchAll(PDO::FETCH_ASSOC);
        $stmt2->closeCursor();

        $stmt3 = $pdo->prepare("SELECT * FROM joueurs_ WHERE id_equipe = 2");
        $stmt3->execute();
        $joueursEquipeB = $stmt3->fetchAll(PDO::FETCH_ASSOC);
        $stmt3->closeCursor();

        $stmt4 = $pdo->prepare("SELECT * FROM equipe");
        $stmt4->execute();
        $equipes = $stmt4->fetchAll(PDO::FETCH_ASSOC);
        $stmt4->closeCursor();

        $stmt5 = $pdo->prepare("SELECT * FROM equipe WHERE id_equipe = 1");
        $stmt5->execute();
        $equipeBleu = $stmt5->fetchAll(PDO::FETCH_ASSOC);
        $stmt5->closeCursor();

        $stmt6 = $pdo->prepare("SELECT * FROM equipe WHERE id_equipe = 2");
        $stmt6->execute();
        $equipeRouge = $stmt6->fetchAll(PDO::FETCH_ASSOC);
        $stmt6->closeCursor();

        sendJSON([
            "joueurs" => $joueurs,
            "joueursEquipeA" => $joueursEquipeA,
            "joueursEquipeB" => $joueursEquipeB,
            "equipes" => $equipes,
            "equipeBleu" => $equipeBleu,
            "equipeRouge" => $equipeRouge
        ]);
        break;

    case "POST":
        // 🔹 Ajout d’un joueur
        $data = json_decode(file_get_contents("php://input"), true);

        $pseudo = $data["pseudo"] ?? null;
        $equipe = $data["equipe"] ?? null;

        // On prend ce que le frontend envoie si c’est dispo, sinon fallback
        $id_partie = $data["id_partie"] ?? 1;
        $id_role = $data["id_role"] ?? 1;
        $id_equipe = $data["id_equipe"] ?? (($equipe === "left") ? 1 : 2);

        if ($pseudo && $id_partie && $id_role && $id_equipe) {
            $stmt = $pdo->prepare("INSERT INTO joueurs_ (joueur_nom, id_partie, id_role, id_equipe) VALUES (?, ?, ?, ?)");
            $stmt->execute([$pseudo, $id_partie, $id_role, $id_equipe]);
            sendJSON(["success" => true]);
        } else {
            http_response_code(400);
            sendJSON(["error" => "Données invalides"]);
        }
        break;

    case "PUT":
        // 🔹 Changement d’équipe d'un joueur
        $data = json_decode(file_get_contents("php://input"), true);

        $pseudo = $data["pseudo"] ?? null;
        $newTeam = $data["newTeam"] ?? null;

        if ($pseudo && $newTeam) {
            // On attribue l'équipe correspondante
            $id_equipe = $newTeam === "left" ? 1 : 2;

            // Mise à jour de l'équipe dans la base de données
            $stmt = $pdo->prepare("UPDATE joueurs_ SET id_equipe = ? WHERE joueur_nom = ?");
            $stmt->execute([$id_equipe, $pseudo]);
            
            sendJSON(["success" => true]);
        } else {
            http_response_code(400);
            sendJSON(["error" => "Données invalides"]);
        }
        break;

    default:
        http_response_code(405);
        sendJSON(["error" => "Méthode non autorisée"]);
}
