"use client";
import { useState } from "react";
import io from "socket.io-client";
import { useEffect } from "react";

const socket = io('http://localhost:3001');

export default function PageJeu() {
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


    const handleCodeChangeCefsharp = (newCode: string) => {
        setCodeCefsharp(newCode);
        if (newCode === correctCefsharp) {
            setIsVictoryCefsharp(true);
            setScore((prevScore) => prevScore + 1);
            socket.emit('victory', { language: 'c#' });
        } else {
            setIsVictoryCefsharp(false);
        }
    };

    const CefsharpCorrection = () => {
        return(
            <pre>
                {`class Program { 
        public static void Main`}
        <span className="text-red-500">{`()`}</span> {`{ 
            Console.WriteLine("Salut !"); 
        } 
    }`}
            </pre>
        );
    };

    

    if (isVictoryCefsharp) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="border-2 border-green-500 rounded-lg p-4 bg-gray-800">
                    {CefsharpCorrection()}
                </div>
            </div>
        );
    }
    
    useEffect(() => {
        socket.on('victory', (data) => {
            const language = data.language;

           if (language === 'cefsharp') {
                setIsVictoryCefsharp(true);
                setScore((prevScore) => prevScore + 1);
            }
        });

        return () => {
            socket.off('victory');
        };
    }, []);

    useEffect(() => {
        if (isVictoryCefsharp) {
            const timeout = setTimeout(() => {
                setIsVictoryCefsharp(false);
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [isVictoryCefsharp]);

        
        return (
            <div className="flex flex-col items-center mb-5 justify-center min-h-screen text-white bg-black" id="5">
                <h1 className="text-3xl font-bold mb-6">Bug Hunter Arena</h1>
                <div className="flex flex-col items-center mb-5" >
                    <img className="max-w-45 mb-5" src="/images/logoCEFSHARP.png" id="5" alt="" />
                    <div>
                        <textarea
                            className="border-2 border-white rounded-lg p-2 text-white w-96 h-40 bg-black"
                            name="exerciceC#"
                            id="exerciceC#"
                            value={codeCefsharp}
                            onChange={(e) => handleCodeChangeCefsharp(e.target.value)}
                        ></textarea>
                    </div>
                </div>
            </div>
        );
}
