<?php

// Affiche toutes les erreurs PHP pour debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Gère les pré-requêtes CORS (OPTIONS)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200);
    exit();
}

// Headers CORS pour toutes les requêtes
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Connexion base de données
function getConnexion()
{
    try {
        return new PDO("mysql:host=localhost;dbname=mnm;charset=utf8", "root", "");
    } catch (PDOException $e) {
        die(json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]));
    }
}

// Répondre en JSON
function sendJSON($infos)
{
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode($infos, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}

// Connexion
$pdo = getConnexion();

// Router en fonction de la méthode HTTP
switch ($_SERVER["REQUEST_METHOD"]) {
    case "GET":
        // Récupération des joueurs et de leur rôle
        $stmt1 = $pdo->prepare("SELECT * FROM joueurs_");
        $stmt1->execute();
        $joueurs = $stmt1->fetchAll(PDO::FETCH_ASSOC);
        $stmt1->closeCursor();

        // Joueurs équipe A
        $stmt2 = $pdo->prepare("SELECT * FROM joueurs_ WHERE id_equipe = 1");
        $stmt2->execute();
        $joueursEquipeA = $stmt2->fetchAll(PDO::FETCH_ASSOC);
        $stmt2->closeCursor();

        // Joueurs équipe B
        $stmt3 = $pdo->prepare("SELECT * FROM joueurs_ WHERE id_equipe = 2");
        $stmt3->execute();
        $joueursEquipeB = $stmt3->fetchAll(PDO::FETCH_ASSOC);
        $stmt3->closeCursor();

        // Toutes les équipes
        $stmt4 = $pdo->prepare("SELECT * FROM equipe");
        $stmt4->execute();
        $equipes = $stmt4->fetchAll(PDO::FETCH_ASSOC);
        $stmt4->closeCursor();

        // Détail équipe A
        $stmt5 = $pdo->prepare("SELECT * FROM equipe WHERE id_equipe = 1");
        $stmt5->execute();
        $equipeBleu = $stmt5->fetchAll(PDO::FETCH_ASSOC);
        $stmt5->closeCursor();

        // Détail équipe B
        $stmt6 = $pdo->prepare("SELECT * FROM equipe WHERE id_equipe = 2");
        $stmt6->execute();
        $equipeRouge = $stmt6->fetchAll(PDO::FETCH_ASSOC);
        $stmt6->closeCursor();

        // Classement des équipes (score décroissant)
        $stmt7 = $pdo->prepare("SELECT * FROM equipe ORDER BY equipe_score DESC");
        $stmt7->execute();
        $equipeClassement = $stmt7->fetchAll(PDO::FETCH_ASSOC);
        $stmt7->closeCursor();

        // Bugs connus
        $stmt8 = $pdo->prepare("SELECT * FROM bug");
        $stmt8->execute();
        $bugs = $stmt8->fetchAll(PDO::FETCH_ASSOC);
        $stmt8->closeCursor();

        // Récupère les informations du bug à l'id 1
        $stmt9 = $pdo->prepare("SELECT * FROM bug WHERE id_bug = 1");
        $stmt9->execute();
        $php = $stmt9->fetchAll(PDO::FETCH_ASSOC);
        $stmt9->closeCursor();

        // Récupère les informations du bug à l'id 2
        $stmt10 = $pdo->prepare("SELECT * FROM bug WHERE id_bug = 2");
        $stmt10->execute();
        $js = $stmt10->fetchAll(PDO::FETCH_ASSOC);
        $stmt10->closeCursor();

        // Récupère les informations du bug à l'id 3
        $stmt11 = $pdo->prepare("SELECT * FROM bug WHERE id_bug = 3");
        $stmt11->execute();
        $cplusplus = $stmt11->fetchAll(PDO::FETCH_ASSOC);
        $stmt11->closeCursor();

        // Récupère les informations du bug à l'id 4
        $stmt12 = $pdo->prepare("SELECT * FROM bug WHERE id_bug = 4");
        $stmt12->execute();
        $csharp = $stmt12->fetchAll(PDO::FETCH_ASSOC);
        $stmt12->closeCursor();

        // Récupère les informations du bug à l'id 5
        $stmt13 = $pdo->prepare("SELECT * FROM bug WHERE id_bug = 5");
        $stmt13->execute();
        $mobile = $stmt13->fetchAll(PDO::FETCH_ASSOC);
        $stmt13->closeCursor();

        // Renvoyer toutes les données
        sendJSON([
            "joueurs" => $joueurs,
            "joueursEquipeA" => $joueursEquipeA,
            "joueursEquipeB" => $joueursEquipeB,
            "equipes" => $equipes,
            "equipeBleu" => $equipeBleu,
            "equipeRouge" => $equipeRouge,
            "equipeClassement" => $equipeClassement,
            "bugs" => $bugs,
            "php" => $php,
            "js" => $js,
            "cplusplus" => $cplusplus,
            "csharp" => $csharp,
            "mobile" => $mobile
        ]);
        break;

    case "POST":
        // Ajouter un joueur
        $data = json_decode(file_get_contents("php://input"), true);

        $pseudo = $data["pseudo"] ?? null;
        $id_role = $data["id_role"] ?? null; // l'id du rôle (1 à 5 par ex)
        $equipe = $data["equipe"] ?? null;   // left ou right

        if (!$id_role) {
            http_response_code(400);
            sendJSON(["error" => "Le rôle est obligatoire."]);
            exit;
        }

        $id_equipe = $data["id_equipe"] ?? (($equipe === "left") ? 1 : 2);

        if ($pseudo && $id_role && $id_equipe) {
            $stmt = $pdo->prepare("INSERT INTO joueurs_ (joueur_nom, id_role, id_equipe) VALUES (?, ?, ?)");
            $stmt->execute([$pseudo, $id_role, $id_equipe]);

            sendJSON(["success" => true, "message" => "Joueur ajouté avec succès"]);
        } else {
            http_response_code(400);
            sendJSON(["error" => "Données invalides pour ajouter un joueur"]);
        }
        break;

    case "PUT":
        // Changer un joueur d'équipe
        $data = json_decode(file_get_contents("php://input"), true);

        $pseudo = $data["pseudo"] ?? null;
        $newTeam = $data["newTeam"] ?? null;

        if ($pseudo && $newTeam) {
            $id_equipe = ($newTeam === "left") ? 1 : 2;

            $stmt = $pdo->prepare("UPDATE joueurs_ SET id_equipe = ? WHERE joueur_nom = ?");
            $stmt->execute([$id_equipe, $pseudo]);

            sendJSON(["success" => true, "message" => "Changement d'équipe effectué"]);
        } else {
            http_response_code(400);
            sendJSON(["error" => "Données invalides pour changement d'équipe"]);
        }
        break;

    default:
        http_response_code(405);
        sendJSON(["error" => "Méthode non autorisée"]);
        break;
}

?>
