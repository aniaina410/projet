import { useState, useEffect } from "react";
import api from "../api/axios";
import { X } from "lucide-react";

export default function ModalUser({ onClose, onSave, initialData }) {
  const [directions, setDirections] = useState([]);
  const [services, setServices] = useState([]);
  const [roles, setRoles] = useState([]);
  
  const [form, setForm] = useState({
    matricule: "",
    login: "",
    nom_utilisateur: "",
    prenom_utilisateur: "",
    email: "",
    id_role: "",
    id_service: "",
    password: "" // Ajouter pour la création
  });

  // Charger les données pour les selects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resDir, resServ, resRoles] = await Promise.all([
          api.get("directions/"),
          api.get("services/"),
          api.get("roles/")
        ]);
        setDirections(resDir.data);
        setServices(resServ.data);
        setRoles(resRoles.data);
      } catch (e) {
        console.error("Erreur chargement selects", e);
      }
    };
    fetchData();
  }, []);

  // Remplir le formulaire si on est en mode édition
  useEffect(() => {
    if (initialData) {
      setForm({
        matricule: initialData.matricule || "",
        login: initialData.login || "",
        nom_utilisateur: initialData.nom_utilisateur || "",
        prenom_utilisateur: initialData.prenom_utilisateur || "",
        email: initialData.email || "",
        id_role: initialData.id_role?.id_role || "",
        id_service: initialData.id_service?.id_service || "",
        password: "" // On ne remplit pas le password en édition
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        await api.put(`utilisateurs/${initialData.id_utilisateur}/`, form);
      } else {
        await api.post("utilisateurs/", form);
      }
      onSave();
    } catch (err) {
      alert("Erreur lors de l'enregistrement. Vérifiez les champs.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-douane-primary">
            {initialData ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          <input 
            className="border p-2 rounded" 
            placeholder="Nom" 
            value={form.nom_utilisateur} 
            onChange={e => setForm({...form, nom_utilisateur: e.target.value})} 
            required 
          />
          <input 
            className="border p-2 rounded" 
            placeholder="Prénom" 
            value={form.prenom_utilisateur} 
            onChange={e => setForm({...form, prenom_utilisateur: e.target.value})} 
          />
          <input 
            className="border p-2 rounded" 
            placeholder="Matricule" 
            value={form.matricule} 
            onChange={e => setForm({...form, matricule: e.target.value})} 
            required 
          />
          <input 
            className="border p-2 rounded" 
            placeholder="Email" 
            type="email"
            value={form.email} 
            onChange={e => setForm({...form, email: e.target.value})} 
          />
          
          <select 
            className="border p-2 rounded"
            value={form.id_role}
            onChange={e => setForm({...form, id_role: e.target.value})}
            required
          >
            <option value="">Sélectionner un rôle</option>
            {roles.map(r => <option key={r.id_role} value={r.id_role}>{r.role_nom}</option>)}
          </select>

          <select 
            className="border p-2 rounded"
            value={form.id_service}
            onChange={e => setForm({...form, id_service: e.target.value})}
            required
          >
            <option value="">Sélectionner un service</option>
            {services.map(s => <option key={s.id_service} value={s.id_service}>{s.service_nom}</option>)}
          </select>

          {!initialData && (
            <input 
              className="border p-2 rounded col-span-2" 
              placeholder="Mot de passe" 
              type="password"
              value={form.password} 
              onChange={e => setForm({...form, password: e.target.value})} 
              required 
            />
          )}

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600">Annuler</button>
            <button type="submit" className="bg-douane-primary text-white px-6 py-2 rounded-lg">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}