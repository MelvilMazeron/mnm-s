"use client"; // If using the Next.js App Router
import { useEffect, useState } from "react";

interface Joueur {
  id_joueur: number;
  joueur_nom: string;
  id_partie: number;
  id_role: number;
  id_equipe: number;
}

export default function JoueursList() {
  const [joueurs, setJoueurs] = useState<Joueur[]>([]);
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
      .then((data: Joueur[]) => {
        setJoueurs(data);
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
    <div>
      <h2>Liste des Joueurs</h2>
      <ul>
        {joueurs.map((joueur) => (
          <li key={joueur.id_joueur}>
            {joueur.joueur_nom} (Partie: {joueur.id_partie}, Rôle: {joueur.id_role}, Équipe: {joueur.id_equipe})
          </li>
        ))}
      </ul>
    </div>
  );
}
