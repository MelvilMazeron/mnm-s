// pages/index.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Bienvenue sur notre site</h1>
      
      <div className="flex items-center justify-center w-full max-w-4xl">
        {/* Rectangle bleu */}
        <div className="w-40 h-60 bg-cyan-500"></div>
        
        {/* Conteneur des boutons */}
        <div className="flex flex-col items-center mx-8 space-y-4">
          <button className="px-4 py-2 w-[227px] bg-gray-200 text-black rounded shadow">
            ← Rejoindre l'équipe bleu
          </button>
          <button className="px-4 py-2 bg-gray-200 text-black rounded shadow">
            Rejoindre l'équipe rouge →
          </button>
        </div>

        {/* Rectangle rouge */}
        <div className="w-40 h-60 bg-red-500"></div>
      </div>
    </div>
  );
}