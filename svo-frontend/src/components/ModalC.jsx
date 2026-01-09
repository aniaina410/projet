import { useEffect, useState } from "react";

export default function ModalUser({
  visible,
  onClose,
  onSubmit,
  roles,
  directions,
  services,
  initialData
}) {
  const [form, setForm] = useState({
    matricule: "",
    nom_utilisateur: "",
    prenom_utilisateur: "",
    login: "",
    email: "",
    id_role: "",
    id_direction: "",
    id_service: "",
  });

  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        matricule: initialData.matricule,
        nom_utilisateur: initialData.nom_utilisateur,
        prenom_utilisateur: initialData.prenom_utilisateur,
        login: initialData.login,
        email: initialData.email,
        id_role: initialData.id_role?.id_role,
        id_direction: initialData.id_service?.id_direction?.id_direction,
        id_service: initialData.id_service?.id_service,
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (!form.id_direction) {
      setFilteredServices(services);
    } else {
      setFilteredServices(
        services.filter(
          s => s.id_direction === Number(form.id_direction)
        )
      );
    }
  }, [form.id_direction, services]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Modifier utilisateur" : "Ajouter utilisateur"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input name="matricule" placeholder="Matricule" onChange={handleChange} value={form.matricule} />
          <input name="login" placeholder="Login" onChange={handleChange} value={form.login} />
          <input name="nom_utilisateur" placeholder="Nom" onChange={handleChange} value={form.nom_utilisateur} />
          <input name="prenom_utilisateur" placeholder="Prénom" onChange={handleChange} value={form.prenom_utilisateur} />
          <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />

          <select name="id_role" onChange={handleChange} value={form.id_role}>
            <option value="">-- Rôle --</option>
            {roles.map(r => (
              <option key={r.id_role} value={r.id_role}>
                {r.role_nom}
              </option>
            ))}
          </select>

          <select name="id_direction" onChange={handleChange} value={form.id_direction}>
            <option value="">-- Direction --</option>
            {directions.map(d => (
              <option key={d.id_direction} value={d.id_direction}>
                {d.direction_nom}
              </option>
            ))}
          </select>

          <select name="id_service" onChange={handleChange} value={form.id_service}>
            <option value="">-- Service --</option>
            {filteredServices.map(s => (
              <option key={s.id_service} value={s.id_service}>
                {s.service_nom}
              </option>
            ))}
          </select>

          <div className="col-span-2 flex justify-end gap-4 mt-4">
            <button type="button" onClick={onClose}>Annuler</button>
            <button type="submit" className="bg-douane-primary text-white px-6 py-2 rounded">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
