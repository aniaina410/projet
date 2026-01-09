import { useEffect, useState } from "react";
// Correction de l'import (suppression du slash final)
import api from "../api/axios"; 
import ValeursRecents from "../components/ValeursRecents";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, en_attente: 0, valide: 0 });
  const [valeursRecentes, setValeursRecentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get("valeurs/");
      const all = res.data || [];
      
      setStats({
        total: all.length,
        en_attente: all.filter((v) => v.status === "EN_ATTENTE").length,
        valide: all.filter((v) => ["VALIDE", "VALIDÉ", "VALIDÉE"].includes(v.status)).length,
      });

      // Tri par ID décroissant pour avoir les plus récents
      const sorted = [...all].sort((a, b) => (b.id_valeur || 0) - (a.id_valeur || 0));
      setValeursRecentes(sorted.slice(0, 5));
    } catch (error) {
      console.error("Erreur chargement Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 font-bold text-douane-primary">Chargement...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>
      
      {/* Grille des statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
          <p className="text-gray-500 text-sm uppercase">Total Dossiers</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-yellow-500">
          <p className="text-gray-500 text-sm uppercase">En Attente</p>
          <p className="text-3xl font-bold">{stats.en_attente}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm uppercase">Validés</p>
          <p className="text-3xl font-bold">{stats.valide}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Valeurs récentes</h2>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-douane-light text-gray-700">
                <th className="p-2">Code SH</th>
                <th className="p-2">Description</th>
                <th className="p-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {valeursRecentes.map((v) => (
                <tr key={v.id_valeur} className="border-b hover:bg-gray-50">
                  <td className="p-2">{v.codesh}</td>
                  <td className="p-2">{v.descrip}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      ["VALIDE", "VALIDÉ", "VALIDÉE"].includes(v.status) 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {v.status || "Saisie"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Utilisation du composant dédié pour varier l'affichage */}
        <ValeursRecents valeurs={valeursRecentes} />
      </div>
    </div>
  );
}