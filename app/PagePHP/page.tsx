"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Equipe {
  id_equipe: number;
  equipe_nom: string;
  equipe_score: number;
  id_score: number;
}

interface Bug {
  id_bug: number;
  bug_nom: string;
  bug_codeinitial: string;
  bug_reponse: string;
}

export default function PagePHP() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const teamParam = searchParams.get("team");

  const [currentTeamId, setCurrentTeamId] = useState<1 | 2>(1);
  const [codePhp, setCodePhp] = useState('');
  const [correctPhp, setCorrectPhp] = useState('');
  const [isVictoryPhp, setIsVictoryPhp] = useState(false);
  const [equipeBleu, setEquipeBleu] = useState<Equipe[]>([]);
  const [equipeRouge, setEquipeRouge] = useState<Equipe[]>([]);

  useEffect(() => {
    if (teamParam === "rouge") setCurrentTeamId(2);
    else if (teamParam === "bleu") setCurrentTeamId(1);
  }, [teamParam]);

  // Récupération des équipes et du bug
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8000/php/api.php");
        const data = await response.json();

        setEquipeBleu(data.equipeBleu);
        setEquipeRouge(data.equipeRouge);

        const bugPhp = data.bugs.find((bug: Bug) => bug.id_bug === 1);
        if (bugPhp) {
          setCodePhp(bugPhp.bug_codeinitial);
          setCorrectPhp(bugPhp.bug_reponse);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchData();
  }, []);

  const handleCodeChange = async (newCode: string) => {
    setCodePhp(newCode);

    const cleanedUserCode = newCode.replace(/\s+/g, ' ').trim();
    const cleanedCorrectCode = correctPhp.replace(/\s+/g, ' ').trim();

    const isCorrect = cleanedUserCode === cleanedCorrectCode;
    if (!isCorrect) return;

    setIsVictoryPhp(true);

    try {
      const response = await fetch("http://localhost:8000/php/update_score.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_equipe: currentTeamId }),
      });

      const data = await response.json();
      if (data.success) {
        if (currentTeamId === 1) {
          setEquipeBleu(prev => prev.map(e => ({ ...e, equipe_score: e.equipe_score + 1 })));
        } else {
          setEquipeRouge(prev => prev.map(e => ({ ...e, equipe_score: e.equipe_score + 1 })));
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du score:", error);
    }
  };

  useEffect(() => {
    if (!isVictoryPhp) return;
    const timer = setTimeout(() => {
      router.push(currentTeamId === 1 ? "/EquipeA" : "/EquipeB");
    }, 5000);
    return () => clearTimeout(timer);
  }, [isVictoryPhp, router, currentTeamId]);

  const CorrectionDisplay = () => (
    <pre className="text-white whitespace-pre-wrap">{correctPhp}</pre>
  );

  if (isVictoryPhp) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="border-2 border-green-500 rounded-lg p-6 bg-gray-800 max-w-md">
          <CorrectionDisplay />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Bug Hunter Arena</h1>

      <div className="flex flex-col items-center w-full max-w-2xl">
        <img
          src="/images/logoPHP.png"
          alt="PHP Logo"
          className="w-24 h-24 mb-6 object-contain"
        />

        <textarea
          className="w-full h-64 p-4 border-2 border-gray-600 rounded-lg bg-gray-900 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
          value={codePhp}
          onChange={(e) => handleCodeChange(e.target.value)}
          spellCheck="false"
          aria-label="PHP code editor"
        />
      </div>
    </div>
  );
}
