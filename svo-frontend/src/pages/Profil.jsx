// src/pages/Profil.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProfileCard from "../components/ProfileCard";
import api from "../api/axios/";

export default function Profil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("me/"); // endpoint classique
      setUser(res.data);
    } catch (err) {
      console.error(err);
      alert("Impossible de charger le profil");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await api.put("me/", data);
      await loadProfile();
      alert("Profil mis à jour avec succès");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  if (loading) {
    return (
      <Layout>
        <p>Chargement...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-douane-primary mb-6">
        Mon profil
      </h1>

      <ProfileCard user={user} onSave={handleUpdate} />
    </Layout>
  );
}
