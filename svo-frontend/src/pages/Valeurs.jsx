// src/pages/Valeurs.jsx
import { useState, useEffect } from "react";
import ModalC from "../components/ModalC";
import api from "../api/axios/";
import Layout from "../components/Layout";

export default function Valeurs() {
  const [showModal, setShowModal] = useState(false);
  const [valeurs, setValeurs] = useState([]);
  const [formData, setFormData] = useState({});
  const [imageBase64, setImageBase64] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadValeurs();
  }, []);

  const loadValeurs = async () => {
    try {
      const res = await api.get("valeurs/");
      // map si besoin
      setValeurs(res.data);
    } catch (err) {
      console.error("loadValeurs:", err);
      alert("Erreur chargement valeurs");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentValues = valeurs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.max(1, Math.ceil(valeurs.length / itemsPerPage));

  // Convertir image -> Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      // reader.result est "data:image/...;base64,...."
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Mise à jour champs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Soumission formulaire : envoie au backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // récupérer id_utilisateur depuis localStorage
      const user = JSON.parse(localStorage.getItem("svo_user") || "null");
      if (!user) {
        return alert("Utilisateur non connecté");
      }

      const payload = {
        codesh: formData.codesh,
        descrip: formData.descrip,
        unite: formData.unite || null,
        quantite: formData.quantite || 0,
        pu_fact: formData.pu_fact || 0,
        pu_redr: formData.pu_redr || null,
        methode: formData.methode || null,
        incoterm: formData.incoterm || null,
        devise: formData.devise || null,
        source: formData.source || null,
        ref_fact: formData.ref_fact || null,
        status: formData.status || null,
        details_marchandises: formData.details_marchandises || null,
        poid_brut: formData.poid_brut || null,
        poid_net: formData.poid_net || null,
        exportateur: formData.exportateur || null,
        pays_destinataire: formData.pays_destinataire || null,
        importateur: formData.importateur || null,
        conditionnement: formData.conditionnement || null,
        date_effet: formData.date_effet || null,
        image: imageBase64 || null,
        id_utilisateur: user.id_utilisateur,
      };

      await api.post("valeurs/", payload);
      await loadValeurs();
      setShowModal(false);
      setFormData({});
      setImageBase64("");
    } catch (err) {
      console.error("handleSubmit:", err);
      alert("Erreur enregistrement valeur: " + (err.response?.data || err.message));
    }
  };

  const deleteValue = async (id_valeur) => {
    if (!confirm("Supprimer cette valeur ?")) return;
    try {
      await api.delete(`valeurs/${id_valeur}/`);
      await loadValeurs();
    } catch (err) {
      console.error(err);
      alert("Erreur suppression");
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-douane-primary">Gestion des Valeurs</h1>

          <div className="flex gap-4">
            <button className="px-5 py-2 bg-douane-primary text-white rounded-lg hover:bg-douane-secondary" onClick={() => setShowModal(true)}>
              + Ajouter une valeur
            </button>

            <button className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">📥Importer Excel</button>

            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">🔍 Rechercher dans Sydonia</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-douane-primary text-white">
              <tr>
                <th className="p-3 border">Code SH</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">PU Fact</th>
                <th className="p-3 border">PU Redr</th>
                <th className="p-3 border">Origine</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentValues.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">Aucune valeur pour l'instant.</td>
                </tr>
              ) : (
                currentValues.map((val) => (
                  <tr key={val.id_valeur} className="text-center border-b hover:bg-gray-100">
                    <td className="p-3 border">{val.codesh}</td>
                    <td className="p-3 border">{val.descrip}</td>
                    <td className="p-3 border">{val.pu_fact}</td>
                    <td className="p-3 border">{val.pu_redr}</td>
                    <td className="p-3 border">{val.pays_destinataire}</td>
                    <td className="p-3 border">
                      <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-700" onClick={() => deleteValue(val.id_valeur)}>Supprimer</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-600">Page {currentPage} / {totalPages}</p>

            <div className="flex gap-3">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className={`px-4 py-2 rounded-lg border ${currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-white hover:bg-gray-100"}`}>◀ Précédent</button>

              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className={`px-4 py-2 rounded-lg border ${currentPage === totalPages ? "bg-gray-200 text-gray-400" : "bg-white hover:bg-gray-100"}`}>Suivant ▶</button>
            </div>
          </div>
        </div>

        <ModalC visible={showModal} onClose={() => setShowModal(false)} onSubmit={handleSubmit} onChange={handleChange} onImageUpload={handleImageUpload} />
      </div>
    </Layout>
  );
}
