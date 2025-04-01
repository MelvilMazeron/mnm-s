export default function VueSpectateurScore() {
    return (
      <div className="flex min-h-screen text-white bg-black p-6">
        <div className="w-1/2 flex flex-col items-start p-4 border-r border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Équipe A</h2>
          <h3 className="text-lg mb-4">Score : </h3>
          <div className="p-6 border-2 bg-blue-500 rounded-lg w-60">
            <table>
                <thead>
                <tr>
                    <th className="text-left">Joueurs : </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>A : </td>
                </tr>
                <tr>
                    <td>B : </td>
                </tr>
                    <tr>
                        <td>C : </td>
                    </tr>
                    <tr>
                        <td>D : </td>
                    </tr>
                    <tr>
                        <td>E : </td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>
  
        <div className="w-1/2 flex flex-col items-start p-4">
          <h2 className="text-2xl font-bold mb-4">Équipe B</h2>
          <h3 className="text-lg mb-4">Score : </h3>
          <div className="p-6 border-2 bg-red-500 rounded-lg w-60">
            <table>
                <thead>
                <tr>
                    <th className="text-left">Joueurs : </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>A : </td>
                </tr>
                <tr>
                    <td>B : </td>
                </tr>
                    <tr>
                        <td>C : </td>
                    </tr>
                    <tr>
                        <td>D : </td>
                    </tr>
                    <tr>
                        <td>E : </td>
                    </tr>
                </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }