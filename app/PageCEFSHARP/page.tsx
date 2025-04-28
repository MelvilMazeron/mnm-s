"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

interface Bug {
    id_bug: number;
    bug_nom: string;
    bug_codeinitial: string;
    bug_reponse: string;
}

export default function PageCEFSHARP() {
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [score, setScore] = useState(0);
    const [codeCefsharp, setCodeCefsharp] = useState('');
    const [correctCefsharp, setCorrectCefsharp] = useState('');
    const [isVictoryCefsharp, setIsVictoryCefsharp] = useState(false);

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
            } catch (error) {
                console.error('Erreur lors du chargement du bug C#:', error);
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

    // Gestion des événements socket
    useEffect(() => {
        if (!socket) return;

        const handleVictory = (data: { language: string }) => {
            if (data.language === 'csharp') {
                setIsVictoryCefsharp(true);
                setScore(prev => prev + 1);
            }
        };

        socket.on('victory', handleVictory);

        return () => {
            socket.off('victory', handleVictory);
        };
    }, [socket]);

    // Redirection après victoire
    useEffect(() => {
        if (!isVictoryCefsharp) return;

        const timer = setTimeout(() => {
            router.push("/EquipeA");
        }, 5000);

        return () => clearTimeout(timer);
    }, [isVictoryCefsharp, router]);

    const handleCodeChange = (newCode: string) => {
        setCodeCefsharp(newCode);

        // **Meilleure gestion des espaces et retours à la ligne** pour comparer sans être sensible aux petits détails
        const cleanedUserCode = newCode
            .replace(/\s+/g, ' ')  // Remplace les espaces multiples par un seul espace
            .trim(); // Enlève les espaces au début et à la fin
        const cleanedCorrectCode = correctCefsharp
            .replace(/\s+/g, ' ')  // Même nettoyage du code correct
            .trim(); // Enlève les espaces au début et à la fin

        const isCorrect = cleanedUserCode === cleanedCorrectCode; // Comparaison nettoyée

        setIsVictoryCefsharp(isCorrect);

        if (isCorrect && socket) {
            setScore(prev => prev + 1);
            socket.emit('victory', { language: 'csharp' });
        }
    };

    const CorrectionDisplay = () => (
        <pre className="text-white whitespace-pre-wrap">
            {correctCefsharp}
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