import { FileSearch, DollarSign } from "lucide-react";

export default function ValeursRecents({ valeurs = [] }) {
  const dernieresValeurs = valeurs.slice(-5).reverse();

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Valeurs récentes</h2>

      {dernieresValeurs.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">
          Aucune valeur récemment ajoutée.
        </p>
      ) : (
        <ul className="space-y-4">
          {dernieresValeurs.map((v) => (
            <li
              key={v.id}
              className="flex items-center justify-between border-b pb-3 last:border-none"
            >
              {/* Gauche */}
              <div>
                <p className="font-semibold text-gray-800 flex items-center gap-2">
                  <FileSearch
                    size={18}
                    className="text-douane-primary"
                  />
                  {v.codesh} – {v.descrip.slice(0, 25)}...
                </p>
                <p className="text-xs text-gray-500">
                  Origine :
                  <span className="font-medium"> {v.pays_destinataire}</span>
                </p>
              </div>

              {/* Droite */}
              <p className="flex items-center gap-1 text-douane-secondary font-semibold">
                <DollarSign size={16} />
                {v.pu_fact} USD
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
