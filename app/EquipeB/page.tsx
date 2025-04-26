"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import du router pour la redirection

// Interfaces pour les types
interface Joueur {
  id_joueur: number;
  joueur_nom: string;
  id_partie: number;
  id_role: number;
  id_equipe: number;
}

interface Equipe {
  id_equipe: number;
  equipe_nom: string;
  equipe_score: number;
  id_score: number;
}

function App() {
  const router = useRouter(); // Initialisation du router

  // États liés aux données de l'API
  const [joueursEquipeA, setJoueursEquipeA] = useState<Joueur[]>([]);
  const [joueursEquipeB, setJoueursEquipeB] = useState<Joueur[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [equipeBleu, setEquipeBleu] = useState<Equipe[]>([]);
  const [equipeRouge, setEquipeRouge] = useState<Equipe[]>([]);
  const [equipeClassement, setEquipeClassement] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Techno à tirer aléatoirement et erreurs associées
  const techsAvecErreurs = [
    {
      nom: "PHP",
      erreur: `<?php 
$name = "Alice" 
echo "Bonjour " . $name; 
?>`,
    },
    {
      nom: "JavaScript (ReactJS)",
      erreur: `import React from 'react'; 
   
function Greeting(props) { 
  return <h1>Hello {props.name</h1>; 
} 
   
export default Greeting;`,
    },
    {
      nom: "C++",
      erreur: `int main() { 
  cout << "Hello world!" << endl; 
  return 0; 
}`,
    },
    {
      nom: "C#",
      erreur: `class Program { 
    public static void Main { 
        Console.WriteLine("Salut !"); 
    } 
}`,
    },
    {
      nom: "Mobile",
      erreur: `import 'package:flutter/material.dart'; 
   
void main() { 
  runApp(MyApp()) 
} 
   
class MyApp extends StatelessWidget { 
  Widget build(BuildContext context) { 
    return MaterialApp( 
      home: Scaffold(body: Text('Hello')), 
    ); 
  } 
}`,
    },
  ];

  // Rôles disponibles (modifiés selon ta demande)
  const rolesDisponibles: { [techno: string]: string } = {
    "PHP": "Expert PHP",
    "JavaScript (ReactJS)": "Expert React",
    "C++": "Expert C++",
    "C#": "Expert C#",
    "Mobile": "Expert dev mobile",
  };

  // États pour la techno tirée, le code d'erreur, les rôles et le rôle choisi
  const [technoChoisie, setTechnoChoisie] = useState<string | null>(null);
  const [codeErreur, setCodeErreur] = useState<string | null>(null);
  const [rolesPris, setRolesPris] = useState<{ [role: string]: boolean }>({});
  const [roleAttribue, setRoleAttribue] = useState<string | null>(null);

  // Fonction appelée lors du clic sur "Lancer la partie"
  const lancerPartie = () => {
    // Tirage aléatoire de la technologie parmi celles disponibles
    const techIndex = Math.floor(Math.random() * techsAvecErreurs.length);
    const techObj = techsAvecErreurs[techIndex];

    // Mise à jour de l'état avec la techno et l'erreur choisies aléatoirement
    setTechnoChoisie(techObj.nom);
    setCodeErreur(techObj.erreur);
  };

  // Fonction de sélection d'un rôle
  const choisirRole = (nouveauRole: string) => {
    // Si le rôle est déjà pris par quelqu’un d’autre
    if (rolesPris[nouveauRole] && nouveauRole !== roleAttribue) {
      alert(`Le rôle "${nouveauRole}" est déjà pris.`);
      return;
    }

    // Copie de l'état des rôles
    const nouveauxRolesPris = { ...rolesPris };

    // Libérer l'ancien rôle
    if (roleAttribue) {
      nouveauxRolesPris[roleAttribue] = false;
    }

    // Prendre le nouveau rôle
    nouveauxRolesPris[nouveauRole] = true;

    // Mise à jour des états
    setRolesPris(nouveauxRolesPris);
    setRoleAttribue(nouveauRole);
  };

  // Chargement des données de l'API
  useEffect(() => {
    fetch("http://localhost:8000/php/api.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des joueurs");
        }
        return response.json();
      })
      .then((data) => {
        setJoueursEquipeA(data.joueursEquipeA);
        setJoueursEquipeB(data.joueursEquipeB);
        setEquipes(data.equipes);
        setEquipeBleu(data.equipeBleu);
        setEquipeRouge(data.equipeRouge);
        setEquipeClassement(data.equipeClassement);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  // Liste des joueurs équipe A (max 5)
  const joueursListe = joueursEquipeA.slice(0, 5).map((joueur) => (
    <li key={joueur.id_joueur}>{joueur.joueur_nom}</li>
  ));

  return (
    <div className="bg-red-400 min-h-screen p-4">
      {/* En-tête avec nom et score de l'équipe */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-white text-xl">
          {equipeBleu.map((equipe) => (
            <h2 className="text-2xl font-bold mb-4" key={equipe.id_equipe}>
              Nom d'équipe : {equipe.equipe_nom}
            </h2>
          ))}
        </div>
        <div className="text-white text-xl">
          {equipeBleu.map((equipe) => (
            <h2 className="text-2xl font-bold mb-4" key={equipe.id_equipe}>
              Score : {equipe.equipe_score}
            </h2>
          ))}
        </div>
      </div>

      {/* Composition d'équipe + zone bugs */}
      <div className="flex">
        <div className="w-1/2 p-4 bg-white text-black rounded shadow-md mr-2">
          <h2 className="text-lg font-bold mb-2">Composition équipe</h2>
          <ul>{joueursListe}</ul>
        </div>
        <div className="w-1/2 p-4 bg-white text-black rounded shadow-md ml-2">
          <h2 className="text-lg font-bold mb-2">Affichage des bugs à résoudre</h2>
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                if (roleAttribue === rolesDisponibles[technoChoisie ?? ""]) {
                  router.push("/resoudreexercice"); // Redirection vers la page
                } else {
                  alert("Ce n’est pas votre rôle, vous ne pouvez pas résoudre ce bug.");
                }
              }}
              disabled={!technoChoisie}
              className={`p-2 rounded w-full font-semibold ${
                roleAttribue === rolesDisponibles[technoChoisie ?? ""]
                  ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  : "bg-gray-400 text-white cursor-not-allowed"
              }`}
            >
              Accéder à la résolution du bug
            </button>
          </div>
        </div>
      </div>

      {/* Choix de rôle visible avant la partie */}
      <div className="mt-6 bg-white text-black p-4 rounded shadow-md max-w-xl mx-auto">
        <h3 className="text-xl font-bold mb-4">Choisissez un rôle</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.values(rolesDisponibles).map((role) => (
            <button
              key={role}
              disabled={rolesPris[role] && role !== roleAttribue}
              onClick={() => choisirRole(role)}
              className={`py-2 px-4 rounded font-semibold ${
                rolesPris[role] && role !== roleAttribue
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        {roleAttribue && (
          <p className="mt-4 text-green-700 font-semibold">
            Vous avez choisi : {roleAttribue}
          </p>
        )}
      </div>

      {/* Lancer la partie */}
      <div className="mt-6 text-center">
        <button
          onClick={lancerPartie}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Lancer la partie
        </button>
      </div>

      {/* Affichage du bug tiré */}
      {technoChoisie && (
        <div className="mt-6 text-left max-w-3xl mx-auto bg-white text-black p-4 rounded shadow-md">
          <h3 className="text-xl font-bold mb-2">Technologie tirée : {technoChoisie}</h3>
          <pre className="bg-gray-200 p-4 rounded text-sm overflow-x-auto">
            <code>{codeErreur}</code>
          </pre>
        </div>
      )}

      {/* Bouton d'accès à la résolution du bug */}

      <div className="w-1/2 p-4 bg-white text-black rounded shadow-md mr-2 mt-[20px]">
        <h2 className="text-2xl font-bold mb-4">Classement général</h2>
        <ul>
          {equipeClassement.map((equipe) => (
            <li className="text-lg font-bold mb-4" key={equipe.id_equipe}>
              {equipe.equipe_nom} : {equipe.equipe_score} points
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
