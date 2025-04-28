"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

export default function PageCEFSHARP() {
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [score, setScore] = useState(0);
    const [codeCefsharp, setCodeCefsharp] = useState(
        `class Program { 
            public static void Main { 
                Console.WriteLine("Salut !"); 
            } 
        }`
    );
    const [isVictoryCefsharp, setIsVictoryCefsharp] = useState(false);

    const correctCefsharp = `class Program { 
        public static void Main() { 
            Console.WriteLine("Salut !"); 
        } 
    }`;

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
        const isCorrect = newCode === correctCefsharp;
        setIsVictoryCefsharp(isCorrect);
        
        if (isCorrect && socket) {
            setScore(prev => prev + 1);
            socket.emit('victory', { language: 'csharp' });
        }
    };

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