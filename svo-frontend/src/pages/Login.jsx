// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // mock login: accept anything non-empty
    if (!login || !password) return alert("Remplissez tous les champs");
    // set session (mock) then redirect
    localStorage.setItem("svo_user", JSON.stringify({ prenom: login }));
    nav("/dashboard");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-xl shadow-lg w-96" onSubmit={handleLogin}>
        <h2 className="text-2xl font-semibold mb-6 text-center">Connexion</h2>

        <label className="block mb-2 font-medium">Login</label>
        <input
          type="text"
          className="w-full mb-4 px-3 py-2 border rounded-lg"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />

        <label className="block mb-2 font-medium">Mot de pass</label>
        <input
          type="password"
          className="w-full mb-4 px-3 py-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg hover:bg-blue-700">Se connecter</button>
      </form>
    </div>
  );
}
