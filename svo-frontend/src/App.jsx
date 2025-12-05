// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Valeurs from "./pages/Valeurs";

function PrivateRoute({ children }) {
  const user = localStorage.getItem("svo_user");
  return user ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        {
          <Route path="/valeurs" element={<Valeurs />} />
        }
      </Routes>
    </BrowserRouter>
  );
}
