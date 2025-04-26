"use client";
import { useState } from "react";

export default function PageJeu() {
    const [codePhp, setCodePhp] = useState(
        `<?php 
        $name = "Alice"
        echo "Bonjour " . $name; 
        ?>`
    );
    const [codeJsx, setCodeJsx] = useState(
        `import React from 'react'; 
        function Greeting(props) { 
            return <h1>Hello {props.name</h1>; 
        } 
        export default Greeting;`
    );
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
    const [codeCPlusPlus, setCodeCPlusPlus] = useState(
        `#include <iostream> 
        using namespace std;
        
        int main() { 
            cout << "Hello world! << endl; 
            return 0; 
        }`
    );
    const [codeCefsharp, setCodeCefsharp] = useState(
        `class Program { 
            public static void Main { 
                Console.WriteLine("Salut !"); 
            } 
        }`
    );

    const [isVictoryPhp, setIsVictoryPhp] = useState(false);
    const [isVictoryJsx, setIsVictoryJsx] = useState(false);
    const [isVictoryFlutter, setIsVictoryFlutter] = useState(false);
    const [isVictoryCPlusPlus, setIsVictoryCPlusPlus] = useState(false);
    const [isVictoryCefsharp, setIsVictoryCefsharp] = useState(false);

    const correctPhp = `<?php 
    $name = "Alice"; 
    echo "Bonjour " . $name; 
    ?>`;

    const correctJsx = `import React from 'react'; 
    function Greeting(props) { 
        return <h1>Hello {props.name}</h1>; 
    } 
    export default Greeting;`;

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

    const correctCplusplus = `#include <iostream> 
    using namespace std;
    
    int main() { 
        cout << "Hello world!" << endl; 
        return 0; 
    }`;

    const correctCefsharp = `class Program { 
        public static void Main() { 
            Console.WriteLine("Salut !"); 
        } 
    }`;

    const handleCodeChangePhp = (newCode: string) => {
        setCodePhp(newCode);
        if (newCode === correctPhp) {
            setIsVictoryPhp(true);
        } else {
            setIsVictoryPhp(false);
        }
    };

    const handleCodeChangeJsx = (newCode: string) => {
        setCodeJsx(newCode);
        if (newCode === correctJsx) {
            setIsVictoryJsx(true);
        } else {
            setIsVictoryJsx(false);
        }
    };

    const handleCodeChangeFlutter = (newCode: string) => {
        setCodeFlutter(newCode);
        if (newCode === correctFlutter) {
            setIsVictoryFlutter(true);
        } else {
            setIsVictoryFlutter(false);
        }
    };

    const handleCodeChangeCPlusPlus = (newCode: string) => {
        setCodeCPlusPlus(newCode);
        if (newCode === correctCplusplus) {
            setIsVictoryCPlusPlus(true);
        } else {
            setIsVictoryCPlusPlus(false);
        }
    };

    const handleCodeChangeCefsharp = (newCode: string) => {
        setCodeCefsharp(newCode);
        if (newCode === correctCefsharp) {
            setIsVictoryCefsharp(true);
        } else {
            setIsVictoryCefsharp(false);
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

    const CPlusPlusCorrection = () => {
        return (
            <pre>
                {`#include <iostream> 
    using namespace std;
    
    int main() { 
        cout << "Hello world!`}
        <span className="text-red-500">"</span> {`<< endl; 
        return 0; 
    }`
                }
            </pre>
        );
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


    

    if (isVictoryPhp) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="border-2 border-green-500 rounded-lg p-4 bg-gray-800">
                    {PhpCorrection()}
                </div>
            </div>
        );
    }

    if (isVictoryJsx) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="border-2 border-green-500 rounded-lg p-4 bg-gray-800">
                    {Jsxcorrection()}
                </div>
            </div>
        );
    }

    if (isVictoryFlutter) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="border-2 border-green-500 rounded-lg p-4 bg-gray-800">
                    {FlutterCorrection()}
                </div>
            </div>
        );
    }

    if (isVictoryCPlusPlus) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="border-2 border-green-500 rounded-lg p-4 bg-gray-800">
                    {CPlusPlusCorrection()}
                </div>
            </div>
        );
    }
    

    if (isVictoryCefsharp) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="border-2 border-green-500 rounded-lg p-4 bg-gray-800">
                    {CefsharpCorrection()}
                </div>
            </div>
        );
    }

    const random = 
        Math.floor(Math.random() * 5) + 1; 
        if (random === 1) {
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
        }else if (random === 2) {
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
    }else if (random === 3) {
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
    }else if (random === 4) {
        return (
            <div className="flex flex-col items-center mb-5 justify-center min-h-screen text-white bg-black" id="4">
                <h1 className="text-3xl font-bold mb-6">Bug Hunter Arena</h1>
                <div className="flex flex-col items-center mb-5" >
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
    }else if (random === 5) {
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
    return null; 
}