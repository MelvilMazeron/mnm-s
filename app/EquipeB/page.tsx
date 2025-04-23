import React from 'react';

function App() {
  return (
    <div className="bg-red-400 min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Nom d'équipe"
          className="p-2 rounded border border-black"
        />
        <div className="text-white text-xl">Score : --</div>
      </div>
      <div className="flex">
        <div className="w-1/2 p-4 bg-white text-black rounded shadow-md mr-2">
          <h2 className="text-lg font-bold mb-2">Composition équipe</h2>
          <ul>
            <li>Joueur 1ère catégorie</li>
            <li>Joueur 2ème catégorie</li>
            <li>Joueur 3ème catégorie</li>
            <li>Joueur 4ème catégorie</li>
          </ul>
        </div>
        <div className="w-1/2 p-4 bg-white text-black rounded shadow-md ml-2">
          <h2 className="text-lg font-bold mb-2">Affichage des bugs à résoudre</h2>
          <button className="bg-red-500 text-white p-2 rounded">Accéder à la résolution du bug</button>
        </div>
      </div>
    </div>
  );
}

export default App;
