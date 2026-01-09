import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Bell,
  BookOpen,
  ClipboardCheck,
  FileSearch,
  Archive,
  Users,
  LogOut // Ajout de l'icône
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";

export default function Sidebar({ collapsed }) {
  const location = useLocation();
  const { user, logout } = useAuth(); // Récupération du logout

  // On récupère le rôle. Note : vérifie si ton backend envoie 'role' ou 'id_role.role_nom'
  const role = user?.role || user?.id_role?.role_nom || "ADMIN";

  const isActive = (path) => location.pathname.startsWith(path);

  const menus = {
    ADMIN: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Gestion utilisateurs",
        icon: Users,
        children: [
          { label: "Utilisateurs", path: "/utilisateurs" },
          { label: "Directions / Services", path: "/direction" }, 
        ],
      },
      {
        label: "Gestion des valeurs",
        icon: FileText,
        children: [
          { label: "Saisie manuelle", path: "/valeurs" },
          { label: "Import Excel", path: "/import" },
          { label: "Extraction Sydonia", path: "/extraction" },
        ],
      },
    ],

    ANALYSTE: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Valeurs",
        icon: FileText,
        children: [
          { label: "Consulter valeurs", path: "/valeurs" },
        ],
      },
    ],

    VALIDATEUR: [
      {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Validation",
        icon: ClipboardCheck,
        children: [
          { label: "En attente", path: "/valeurs" }, // Ajusté selon tes routes
        ],
      },
    ],

    STANDARD: [
      {
        label: "Consultation valeurs",
        path: "/valeurs",
        icon: FileSearch,
      },
    ],
  };

  const currentMenu = menus[role] || menus["ADMIN"]; // Fallback sur ADMIN si rôle inconnu

  return (
    <aside
      className={`h-screen bg-douane-primary text-white transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-5 border-b border-douane-secondary text-center">
        <h1 className="font-bold text-lg">
          {collapsed ? "SVO" : "SVO-Export"}
        </h1>
      </div>

      {/* Menu - flex-1 permet de pousser le bouton logout vers le bas */}
      <nav className="mt-4 flex flex-col gap-1 flex-1 overflow-y-auto">
        {currentMenu.map((item, index) => {
          const Icon = item.icon;

          // ===== MENU AVEC SOUS-MENU (DROPDOWN) =====
          if (item.children) {
            return (
              <div key={index} className="group relative">
                <div className="flex items-center gap-4 px-5 py-3 cursor-pointer hover:bg-douane-secondary transition-colors">
                  {Icon && <Icon size={20} />}
                  {!collapsed && <span className="flex-1">{item.label}</span>}
                  {!collapsed && <span className="text-xs opacity-50">▶</span>}
                </div>

                {/* Sous-menu flottant */}
                <div
                  className={`absolute ${
                    collapsed ? "left-20" : "left-48"
                  } top-0 hidden group-hover:block bg-white text-gray-800 rounded-md shadow-2xl min-w-[200px] z-[100] border border-gray-200`}
                >
                  <div className="py-2">
                    <p className="px-4 py-1 text-xs font-bold text-douane-primary uppercase border-b mb-1">
                      {item.label}
                    </p>
                    {item.children.map((sub, subIndex) => (
                      <Link
                        key={subIndex}
                        to={sub.path}
                        className={`block px-4 py-2 text-sm hover:bg-blue-50 hover:text-douane-primary ${
                          isActive(sub.path) ? "bg-blue-50 text-douane-primary font-bold" : ""
                        }`}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          // ===== MENU SIMPLE =====
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-3 hover:bg-douane-secondary transition-colors ${
                isActive(item.path) ? "bg-douane-secondary border-l-4 border-white" : ""
              }`}
            >
              {Icon && <Icon size={20} />}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ===== BOUTON LOGOUT ===== */}
      <div className="p-2 border-t border-douane-secondary">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-4 px-5 py-3 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="font-medium">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}