"use client";

import React from 'react';
import { useEffect, useState } from "react";

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
  const [joueursEquipeA, setJoueursEquipeA] = useState<Joueur[]>([]);
  const [joueursEquipeB, setJoueursEquipeB] = useState<Joueur[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);  // Changement ici
  const [equipeBleu, setEquipeBleu] = useState<Equipe[]>([]);
  const [equipeRouge, setEquipeRouge] = useState<Equipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
        setEquipes(data.equipes);  // Ajoutez cette ligne pour remplir les équipes
        setEquipeBleu(data.equipeBleu);
        setEquipeRouge(data.equipeRouge);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  let joueursListe = [];
  for (let i = 0; i < Math.min(joueursEquipeA.length, 5); i++) {
    joueursListe.push(
      <li key={joueursEquipeA[i].id_joueur}>{joueursEquipeA[i].joueur_nom}</li>
    );
  }

  return (
    <div className="bg-blue-400 min-h-screen p-4">
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
      <div className="flex">
        <div className="w-1/2 p-4 bg-white text-black rounded shadow-md mr-2">
          <h2 className="text-lg font-bold mb-2">Composition équipe</h2>
          <ul>
            {joueursListe}
          </ul>
        </div>
        <div className="w-1/2 p-4 bg-white text-black rounded shadow-md ml-2">
          <h2 className="text-lg font-bold mb-2">Affichage des bugs à résoudre</h2>
          <button className="bg-blue-500 text-white p-2 rounded">Accéder à la résolution du bug</button>
        </div>
      </div>
    </div>
  );
}

export default App;
