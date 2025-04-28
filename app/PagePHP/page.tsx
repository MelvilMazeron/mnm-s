"use client";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function PagePHP() {
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [score, setScore] = useState(0);
    const [codePhp, setCodePhp] = useState(
        `<?php\n$name = "Alice"\necho "Bonjour " . $name;\n?>`
    );
    const [isVictoryPhp, setIsVictoryPhp] = useState(false);

    const correctPhp = `<?php 
    $name = "Alice"; 
    echo "Bonjour " . $name; 
    ?>`;

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
            if (data.language === 'php') {
                setIsVictoryPhp(true);
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
        if (!isVictoryPhp) return;

        const timer = setTimeout(() => {
            router.push("/EquipeA");
        }, 5000);

        return () => clearTimeout(timer);
    }, [isVictoryPhp, router]);

    const handleCodeChange = (newCode: string) => {
        setCodePhp(newCode);
        const isCorrect = newCode === correctPhp;
        setIsVictoryPhp(isCorrect);
        
        if (isCorrect && socket) {
            setScore(prev => prev + 1);
            socket.emit('victory', { language: 'php' });
        }
    };

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
            <div className="flex flex-col items-center w-full max-w-md">
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