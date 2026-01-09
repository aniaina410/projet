import { useEffect, useState } from "react";
import api from "../api/axios";
import ModalUser from "../components/ModalUser";
import { UserPlus, Edit, Power } from "lucide-react";

export default function Utilisateurs() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get("utilisateurs/");
      setUsers(res.data || []);
    } catch (e) {
      console.error("Erreur chargement utilisateurs", e);
    }
  };

  // ✅ FIX: On retire <Layout> du return
  return (
    <div className="p-6"> 
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-douane-primary">Gestion des Utilisateurs</h1>
        <button 
          onClick={() => { setEditUser(null); setShowModal(true); }}
          className="bg-douane-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-all"
        >
          <UserPlus size={20} /> Ajouter un utilisateur
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Utilisateur</th>
              <th className="p-4 font-semibold text-gray-600">Matricule</th>
              <th className="p-4 font-semibold text-gray-600">Rôle</th>
              <th className="p-4 font-semibold text-gray-600">Statut</th>
              <th className="p-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              /* ✅ FIX: Utilisation d'une clé unique robuste */
              <tr key={u.id_utilisateur || u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-gray-800">{u.nom_utilisateur} {u.prenom_utilisateur}</div>
                  <div className="text-xs text-gray-500">{u.email}</div>
                </td>
                <td className="p-4 text-gray-600">{u.matricule}</td>
                <td className="p-4 text-gray-600">{u.id_role?.role_nom || "Agent"}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => { setEditUser(u); setShowModal(true); }} className="text-blue-500 hover:text-blue-700">
                    <Edit size={18} />
                  </button>
                  <button className="text-gray-400 hover:text-red-500">
                    <Power size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
      <ModalUser 
        onClose={() => setShowModal(false)} 
        initialData={editUser} // null si ajout, objet user si édition
        onSave={() => {
          loadUsers();
          setShowModal(false);
        }} 
      />
     )}
    </div>
  );
}