"use client";
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useRouter } from "next/navigation";

export default function PageCPLUSPLUS() {
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [score, setScore] = useState(0);

    const [codeCPlusPlus, setCodeCPlusPlus] = useState(
        `#include <iostream> 
        using namespace std;
        
        int main() { 
            cout << "Hello world! << endl; 
            return 0; 
        }`
    );
    const [isVictoryCPlusPlus, setIsVictoryCPlusPlus] = useState(false);

    const correctCplusplus = `#include <iostream> 
    using namespace std;
    
    int main() { 
        cout << "Hello world!" << endl; 
        return 0; 
    }`;

    // Initialisation du socket
    useEffect(() => {
        const socketInstance = io('http://localhost:3001');
        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    // Écoute des événements de victoire
    useEffect(() => {
        if (!socket) return;

        const victoryHandler = (data: { language: string }) => {
            if (data.language === 'c++') {
                setIsVictoryCPlusPlus(true);
                setScore((prevScore) => prevScore + 1);
            }
        };

        socket.on('victory', victoryHandler);

        return () => {
            socket.off('victory', victoryHandler);
        };
    }, [socket]);

    useEffect(() => {
        if (isVictoryCPlusPlus) {
            const timeout = setTimeout(() => {
                setIsVictoryCPlusPlus(false);
                router.push("/EquipeA");
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [isVictoryCPlusPlus, router]);

    const handleCodeChangeCPlusPlus = (newCode: string) => {
        setCodeCPlusPlus(newCode);
        if (newCode === correctCplusplus) {
            setIsVictoryCPlusPlus(true);
            setScore((prevScore) => prevScore + 1);
            if (socket) {
                socket.emit('victory', { language: 'c++' });
            }
        } else {
            setIsVictoryCPlusPlus(false);
        }
    };

    const CPlusPlusCorrection = () => {
        return (
            <pre>
                {`#include <iostream> 
    using namespace std;
    
    int main() { 
        cout << "Hello world!`}
                <span className="text-red-500">"</span> {`<< endl; 
        return 0; 
    }`}
            </pre>
        );
    };

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
                        onChange={(e) => handleCodeChangeCPlusPlus(e.target.value)}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}