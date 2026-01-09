import Layout from "../components/Layout";
import { Users, UserCheck, Shield, UserMinus, Clock } from "lucide-react";

export default function DashboardAdmin() {
  // ➜ Données statiques provisoires (API Django plus tard)
  const stats = {
    total: 12,
    actifs: 9,
    admins: 2,
    inactifs: 3,
  };

  const logs = [
    { id: 1, user: "Naivo", action: "Connexion", ip: "192.168.1.5", date: "Aujourd’hui 09:12" },
    { id: 2, user: "Admin", action: "Ajout utilisateur", ip: "192.168.1.8", date: "Aujourd’hui 08:40" },
    { id: 3, user: "Rasoa", action: "Consultation valeur 010100", ip: "192.168.1.12", date: "Hier 16:22" },
  ];

  const roles = [
    { role: "ADMIN", count: 2 },
    { role: "VALIDATEUR", count: 3 },
    { role: "SAISIE", count: 5 },
    { role: "IMPORT", count: 1 },
  ];

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-douane-primary mb-8">
        Dashboard – Administrateur
      </h1>

      {/* STATISTIQUES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

        <CardStat
          title="Total utilisateurs"
          value={stats.total}
          icon={<Users size={28} />}
          color="bg-blue-100 text-blue-700 border-blue-500"
        />

        <CardStat
          title="Actifs"
          value={stats.actifs}
          icon={<UserCheck size={28} />}
          color="bg-green-100 text-green-700 border-green-500"
        />

        <CardStat
          title="Administrateurs"
          value={stats.admins}
          icon={<Shield size={28} />}
          color="bg-yellow-100 text-yellow-700 border-yellow-500"
        />

        <CardStat
          title="Inactifs"
          value={stats.inactifs}
          icon={<UserMinus size={28} />}
          color="bg-red-100 text-red-700 border-red-500"
        />
      </div>

      {/* LOGS ACTIONS */}
      <div className="bg-white shadow rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Dernières activités</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3">Utilisateur</th>
              <th className="p-3">Action</th>
              <th className="p-3">Adresse IP</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{log.user}</td>
                <td className="p-3">{log.action}</td>
                <td className="p-3">{log.ip}</td>
                <td className="p-3">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ROLES & PERMISSIONS */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Rôles & Permissions</h2>

        <ul className="space-y-3">
          {roles.map((r) => (
            <li
              key={r.role}
              className="flex justify-between items-center border-b pb-2"
            >
              <span className="font-medium">{r.role}</span>
              <span className="text-douane-primary font-semibold">{r.count} utilisateurs</span>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}

// 🔹 Composant carte statistique
function CardStat({ title, value, icon, color }) {
  return (
    <div
      className={`p-5 bg-white shadow rounded-xl border-l-4 flex items-center gap-4 ${color}`}
    >
      <div className="p-3 rounded-full bg-white shadow">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
