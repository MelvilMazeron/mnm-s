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

export default function PageCPLUSPLUS() {
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [score, setScore] = useState(0);

    const [codeCPlusPlus, setCodeCPlusPlus] = useState('');
    const [correctCplusplus, setCorrectCplusplus] = useState('');
    const [isVictoryCPlusPlus, setIsVictoryCPlusPlus] = useState(false);

    // Récupérer les données du serveur
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8000/php/api.php");
                if (!response.ok) {
                    throw new Error("Erreur lors du chargement des données");
                }
                const data = await response.json();

                const bugCplusplus = data.bugs.find((bug: Bug) => bug.id_bug === 3);

                if (bugCplusplus) {
                    setCodeCPlusPlus(bugCplusplus.bug_codeinitial);
                    setCorrectCplusplus(bugCplusplus.bug_reponse);
                }
            } catch (error) {
                console.error('Erreur lors du chargement du bug C++:', error);
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
            if (data.language === 'c++') {
                setIsVictoryCPlusPlus(true);
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
        if (!isVictoryCPlusPlus) return;

        const timer = setTimeout(() => {
            router.push("/EquipeA");
        }, 5000);

        return () => clearTimeout(timer);
    }, [isVictoryCPlusPlus, router]);

    // Nettoyage du code avant de le comparer
    const handleCodeChange = (newCode: string) => {
        setCodeCPlusPlus(newCode);

        // **Meilleure gestion des espaces et retours à la ligne** pour comparer sans être sensible aux petits détails
        const cleanedUserCode = newCode
            .replace(/\s+/g, ' ')  // Remplace les espaces multiples par un seul espace
            .trim(); // Enlève les espaces au début et à la fin
        const cleanedCorrectCode = correctCplusplus
            .replace(/\s+/g, ' ')  // Même nettoyage du code correct
            .trim(); // Enlève les espaces au début et à la fin

        const isCorrect = cleanedUserCode === cleanedCorrectCode; // Comparaison nettoyée

        setIsVictoryCPlusPlus(isCorrect);

        if (isCorrect && socket) {
            setScore(prev => prev + 1);
            socket.emit('victory', { language: 'c++' });
        }
    };

    // Affichage de la correction du code
    const CPlusPlusCorrection = () => (
        <pre className="text-white whitespace-pre-wrap">
            {correctCplusplus}
        </pre>
    );

    if (isVictoryCPlusPlus) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="border-2 border-green-500 rounded-lg p-4 bg-gray-800">
                    {CPlusPlusCorrection()}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mb-5 justify-center min-h-screen text-white bg-black" id="4">
            <h1 className="text-3xl font-bold mb-6">Bug Hunter Arena</h1>
            <div className="flex flex-col items-center mb-5">
                <img className="max-w-45 mb-5" src="/images/logoC++.png" id="4" alt="" />
                <div>
                    <textarea
                        className="border-2 border-white rounded-lg p-2 text-white w-96 h-40 bg-black"
                        name="exerciceC++"
                        id="exerciceC++"
                        value={codeCPlusPlus}
                        onChange={(e) => handleCodeChange(e.target.value)}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
