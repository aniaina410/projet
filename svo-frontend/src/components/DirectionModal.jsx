// src/components/DirectionModal.jsx
import { useEffect, useState } from "react";

export default function DirectionModal({
  visible,
  onClose,
  onSubmit,
  initialData,
}) {
  const [nom, setNom] = useState("");
  const [services, setServices] = useState([""]);

  useEffect(() => {
    if (initialData) {
      setNom(initialData.nom);
      setServices(initialData.services.length ? initialData.services : [""]);
    } else {
      setNom("");
      setServices([""]);
    }
  }, [initialData]);

  if (!visible) return null;

  const updateService = (value, index) => {
    const updated = [...services];
    updated[index] = value;
    setServices(updated);
  };

  const addService = () => {
    setServices([...services, ""]);
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nom.trim()) {
      alert("Nom de direction requis");
      return;
    }

    const cleanedServices = [
      ...new Set(services.map((s) => s.trim()).filter(Boolean)),
    ];

    onSubmit({
      id: initialData?.id || null,
      nom,
      services: cleanedServices,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-douane-primary">
            {initialData ? "Modifier la direction" : "Créer une direction"}
          </h2>

          <button
            onClick={onClose}
            className="text-red-500 font-bold text-xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1">
              Nom de la direction
            </label>
            <input
              className="input-field"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Services
            </label>

            {services.map((srv, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  className="input-field flex-1"
                  value={srv}
                  onChange={(e) =>
                    updateService(e.target.value, index)
                  }
                  placeholder={`Service ${index + 1}`}
                />

                {services.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="px-3 bg-red-500 text-white rounded"
                  >
                    −
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addService}
              className="mt-2 px-4 py-2 bg-douane-primary text-white rounded hover:bg-douane-secondary"
            >
              + Ajouter un service
            </button>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-6 py-2 bg-douane-primary text-white rounded"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
