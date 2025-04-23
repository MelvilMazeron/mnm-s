"use client";

import { useState } from "react";

export default function HomePage() {
  const [pseudo, setPseudo] = useState("");
  const [team, setTeam] = useState<"left" | "right" | null>(null);
  const [teams, setTeams] = useState<{ left: string[]; right: string[] }>({
    left: [],
    right: [],
  });

  const handleJoinTeam = (teamSide: keyof typeof teams) => { 
    if (!pseudo.trim()) return;

    setTeams((prev) => ({
      ...prev,
      [teamSide]: [...prev[teamSide], pseudo],
    }));
    setTeam(teamSide);
  };

  const changeTeam = (teamSide: keyof typeof teams) => {
    if (!team) return;

    setTeams((prev) => {
      const newTeam = { ...prev };

      newTeam[team] = newTeam[team].filter((player) => player !== pseudo);
      newTeam[teamSide] = newTeam[teamSide].filter((player) => player !== pseudo);
      newTeam[teamSide] = [...newTeam[teamSide], pseudo];

      return newTeam;
    });

    setTeam(teamSide);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black">
      <h1 className="text-3xl font-bold mb-6">Bug Hunter Arena</h1>

      {!team && (
        <div className="mb-6">
          <label className="text-white">Entrer le pseudo</label>
          <input
            type="text"
            placeholder="Entre ton pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            className="p-2 rounded-lg border border-gray-400 text-white"
          />
        </div>
      )}

      {!team && (
        <div className="flex gap-10">
          <button
            className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
            onClick={() => handleJoinTeam("left")}
          >
            Rejoindre Équipe A
          </button>

          <button
            className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700"
            onClick={() => handleJoinTeam("right")}
          >
            Rejoindre Équipe B
          </button>
        </div>
      )}

      <div className="flex gap-20 mt-10">
        <div className="p-6 border-2 border-blue-500 rounded-lg w-60">
          <h2 className="text-xl font-bold mb-3">Équipe A</h2>
          <ul>
            {teams.left.map((player, index) => (
              <li key={index} className="text-blue-300">{player}</li>
            ))}
          </ul>
        </div>

        <button
          className="bg-black px-4 py-2 rounded shadow hover:bg-neutral-900 border-2 border-white h-fit self-center"
          onClick={() => changeTeam(team === "left" ? "right" : "left")}
        >
          <p>Changer d'équipe</p>
        </button>

        <div className="p-6 border-2 border-red-500 rounded-lg w-60">
          <h2 className="text-xl font-bold mb-3">Équipe B</h2>
          <ul>
            {teams.right.map((player, index) => (
              <li key={index} className="text-red-300">{player}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <button className="bg-white px-4 py-2 rounded-lg">
          <a href="/vueSpectateurScore" className="text-black">Aller à Vue Spectateur Score</a>
        </button>
      </div>

      {team && (
        <div className="mt-4">
          <a
            href={team === "left" ? "/EquipeA" : "/EquipeB"}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Aller vers le lobby
          </a>
        </div>
      )}
    </div>
  );
}
