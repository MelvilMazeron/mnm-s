"use client";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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

export default function PageCEFSHARP() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const teamParam = searchParams.get("team"); // 'bleu' ou 'rouge'

    // Définir l'équipe par défaut à bleu
    const [currentTeamId, setCurrentTeamId] = useState<1 | 2>(1); // 1 = bleu par défaut

    useEffect(() => {
        if (teamParam === "rouge") {
            setCurrentTeamId(2);
        } else if (teamParam === "bleu") {
            setCurrentTeamId(1);
        }
    }, [teamParam]);

    const [socket, setSocket] = useState<Socket | null>(null);
    const [score, setScore] = useState(0);
    const [codeCefsharp, setCodeCefsharp] = useState('');
    const [correctCefsharp, setCorrectCefsharp] = useState('');
    const [isVictoryCefsharp, setIsVictoryCefsharp] = useState(false);
    const [equipeBleu, setEquipeBleu] = useState<Equipe[]>([]);
    const [equipeRouge, setEquipeRouge] = useState<Equipe[]>([]);

    // Récupérer les données des équipes et des bugs (en particulier le bug C#)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8000/php/api.php");
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des données");
                }
                const data = await response.json();

                const bugCsharp = data.bugs.find((bug: Bug) => bug.id_bug === 4);
                if (bugCsharp) {
                    setCodeCefsharp(bugCsharp.bug_codeinitial);
                    setCorrectCefsharp(bugCsharp.bug_reponse);
                }

                setEquipeBleu(data.equipeBleu);
                setEquipeRouge(data.equipeRouge);
            } catch (error) {
                console.error('Erreur lors du chargement des données C#:', error);
            }
        };

        fetchData();
    }, []);

    // Initialisation du socket
    useEffect(() => {
        const socketInstance = io('http://localhost:3001');
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    // Fonction de gestion du changement de code
    const handleCodeChange = (newCode: string) => {
        setCodeCefsharp(newCode);

        // Nettoyage des espaces et des retours à la ligne avant comparaison
        const cleanedUserCode = newCode.replace(/\s+/g, ' ').trim();
        const cleanedCorrectCode = correctCefsharp.replace(/\s+/g, ' ').trim();

        // Comparaison du code nettoyé
        const isCorrect = cleanedUserCode === cleanedCorrectCode;
        setIsVictoryCefsharp(isCorrect);

        if (isCorrect && socket) {
            setScore(prev => prev + 1);
            socket.emit('victory', { language: 'csharp', winningTeam: currentTeamId });
        }
    };

    // Effet de gestion de la victoire et redirection
    useEffect(() => {
        if (!isVictoryCefsharp) return;

        const timer = setTimeout(() => {
            router.push(currentTeamId === 1 ? "/EquipeA" : "/EquipeB");
        }, 5000);

        return () => clearTimeout(timer);
    }, [isVictoryCefsharp, router, currentTeamId]);

    const CorrectionDisplay = () => (
        <pre className="text-white whitespace-pre-wrap">
            {correctCefsharp}
        </pre>
    );

    // Rendu conditionnel si la victoire est trouvée
    if (isVictoryCefsharp) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="border-2 border-green-500 rounded-lg p-6 bg-gray-800 max-w-2xl">
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
                    src="/images/logoCEFSHARP.png" 
                    alt="C# Logo" 
                    className="w-24 h-24 mb-6 object-contain"
                />
                
                <textarea
                    className="w-full h-64 p-4 border-2 border-gray-600 rounded-lg bg-gray-900 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                    value={codeCefsharp}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    spellCheck="false"
                    aria-label="C# code editor"
                />
            </div>
        </div>
    );
}
