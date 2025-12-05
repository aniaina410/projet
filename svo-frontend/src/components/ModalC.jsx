export default function ModalC({ visible, onClose, onSubmit, onChange, onImageUpload }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50">
      <div className="bg-white w-[95%] max-w-7xl p-8 rounded-xl shadow-xl overflow-y-auto max-h-[90vh]">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-3xl font-bold text-douane-primary">Ajouter une valeur</h2>
          <button
            onClick={onClose}
            className="text-red-500 font-bold text-2xl hover:text-red-700"
          >
            ✕
          </button>
        </div>

        {/* FORMULAIRE */}
        <form onSubmit={onSubmit} className="grid grid-cols-3 gap-8">

          {/* COLONNE 1 */}
          <div className="space-y-4">
            <Field label="Code SH" name="codesh" onChange={onChange} required />
            <Field label="Unité" name="unite" onChange={onChange} />
            <Field label="Quantité" name="quantite" type="number" onChange={onChange} />
            <Field label="PU Facture" name="pu_fact" type="number" onChange={onChange} />
            <Field label="PU Redressement" name="pu_redr" type="number" onChange={onChange} />
            <Field label="Méthode" name="methode" onChange={onChange} />
            <Field label="Incoterm" name="incoterm" onChange={onChange} />
          </div>

          {/* COLONNE 2 */}
          <div className="space-y-4">
            <Field label="Devise" name="devise" onChange={onChange} />
            <Field label="Source" name="source" onChange={onChange} />
            <Field label="Référence Facture" name="ref_fact" onChange={onChange} />

            <div>
              <label className="block font-semibold">Statut</label>
              <select name="status" onChange={onChange} className="input-field">
                <option value="EN_ATTENTE">EN_ATTENTE</option>
                <option value="VALIDE">VALIDÉ</option>
                <option value="REJETE">REJETÉ</option>
              </select>
            </div>

            <Field label="Poids Brut" name="poid_brut" type="number" onChange={onChange} />
            <Field label="Poids Net" name="poid_net" type="number" onChange={onChange} />
            <Field label="Conditionnement" name="conditionnement" onChange={onChange} />
          </div>

          {/* COLONNE 3 */}
          <div className="space-y-4">
            <Field label="Exportateur" name="exportateur" onChange={onChange} />
            <Field label="Importateur" name="importateur" onChange={onChange} />
            <Field label="Pays destinataire" name="pays_destinataire" onChange={onChange} />
            <Field label="Date effet" name="date_effet" type="date" onChange={onChange} />

            <div>
              <label className="block font-semibold">Description</label>
              <textarea name="descrip" onChange={onChange} className="input-field"></textarea>
            </div>

            <div>
              <label className="block font-semibold">Détails Marchandise</label>
              <textarea name="details_marchandise" onChange={onChange} className="input-field"></textarea>
            </div>

            <div>
              <label className="block font-semibold">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="input-field"
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div className="col-span-3 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-8 py-2 bg-douane-primary text-white rounded-lg hover:bg-douane-secondary"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* PETIT COMPOSANT RÉUTILISABLE POUR RÉDUIRE LE CODE */
function Field({ label, name, type = "text", onChange, required = false }) {
  return (
    <div>
      <label className="block font-semibold">{label}</label>
      <input
        name={name}
        type={type}
        onChange={onChange}
        required={required}
        className="input-field"
      />
    </div>
  );
}
