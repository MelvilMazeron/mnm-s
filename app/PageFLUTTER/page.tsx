"use client";
import { useState } from "react";
import io from "socket.io-client";
import { useEffect } from "react";

const socket = io('http://localhost:3001');

export default function PageJeu() {

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

    const handleCodeChangeFlutter = (newCode: string) => {
        setCodeFlutter(newCode);
        if (newCode === correctFlutter) {
            setIsVictoryFlutter(true);
            setScore((prevScore) => prevScore + 1);
            socket.emit('victory', { language: 'flutter' });
        } else {
            setIsVictoryFlutter(false);
        }
    };

    const FlutterCorrection = () => {
        return (
            <pre>
                {
    `import 'package:flutter/material.dart'; 
    void main() { 
        runApp(MyApp())`}
        <span className="text-red-500">;</span>
    {`} 
    class MyApp extends StatelessWidget { 
        @override
        Widget build(BuildContext context) { 
            return MaterialApp( 
                home: Scaffold(body: Text('Hello')), 
            ); 
        } 
    }`}
            </pre>
        );
    };


    if (isVictoryFlutter) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="border-2 border-green-500 rounded-lg p-4 bg-gray-800">
                    {FlutterCorrection()}
                </div>
            </div>
        );
    }
    
    useEffect(() => {
        socket.on('victory', (data) => {
            const language = data.language;

            if (language === 'flutter') {
                setIsVictoryFlutter(true);
                setScore((prevScore) => prevScore + 1);
            }
        });

        return () => {
            socket.off('victory');
        };
    }, []);

    useEffect(() => {
        if (isVictoryFlutter) {
            const timeout = setTimeout(() => {
                setIsVictoryFlutter(false);
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [isVictoryFlutter]);

        return (
            <div className="flex flex-col items-center mb-5 justify-center min-h-screen text-white bg-black" id="3">
                <h1 className="text-3xl font-bold mb-6">Bug Hunter Arena</h1>
                <div className="flex flex-col items-center mb-5">
                    <img className="max-w-45 mb-5" src="/images/logoFLUTTER.png" id="3" alt="" />
                    <div>
                        <textarea
                            className="border-2 border-white rounded-lg p-2 text-white w-96 h-40 bg-black"
                            name="exerciceFlutter"
                            id="exerciceFlutter"
                            value={codeFlutter}
                            onChange={(e) => handleCodeChangeFlutter(e.target.value)}
                        ></textarea>
                    </div>
                </div>
            </div>
        );
}