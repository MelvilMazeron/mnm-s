"use client";

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

export default function VueSpectateurScore() {
  const [joueursEquipeA, setJoueursEquipeA] = useState<Joueur[]>([]);
  const [joueursEquipeB, setJoueursEquipeB] = useState<Joueur[]>([]);
  const [equipes, setEquipes] = useState<Equipe[]>([]);  // Changement ici
  const [equipeBleu, setEquipeBleu] = useState<Equipe[]>([]);
  const [equipeRouge, setEquipeRouge] = useState<Equipe[]>([]);
  const [equipeClassement, setEquipeClassement] = useState<Equipe[]>([]);
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

  return (
    <div className="flex min-h-screen text-white bg-black p-6">
  {/* Équipe A */}
  <div className="w-1/2 flex flex-col items-start p-4 border-r border-gray-700">
    {equipeBleu.map((equipe) => (
      <h2 className="text-2xl font-bold mb-4" key={equipe.id_equipe}>
        {equipe.equipe_nom}
      </h2>
    ))}
    {equipeBleu.map((equipe) => (
      <h3 className="text-lg mb-4" key={`score-${equipe.id_equipe}`}>
        Score : {equipe.equipe_score}
      </h3>
    ))}
    <div className="p-6 border-2 bg-blue-500 rounded-lg w-60">
      <table>
        <thead>
          <tr>
            <th className="text-left">Joueurs</th>
          </tr>
        </thead>
        <tbody>
          {joueursEquipeA.map((joueur) => (
            <tr key={joueur.id_joueur}>
              <td>{joueur.joueur_nom}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="w-1/2 p-4 border-2 bg-black text-white rounded shadow-md mr-2 mt-[20px]">
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

  {/* Équipe B */}
  <div className="w-1/2 flex flex-col items-start p-4">
    {equipeRouge.map((equipe) => (
      <h2 className="text-2xl font-bold mb-4" key={equipe.id_equipe}>
        {equipe.equipe_nom}
      </h2>
    ))}
    {equipeRouge.map((equipe) => (
      <h3 className="text-lg mb-4" key={`score-${equipe.id_equipe}`}> {/* Utilisation d'une clé unique */}
        Score : {equipe.equipe_score}
      </h3>
    ))}
    <div className="p-6 border-2 bg-red-500 rounded-lg w-60">
      <table>
        <thead>
          <tr>
            <th className="text-left">Joueurs</th>
          </tr>
        </thead>
        <tbody>
          {joueursEquipeB.map((joueur) => (
            <tr key={joueur.id_joueur}>
              <td>{joueur.joueur_nom}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="w-1/2 p-4 border-2 bg-black text-white rounded shadow-md mr-2 mt-[20px]">
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
</div>
  );
}
