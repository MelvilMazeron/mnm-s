"use client"; // If using the Next.js App Router
import { useEffect, useState } from "react";

interface Equipe {
  id_equipe: number;
  equipe_nom: string;
  equipe_score: number;
  id_score: number;
}

export default function EquipeList() {
  const [equipes, setEquipes] = useState<Equipe[]>([]);
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
      .then((data: Equipe[]) => {
        setEquipes(data);
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
      <h2>Liste des Equipes</h2>
      <ul>
        {equipes.map((equipe) => (
          <li key={equipe.id_equipe}>
            {equipe.equipe_nom} (Score: {equipe.equipe_score}, Score: {equipe.id_score})
          </li>
        ))}
      </ul>
    </div>
  );
}
