<?php

// 🔥 Gérer les requêtes CORS preflight (OPTIONS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT");
    header("Access-Control-Allow-Headers: Content-Type");
    http_response_code(200);
    exit(0);
}

// Génération d'une connexion à la base de données

function getConnexion()
{
    try {
        return new PDO("mysql:host=localhost;dbname=mnm;charset=utf8", "root", "");   /*mysql:host=localhost;dbname=mnm;charset=utf8", "root", ""   mysql:host=cloud3.googiehost.com;dbname=biblioth_mnm;charset=utf8", "testMnm", "^D2Jj0qaj^^f*/
    } catch (Exception $e) {
        die(json_encode(["error" => "Erreur de connexion : " . $e->getMessage()])); 
    }
}

// Encoder les informations de la BDD au format json pour affichage avec react

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

        // Récupération des joueurs
        $stmt1 = $pdo->prepare("SELECT * FROM joueurs_");
        $stmt1->execute();
        $joueurs = $stmt1->fetchAll(PDO::FETCH_ASSOC);
        $stmt1->closeCursor();

        // Récupération des joueurs de l'équipe A
        $stmt2 = $pdo->prepare("SELECT * FROM joueurs_ WHERE id_equipe = 1");
        $stmt2->execute();
        $joueursEquipeA = $stmt2->fetchAll(PDO::FETCH_ASSOC);
        $stmt2->closeCursor();

        // Récupération des joueurs de l'équipe B
        $stmt3 = $pdo->prepare("SELECT * FROM joueurs_ WHERE id_equipe = 2");
        $stmt3->execute();
        $joueursEquipeB = $stmt3->fetchAll(PDO::FETCH_ASSOC);
        $stmt3->closeCursor();

        // Récupération des équipes
        $stmt4 = $pdo->prepare("SELECT * FROM equipe");
        $stmt4->execute();
        $equipes = $stmt4->fetchAll(PDO::FETCH_ASSOC);
        $stmt4->closeCursor();

        // Récupération de l'équipe A
        $stmt5 = $pdo->prepare("SELECT * FROM equipe WHERE id_equipe = 1");
        $stmt5->execute();
        $equipeBleu = $stmt5->fetchAll(PDO::FETCH_ASSOC);
        $stmt5->closeCursor();

        // Récupération de l'équipe B
        $stmt6 = $pdo->prepare("SELECT * FROM equipe WHERE id_equipe = 2");
        $stmt6->execute();
        $equipeRouge = $stmt6->fetchAll(PDO::FETCH_ASSOC);
        $stmt6->closeCursor();

        // Récupération des équipes en fonction du score ici du plus grand au plus petit pour le classement
        $stmt7 = $pdo->prepare("SELECT * FROM equipe ORDER BY equipe_score DESC");
        $stmt7->execute();
        $equipeClassement = $stmt7->fetchAll(PDO::FETCH_ASSOC);
        $stmt7->closeCursor();

        // Récupération des bug pour afficher les bugs avec erreur et leur solution
        $stmt8 = $pdo->prepare("SELECT * FROM bug");
        $stmt8->execute();
        $bugs = $stmt8->fetchAll(PDO::FETCH_ASSOC);
        $stmt8->closeCursor();

        sendJSON([
            "joueurs" => $joueurs,
            "joueursEquipeA" => $joueursEquipeA,
            "joueursEquipeB" => $joueursEquipeB,
            "equipes" => $equipes,
            "equipeBleu" => $equipeBleu,
            "equipeRouge" => $equipeRouge,
            "equipeClassement" => $equipeClassement,
            "bugs" => $bugs
        ]);
        break;

    case "POST":
        // 🔹 Ajout d’un joueur
        $data = json_decode(file_get_contents("php://input"), true);

        $pseudo = $data["pseudo"] ?? null;
        $equipe = $data["equipe"] ?? null;

        // On prend ce que le frontend envoie si c’est dispo, sinon fallback
        // $id_partie = $data["id_partie"] ?? 1;
        $id_role = $data["id_role"] ?? null;
        $id_equipe = $data["id_equipe"] ?? (($equipe === "left") ? 1 : 2);

        if ($pseudo && $id_role && $id_equipe) {
            $stmt = $pdo->prepare("INSERT INTO joueurs_ (joueur_nom, id_role, id_equipe) VALUES (?, ?, ?)");
            $stmt->execute([$pseudo, $id_role, $id_equipe]);
        
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
