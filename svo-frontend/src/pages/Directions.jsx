// src/pages/Directions.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DirectionModal from "../components/DirectionModal";
import api from "../api/axios";

export default function Directions() {
  const [directions, setDirections] = useState([]);
  const [services, setServices] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingDirection, setEditingDirection] = useState(null);

  /* ===================== LOAD DATA ===================== */

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchDirections(), fetchServices()]);
  };

  const fetchDirections = async () => {
    try {
      const res = await api.get("directions/");
      setDirections(
        res.data.map((d) => ({
          id: d.id_direction,
          nom: d.direction_nom,
        }))
      );
    } catch (error) {
      console.error("Erreur directions :", error);
      alert("Impossible de charger les directions");
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get("services/");
      setServices(res.data);
    } catch (error) {
      console.error("Erreur services :", error);
    }
  };

  /* ===================== HELPERS ===================== */

  const servicesByDirection = (directionId) => {
    return services.filter((s) => {
      const did =
        typeof s.id_direction === "object"
          ? s.id_direction.id_direction
          : s.id_direction;
      return did === directionId;
    });
  };

  /* ===================== ACTIONS ===================== */

  const openCreateModal = () => {
    setEditingDirection(null);
    setShowModal(true);
  };

  const openEditModal = (direction) => {
    setEditingDirection({
      id: direction.id,
      nom: direction.nom,
      services: servicesByDirection(direction.id).map(
        (s) => s.service_nom
      ),
    });
    setShowModal(true);
  };

  const handleSave = async ({ id, nom, services: servicesList }) => {
    try {
      if (id) {
        /* ===== UPDATE DIRECTION ===== */
        await api.put(`directions/${id}/`, {
          direction_nom: nom,
        });

        const existingServices = servicesByDirection(id);

        /* Supprimer services supprimés */
        for (const srv of existingServices) {
          if (!servicesList.includes(srv.service_nom)) {
            await api.delete(`services/${srv.id_service}/`);
          }
        }

        /* Ajouter nouveaux services */
        for (const srv of servicesList) {
          const exists = existingServices.find(
            (e) => e.service_nom === srv
          );
          if (!exists) {
            await api.post("services/", {
              service_nom: srv,
              id_direction: id,
            });
          }
        }
      } else {
        /* ===== CREATE DIRECTION ===== */
        const res = await api.post("directions/", {
          direction_nom: nom,
        });

        const newId = res.data.id_direction;

        for (const srv of servicesList) {
          await api.post("services/", {
            service_nom: srv,
            id_direction: newId,
          });
        }
      }

      await fetchAll();
      setShowModal(false);
    } catch (error) {
      console.error("Erreur sauvegarde :", error);
      alert("Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (directionId) => {
    const count = servicesByDirection(directionId).length;

    if (count > 0) {
      alert("Supprimez d'abord les services de cette direction");
      return;
    }

    if (!confirm("Confirmer la suppression ?")) return;

    try {
      await api.delete(`directions/${directionId}/`);
      await fetchDirections();
    } catch (error) {
      console.error(error);
      alert("Suppression impossible");
    }
  };

  /* ===================== RENDER ===================== */

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-douane-primary">
          Gestion Directions & Services
        </h1>

        <button
          onClick={openCreateModal}
          className="px-5 py-2 bg-douane-primary text-white rounded-lg hover:bg-douane-secondary"
        >
          + Nouvelle direction
        </button>
      </div>

      <div className="space-y-6">
        {directions.map((dir) => (
          <div
            key={dir.id}
            className="bg-white rounded-xl shadow p-5"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-douane-primary">
                {dir.nom}
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(dir)}
                  className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Modifier
                </button>

                <button
                  onClick={() => handleDelete(dir.id)}
                  className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>

            <ul className="list-disc pl-6 text-gray-700">
              {servicesByDirection(dir.id).map((srv) => (
                <li key={srv.id_service}>{srv.service_nom}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <DirectionModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSave}
        initialData={editingDirection}
      />
    </Layout>
  );
}
