"use client";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

interface Equipe {
  id_equipe: number;
  equipe_nom: string;
  equipe_score: number;
  id_score: number;
}

export default function PagePHP() {
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [codePhp, setCodePhp] = useState(
        `<?php\n$name = "Alice"\necho "Bonjour " . $name;\n?>`
    );
    const [isVictoryPhp, setIsVictoryPhp] = useState(false);
    
    // États des équipes
    const [equipeBleu, setEquipeBleu] = useState<Equipe[]>([]);
    const [equipeRouge, setEquipeRouge] = useState<Equipe[]>([]);

    const correctPhp = `<?php 
    $name = "Alice"; 
    echo "Bonjour " . $name; 
    ?>`;

    useEffect(() => {
        const fetchEquipes = async () => {
            try {
                const response = await fetch("http://localhost:8000/php/api.php");
                const data = await response.json();
                setEquipeBleu(data.equipeBleu);
                setEquipeRouge(data.equipeRouge);
            } catch (error) {
                console.error("Erreur lors du chargement des équipes:", error);
            }
        };

        fetchEquipes();
    }, []);

    useEffect(() => {
        const socketInstance = io('http://localhost:3001');
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const handleCodeChange = async (newCode: string) => {
        setCodePhp(newCode);
    
        const isCorrect = newCode === correctPhp;
        if (!isCorrect) return; // Si ce n'est pas correct, on sort directement
    
        setIsVictoryPhp(true);
    
        const idEquipeGagnante = determineWinningTeam(); // 1 ou 2
        console.log("Équipe gagnante déterminée :", idEquipeGagnante);
    
        try {
            const response = await fetch("http://localhost:8000/php/update_score.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_equipe: idEquipeGagnante }),
            });
    
            const data = await response.json();
            console.log("Réponse API update_score :", data);
    
            if (data.success && socket) {
                socket.emit('victory', { 
                    language: 'php',
                    winningTeam: idEquipeGagnante 
                });
    
                if (idEquipeGagnante === 1) {
                    setEquipeBleu(prevState => 
                        prevState.map(equipe => ({
                            ...equipe,
                            equipe_score: equipe.equipe_score + 1 // on augmente de 1 localement
                        }))
                    );
                } else if (idEquipeGagnante === 2) {
                    setEquipeRouge(prevState => 
                        prevState.map(equipe => ({
                            ...equipe,
                            equipe_score: equipe.equipe_score + 1
                        }))
                    );
                }
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour du score:", error);
        }
    };
    
    
    function determineWinningTeam(currentTeamId?: number): 1 | 2 {
        if (currentTeamId === 1 || currentTeamId === 2) {
            return currentTeamId;
        }
    
        const currentPath = window.location.pathname.toLowerCase();
    
        if (currentPath.includes("/equipea") || currentPath.includes("/bleu")) {
            return 1; // Equipe Bleue
        } 
        if (currentPath.includes("/equipeb") || currentPath.includes("/rouge")) {
            return 2; // Equipe Rouge
        }
        
        console.warn("Chemin inconnu, retour par défaut équipe 1 (bleu)");
        return 1; 
    }

    useEffect(() => {
        if (!isVictoryPhp) return;
    
        const timer = setTimeout(() => {
            router.push(determineWinningTeam() === 1 ? "/EquipeA" : "/EquipeB");
        }, 5000);
    
        return () => clearTimeout(timer);
    }, [isVictoryPhp, router]);

    const CorrectionDisplay = () => (
        <pre className="text-white">
            {`<?php\n$name = "Alice"`}
            <span className="text-red-500">;</span>
            {`\necho "Bonjour " . $name;\n?>`}
        </pre>
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