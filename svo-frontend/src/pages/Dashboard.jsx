import Layout from "../components/Layout";
import ValeursRecents from "../components/ValeursRecents";

export default function Dashboard() {
  // Ces données serviront plus tard depuis l’API Django
  const valeursRecentesDemo = [
    {
      id: 1,
      codesh: "020200",
      descrip: "Vanille bourbon premium",
      pays_destinataire: "France",
      pu_fact: 120,
    },
    {
      id: 2,
      codesh: "010100",
      descrip: "Bois exotique traité",
      pays_destinataire: "Madagascar",
      pu_fact: 45,
    },
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-douane-primary mb-6">
        Tableau de bord
      </h1>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white shadow rounded-xl border-l-4 border-douane-primary">
          <h2 className="text-sm text-gray-500">Total valeurs</h2>
          <p className="text-3xl font-bold">36</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl border-l-4 border-yellow-500">
          <h2 className="text-sm text-gray-500">En attente</h2>
          <p className="text-3xl font-bold">8</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl border-l-4 border-green-600">
          <h2 className="text-sm text-gray-500">Validées</h2>
          <p className="text-3xl font-bold">28</p>
        </div>
      </div>

      {/* Deux colonnes alignées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Tableau résumé */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Valeurs récentes (tableau)</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-douane-light text-gray-700">
                <th className="p-2">Code SH</th>
                <th className="p-2">Description</th>
                <th className="p-2">Origine</th>
                <th className="p-2">Devise</th>
                <th className="p-2">Statut</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-2">010100</td>
                <td className="p-2">Article exemple</td>
                <td className="p-2">Madagascar</td>
                <td className="p-2">USD</td>
                <td className="p-2">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-sm">
                    EN_ATTENTE
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Liste récente améliorée */}
        <ValeursRecents valeurs={valeursRecentesDemo} />
      </div>
    </Layout>
  );
}
