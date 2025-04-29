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
    const [codeCefsharp, setCodeCefsharp] = useState(
        `class Program { 
            public static void Main { 
                Console.WriteLine("Salut !"); 
            } 
        }`
    );
    const [isVictoryCefsharp, setIsVictoryCefsharp] = useState(false);

    const [equipeBleu, setEquipeBleu] = useState<Equipe[]>([]);
    const [equipeRouge, setEquipeRouge] = useState<Equipe[]>([]);

    const correctCefsharp = `class Program { 
        public static void Main() { 
            Console.WriteLine("Salut !"); 
        } 
    }`;

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

    // Initialisation du socket
    useEffect(() => {
        const socketInstance = io('http://localhost:3001');
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    const handleCodeChange = async (newCode: string) => {
        setCodeCefsharp(newCode);
    
        const isCorrect = newCode === correctCefsharp;
        if (!isCorrect) return; // Si ce n'est pas correct, on sort directement
    
        setIsVictoryCefsharp(true);
    
        const idEquipeGagnante = currentTeamId;
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
                    language: 'csharp',
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

    useEffect(() => {
        if (!isVictoryCefsharp) return;
    
        const timer = setTimeout(() => {
            router.push(currentTeamId === 1 ? "/EquipeA" : "/EquipeB");
          }, 5000);
      
        return () => clearTimeout(timer);
    }, [isVictoryCefsharp, router, currentTeamId]);

    const CorrectionDisplay = () => (
        <pre className="text-white">
            {`class Program {\n    public static void Main`}
            <span className="text-red-500">{`()`}</span>
            {` {\n        Console.WriteLine("Salut !");\n    }\n}`}
        </pre>
    );

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
