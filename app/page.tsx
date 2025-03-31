"use client";

import { useState } from "react";

export default function TeamSelection() {
  const [team, setTeam] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-center h-screen bg-blue-300">
      <div className="flex space-x-10">
        <div className="flex flex-col items-center">
          <div className="bg-white px-4 py-2 rounded-full mb-2">Equipe Bleu</div>
          <div className="w-40 h-60 bg-cyan-400 rounded-lg"></div>
        </div>
        
        <div className="flex flex-col justify-center space-y-4">
          <button
            className="bg-gray-300 px-4 py-2 rounded shadow hover:bg-gray-400"
            onClick={() => setTeam("Bleu")}
          >
            ← Rejoindre l'équipe bleu
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded shadow hover:bg-gray-400"
            onClick={() => setTeam("Rouge")}
          >
            Rejoindre l'équipe rouge →
          </button>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-white px-4 py-2 rounded-full mb-2">Equipe Rouge</div>
          <div className="w-40 h-60 bg-red-600 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}