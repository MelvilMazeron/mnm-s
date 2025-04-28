"use client";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function PageJSX() {
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [score, setScore] = useState(0);
    const [codeJsx, setCodeJsx] = useState(
        `import React from 'react';\nfunction Greeting(props) {\n    return <h1>Hello {props.name</h1>;\n}\nexport default Greeting;`
    );
    const [isVictoryJsx, setIsVictoryJsx] = useState(false);

    const correctJsx = `import React from 'react'; 
    function Greeting(props) { 
        return <h1>Hello {props.name}</h1>; 
    } 
    export default Greeting;`;

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
            if (data.language === 'jsx') {
                setIsVictoryJsx(true);
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
        if (!isVictoryJsx) return;

        const timer = setTimeout(() => {
            router.push("/EquipeA");
        }, 5000);

        return () => clearTimeout(timer);
    }, [isVictoryJsx, router]);

    const handleCodeChange = (newCode: string) => {
        setCodeJsx(newCode);
        const isCorrect = newCode === correctJsx;
        setIsVictoryJsx(isCorrect);
        
        if (isCorrect && socket) {
            setScore(prev => prev + 1);
            socket.emit('victory', { language: 'jsx' });
        }
    };

    const CorrectionDisplay = () => (
        <pre className="text-white">
            {`import React from 'react';\nfunction Greeting(props) {\n    return <h1>Hello {props.name`}
            <span className="text-red-500">{`}`}</span>
            {`</h1>;\n}\nexport default Greeting;`}
        </pre>
    );

    if (isVictoryJsx) {
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
                    src="/images/logoJSX.png" 
                    alt="JSX Logo" 
                    className="w-24 h-24 mb-6 object-contain"
                />
                <textarea
                    className="w-full h-64 p-4 border-2 border-gray-600 rounded-lg bg-gray-900 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                    value={codeJsx}
                    onChange={(e) => handleCodeChange(e.target.value)}
                    spellCheck="false"
                    aria-label="JSX code editor"
                />
            </div>
        </div>
    );
}