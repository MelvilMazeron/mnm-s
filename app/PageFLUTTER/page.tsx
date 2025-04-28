"use client";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

interface Bug {
    id_bug: number;
    bug_nom: string;
    bug_codeinitial: string;
    bug_reponse: string;
}

export default function PageFLUTTER() {
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [score, setScore] = useState(0);
    const [codeFlutter, setCodeFlutter] = useState('');
    const [correctFlutter, setCorrectFlutter] = useState('');
    const [isVictoryFlutter, setIsVictoryFlutter] = useState(false);

    // Récupérer les données du serveur
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8000/php/api.php");
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des données");
                }
                const data = await response.json();

                const bugFlutter = data.bugs.find((bug: Bug) => bug.id_bug === 5);

                if (bugFlutter) {
                    setCodeFlutter(bugFlutter.bug_codeinitial);
                    setCorrectFlutter(bugFlutter.bug_reponse);
                }
            } catch (error) {
                console.error('Erreur lors du chargement du bug Flutter:', error);
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
            if (data.language === 'flutter') {
                setIsVictoryFlutter(true);
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
        if (!isVictoryFlutter) return;

        const timer = setTimeout(() => {
            router.push("/EquipeA");
        }, 5000);

        return () => clearTimeout(timer);
    }, [isVictoryFlutter, router]);

    // Nettoyage du code avant de le comparer
    const handleCodeChange = (newCode: string) => {
        setCodeFlutter(newCode);

        // **Meilleure gestion des espaces et retours à la ligne** pour comparer sans être sensible aux petits détails
        const cleanedUserCode = newCode
            .replace(/\s+/g, ' ')  // Remplace les espaces multiples par un seul espace
            .trim(); // Enlève les espaces au début et à la fin
        const cleanedCorrectCode = correctFlutter
            .replace(/\s+/g, ' ')  // Même nettoyage du code correct
            .trim(); // Enlève les espaces au début et à la fin

        const isCorrect = cleanedUserCode === cleanedCorrectCode; // Comparaison nettoyée

        setIsVictoryFlutter(isCorrect);

        if (isCorrect && socket) {
            setScore(prev => prev + 1);
            socket.emit('victory', { language: 'flutter' });
        }
    };

    // Affichage de la correction du code
    const CorrectionDisplay = () => (
        <pre className="text-white whitespace-pre-wrap">
            {correctFlutter}
        </pre>
    );

    if (isVictoryFlutter) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="border-2 border-green-500 rounded-lg p-4 bg-gray-800 max-w-4xl">
                    <CorrectionDisplay />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
            <h1 className="text-3xl font-bold mb-6">Bug Hunter Arena</h1>
            <div className="flex flex-col items-center w-full max-w-2xl">
                <img 
                    src="/images/logoFLUTTER.png" 
                    alt="Flutter Logo" 
                    className="w-24 h-24 mb-6 object-contain"
                />
                <textarea
                    className="w-full h-64 p-4 border-2 border-white rounded-lg bg-black font-mono text-sm"
                    value={codeFlutter}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    spellCheck="false"
                />
            </div>
        </div>
    );
}
