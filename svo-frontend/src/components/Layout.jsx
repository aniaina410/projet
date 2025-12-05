import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Database,
  CheckCircle,
  Upload,
  Users,
  BookOpen,
  Bell,
  ChevronRight,
  Menu,
} from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();

  // État : sidebar ouverte ou réduite
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Timer pour auto-collapse
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCollapsed(true);
    }, 10000); // 10 secondes

    return () => clearTimeout(timer);
  }, []);

  // Reset du timer quand on survole
  const handleMouseEnter = () => setIsCollapsed(false);
  const handleMouseLeave = () => setIsCollapsed(true);

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={22} /> },
    { name: "Valeurs", path: "/valeurs", icon: <FileText size={22} /> },
    { name: "Extraction Sydonia", path: "/extraction", icon: <Database size={22} /> },
    { name: "Validation", path: "/validation", icon: <CheckCircle size={22} /> },
    { name: "Importer (Excel)", path: "/import", icon: <Upload size={22} /> },
    { name: "Utilisateurs", path: "/utilisateurs", icon: <Users size={22} /> },
    { name: "Journal", path: "/journal", icon: <BookOpen size={22} /> },
    { name: "Notifications", path: "/notifications", icon: <Bell size={22} /> },
  ];

  return (
    <div className="flex bg-douane-light min-h-screen">

      {/* SIDEBAR */}
      <aside
        className={`bg-douane-primary text-white shadow-xl flex flex-col transition-all duration-300
          ${isCollapsed ? "w-20" : "w-64"}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-douane-secondary flex items-center gap-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="bg-douane-secondary p-2 rounded-lg hover:opacity-80"
          >
            <Menu size={20} />
          </button>

          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold">
                SVO<span className="text-douane-gold">-Export</span>
              </h1>
              <p className="text-xs opacity-80">Plateforme de gestion douanière</p>
            </div>
          )}
        </div>

        {/* MENU */}
        <nav className="flex flex-col mt-4 space-y-1">
          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all
                ${location.pathname === item.path
                  ? "bg-douane-secondary text-white"
                  : "hover:bg-douane-secondary hover:text-white"
                }`}
            >
              <span>{item.icon}</span>
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* CONTENU */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}
