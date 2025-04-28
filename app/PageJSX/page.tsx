"use client";
import { useState } from "react";
import io from "socket.io-client";
import { useEffect } from "react";

const socket = io('http://localhost:3001');

export default function PageJeu() {
    const [score, setScore] = useState(0);

    const [codeJsx, setCodeJsx] = useState(
        `import React from 'react'; 
        function Greeting(props) { 
            return <h1>Hello {props.name</h1>; 
        } 
        export default Greeting;`
    );

    const [isVictoryJsx, setIsVictoryJsx] = useState(false);


    const correctJsx = `import React from 'react'; 
    function Greeting(props) { 
        return <h1>Hello {props.name}</h1>; 
    } 
    export default Greeting;`;

    const handleCodeChangeJsx = (newCode: string) => {
        setCodeJsx(newCode);
        if (newCode === correctJsx) {
            setIsVictoryJsx(true);
            setScore((prevScore) => prevScore + 1);
            socket.emit('victory', { language: 'jsx' });
        } else {
            setIsVictoryJsx(false);
        }
    };

      const Jsxcorrection = () => {
        return (
            <pre className="text-white">
    {`import React from 'react'; 
    function Greeting(props) { 
        return <h1>Hello {props.name`}
    <span className="text-red-500">{`}`}</span>
    {`</h1>; 
    } 
    export default Greeting;`}
            </pre>
        );
    };

    if (isVictoryJsx) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="border-2 border-green-500 rounded-lg p-4 bg-gray-800">
                    {Jsxcorrection()}
                </div>
            </div>
        );
    }

    
    useEffect(() => {
        socket.on('victory', (data) => {
            const language = data.language;
            if (language === 'jsx') {
                setIsVictoryJsx(true);
                setScore((prevScore) => prevScore + 1);
            }
        });

        return () => {
            socket.off('victory');
        };
    }, []);

        return (
            <div className="flex flex-col items-center mb-5 justify-center min-h-screen text-white bg-black" id="2">
                <h1 className="text-3xl font-bold mb-6">Bug Hunter Arena</h1>
                <div className="flex flex-col items-center mb-5" >
                    <img className="max-w-45 mb-5" src="/images/logoJSX.png" id="2" alt="" />
                    <div>
                        <textarea
                            className="border-2 border-white rounded-lg p-2 text-white w-96 h-40 bg-black"
                            name="exerciceJsx"
                            id="exerciceJsx"
                            value={codeJsx}
                            onChange={(e) => handleCodeChangeJsx(e.target.value)}
                        ></textarea>
                    </div>
                </div>
            </div>
        );
    
}