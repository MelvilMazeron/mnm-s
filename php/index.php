<?php

// require_once("api.php");
// try {
//     if (!empty($_GET['demande'])) {
//         $url = explode("/", filter_var($_GET['demande'], FILTER_SANITIZE_URL)); // Non obligatoire, ajoute la sécurité
//         //print_r($url);
//         switch ($url[0]) {
//             case "joueurs":
//                 if (empty($url[1])) {
//                     getJoueurs();
//                 }
//                 break;
//             default:
//                 throw new Exception("La demande n'est pas valide, vérifiez l'url");
//         }
//     } else {
//         throw new Exception("Problème de récupération de données");
//     }
// } catch (Exception $e) {
//     $erreur = [
//         "message" => $e->getMessage(),
//         "code" => $e->getCode()
//     ];
//     print_r($erreur);
// }
