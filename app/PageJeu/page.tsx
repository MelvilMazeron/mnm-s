"use client";
import { useState } from "react";

export default function PageJeu() {
    const [code, setCode] = useState(
        `<?php 
        $name = "Alice"
        echo "Bonjour " . $name; 
        ?>`);

    const [isVictory, setIsVictory] = useState(false);

    const correctCode = 
    `<?php 
    $name = "Alice"; 
    echo "Bonjour " . $name; 
    ?>`;

    const handleCodeChange = (newCode: string) => {
        setCode(newCode); // Met à jour le code saisi
        if (newCode === correctCode) {
            setIsVictory(true); // Détecte immédiatement si le code est correct
        }
    };

    if (isVictory) {
        // Affiche uniquement le visuel de victoire
        return (
            <div className="flex items-center justify-center min-h-screen bg-black text-white">
                <div className="border-2 border-green-500 rounded-lg p-4 bg-gray-800">
                    <pre className="text-white">
                        {correctCode}
                    </pre>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black">
            <h1 className="text-3xl font-bold mb-6">Bug Hunter Arena</h1>
            <img className="max-w-45 mb-5" src="/images/logoPHP.png" alt="" />
            <div>
                <textarea
                    className="border-2 border-white rounded-lg p-2 text-white w-96 h-40 bg-black"
                    name="exercice"
                    id="exercice"
                    value={code}
                    onChange={(e) => handleCodeChange(e.target.value)} // Vérifie le code à chaque modification
                ></textarea>
            </div>
        </div>
    );
}