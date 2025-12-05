import { useState } from "react";
import ModalC from "../components/ModalC";

export default function Valeurs() {
  const [showModal, setShowModal] = useState(false);
  const [valeurs, setValeurs] = useState([]);
  const [formData, setFormData] = useState({});
  const [imageBase64, setImageBase64] = useState("");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentValues = valeurs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(valeurs.length / itemsPerPage);

  // Convertir image -> Base64
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
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

  // Soumission formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    const newValue = {
      ...formData,
      image: imageBase64,
      id: valeurs.length + 1,
    };

    setValeurs([...valeurs, newValue]);
    setShowModal(false);
    setFormData({});
    setImageBase64("");
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-douane-primary">Gestion des Valeurs</h1>

        <div className="flex gap-4">
          <button
            className="px-5 py-2 bg-douane-primary text-white rounded-lg hover:bg-douane-secondary"
            onClick={() => setShowModal(true)}
          >
            + Ajouter une valeur
          </button>

          <button className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            📥Importer Excel
          </button>

          <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
           🔍 Rechercher dans Sydonia
          </button>
        </div>
      </div>

      {/* TABLEAU */}
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
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  Aucune valeur ajoutée pour l'instant.
                </td>
              </tr>
            ) : (
              currentValues.map((val) => (
                <tr key={val.id} className="text-center border-b hover:bg-gray-100">
                  <td className="p-3 border">{val.codesh}</td>
                  <td className="p-3 border">{val.descrip}</td>
                  <td className="p-3 border">{val.pu_fact}</td>
                  <td className="p-3 border">{val.pu_redr}</td>
                  <td className="p-3 border">{val.pays_destinataire}</td>
                  <td className="p-3 border">
                    <button className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-700">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center mt-4">

          <p className="text-gray-600">
            Page {currentPage} / {totalPages === 0 ? 1 : totalPages}
          </p>

          <div className="flex gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              ◀ Précédent
            </button>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-200 text-gray-400"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              Suivant ▶
            </button>
          </div>
        </div>
      </div>

      {/* POPUP */}
      <ModalC
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        onChange={handleChange}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
}
