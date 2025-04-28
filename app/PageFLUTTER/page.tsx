"use client";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function PageFLUTTER() {
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [score, setScore] = useState(0);
    const [codeFlutter, setCodeFlutter] = useState(
        `import 'package:flutter/material.dart'; 
        void main() { 
            runApp(MyApp())
        } 
        class MyApp extends StatelessWidget { 
            @override
            Widget build(BuildContext context) { 
                return MaterialApp( 
                    home: Scaffold(body: Text('Hello')), 
                ); 
            } 
        }`
    );
    const [isVictoryFlutter, setIsVictoryFlutter] = useState(false);

    const correctFlutter = `import 'package:flutter/material.dart'; 
    void main() { 
        runApp(MyApp()); 
    } 
    class MyApp extends StatelessWidget { 
        @override
        Widget build(BuildContext context) { 
            return MaterialApp( 
                home: Scaffold(body: Text('Hello')), 
            ); 
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

    const handleCodeChange = (newCode: string) => {
        setCodeFlutter(newCode);
        const isCorrect = newCode === correctFlutter;
        setIsVictoryFlutter(isCorrect);
        
        if (isCorrect && socket) {
            setScore(prev => prev + 1);
            socket.emit('victory', { language: 'flutter' });
        }
    };

    const CorrectionDisplay = () => (
        <pre>
            {`import 'package:flutter/material.dart';\nvoid main() {\n    runApp(MyApp())`}
            <span className="text-red-500">;</span>
            {`\n}\nclass MyApp extends StatelessWidget {\n    @override\n    Widget build(BuildContext context) {\n        return MaterialApp(\n            home: Scaffold(body: Text('Hello')),\n        );\n    }\n}`}
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