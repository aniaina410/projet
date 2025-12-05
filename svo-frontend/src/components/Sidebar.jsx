// // src/components/Sidebar.jsx
// import React from "react";
// import { NavLink } from "react-router-dom";

// const MenuItem = ({ to, children }) => (
//   <NavLink
//     to={to}
//     className={({ isActive }) =>
//       `flex items-center gap-3 px-3 py-2 rounded-md text-sm ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`
//     }
//   >
//     {children}
//   </NavLink>
// );

// export default function Sidebar({ className = "" }) {
//   return (
//     <aside className={`w-64 bg-white border-r hidden md:flex flex-col p-4 ${className}`}>
//       <div className="mb-6">
//         <div className="text-2xl font-bold text-blue-600">SVO-Export</div>
//         <div className="text-xs text-gray-500 mt-1">Plateforme de gestion des valeurs</div>
//       </div>

//       <nav className="flex-1 space-y-1">
//         <MenuItem to="/dashboard">Dashboard</MenuItem>
//         <MenuItem to="/valeurs">Valeurs</MenuItem>
//         <MenuItem to="/extraction">Extraction Sydonia</MenuItem>
//         <MenuItem to="/validation">Validation</MenuItem>
//         <MenuItem to="/import">Importer (Excel)</MenuItem>
//         <MenuItem to="/utilisateurs">Utilisateurs</MenuItem>
//         <MenuItem to="/logs">Journal</MenuItem>
//         <MenuItem to="/notifications">Notifications</MenuItem>
//       </nav>

//       <div className="mt-auto text-xs text-gray-500">
//         <div>Version: 1.0</div>
//         <div className="mt-2">© {new Date().getFullYear()}</div>
//       </div>
//     </aside>
//   );
// }
