"use client";
import { useState } from "react";
import io from "socket.io-client";
import { useEffect } from "react";

const socket = io('http://localhost:3001');

export default function PageJeu() {
    const [score, setScore] = useState(0);

    const [codePhp, setCodePhp] = useState(
        `<?php 
        $name = "Alice"
        echo "Bonjour " . $name; 
        ?>`
    );

    const [isVictoryPhp, setIsVictoryPhp] = useState(false);

    const correctPhp = `<?php 
    $name = "Alice"; 
    echo "Bonjour " . $name; 
    ?>`;

    const handleCodeChangePhp = (newCode: string) => {
        setCodePhp(newCode);
        if (newCode === correctPhp) {
            setIsVictoryPhp(true);
            setScore((prevScore) => prevScore + 1);
            socket.emit('victory', { language: 'php' });
        } else {
            setIsVictoryPhp(false);
        }
    };


    const PhpCorrection = () => {
        return (
          <pre>
            {`<?php \n    $name = "Alice"`}
            <span className="text-red-500">;</span>
            {`\n    echo "Bonjour " . $name; \n?>`}
          </pre>
        );
      };
    

    if (isVictoryPhp) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="border-2 border-green-500 rounded-lg p-4 bg-gray-800">
                    {PhpCorrection()}
                </div>
            </div>
        );
    }
    
    useEffect(() => {
        socket.on('victory', (data) => {
            const language = data.language;
    
            if (language === 'php') {
                setIsVictoryPhp(true);
                setScore((prevScore) => prevScore + 1);
            }
        });
    
        return () => {
            socket.off('victory');
        };
    }, []);

    useEffect(() => {
        if (isVictoryPhp) {
            const timeout = setTimeout(() => {
                setIsVictoryPhp(false);
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [isVictoryPhp]);

    return (
        <div className="flex flex-col items-center mb-5 justify-center min-h-screen text-white bg-black" id="1">
            <h1 className="text-3xl font-bold mb-6">Bug Hunter Arena</h1>
            <div className="flex flex-col items-center mb-5" >
                <img className="max-w-45 mb-5  justify-center" src="/images/logoPHP.png" id="1" alt="" />
                <div>
                    <textarea
                        className="border-2 border-white rounded-lg p-2 text-white w-96 h-40 bg-black"
                        name="exercicePhp"
                        id="exercicePhp"
                        value={codePhp}
                        onChange={(e) => handleCodeChangePhp(e.target.value)}
                    ></textarea>
                </div>
            </div>
        </div>
    );      
        
}