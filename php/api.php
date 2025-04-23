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

// Vérifie si l'API est appelée correctement
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $pdo = getConnexion();

    // Requête joueurs
    $req1 = "SELECT id_joueur, joueur_nom, id_partie, id_role, id_equipe FROM joueurs_ WHERE id_equipe";
    $stmt1 = $pdo->prepare($req1);
    $stmt1->execute();
    $joueurs = $stmt1->fetchAll(PDO::FETCH_ASSOC);
    $stmt1->closeCursor();
    
    $req2 = "SELECT joueurs_.id_joueur, joueurs_.joueur_nom, joueurs_.id_partie, joueurs_.id_role, equipe.id_equipe FROM joueurs_
    INNER JOIN equipe ON joueurs_.id_equipe = equipe.id_equipe
    WHERE equipe.id_equipe = 1";
    $stmt2 = $pdo->prepare($req2);
    $stmt2->execute();
    $joueursEquipeA = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    $stmt2->closeCursor();

    $req3 = "SELECT joueurs_.id_joueur, joueurs_.joueur_nom, joueurs_.id_partie, joueurs_.id_role, equipe.id_equipe FROM joueurs_
    INNER JOIN equipe ON joueurs_.id_equipe = equipe.id_equipe
    WHERE equipe.id_equipe = 2";
    $stmt3 = $pdo->prepare($req3);
    $stmt3->execute();
    $joueursEquipeB = $stmt3->fetchAll(PDO::FETCH_ASSOC);
    $stmt3->closeCursor();

    // Requête équipes
    $req4 = "SELECT id_equipe, equipe_nom, equipe_score, id_score FROM equipe";
    $stmt4 = $pdo->prepare($req4);
    $stmt4->execute();
    $equipes = $stmt4->fetchAll(PDO::FETCH_ASSOC);
    $stmt4->closeCursor();

    $req5 = "SELECT id_equipe, equipe_nom, equipe_score, id_score FROM equipe WHERE id_equipe = 1";
    $stmt5 = $pdo->prepare($req5);
    $stmt5->execute();
    $equipeBleu = $stmt5->fetchAll(PDO::FETCH_ASSOC);
    $stmt5->closeCursor();

    $req6 = "SELECT id_equipe, equipe_nom, equipe_score, id_score FROM equipe WHERE id_equipe = 2";
    $stmt6 = $pdo->prepare($req6);
    $stmt6->execute();
    $equipeRouge = $stmt6->fetchAll(PDO::FETCH_ASSOC);
    $stmt6->closeCursor();

    // Regroupement dans un seul JSON
    sendJSON([
        "joueurs" => $joueurs,
        "joueursEquipeA" => $joueursEquipeA,
        "joueursEquipeB" => $joueursEquipeB,
        "equipes" => $equipes,
        "equipeBleu" => $equipeBleu,
        "equipeRouge" => $equipeRouge
    ]);
}
