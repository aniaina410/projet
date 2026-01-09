import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("svo_access");
    if (token && !config.url.includes("auth/login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ NOUVEAU : Intercepteur de réponse pour vider le storage si erreur 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si le serveur renvoie 401 (Non autorisé/Session expirée)
      localStorage.clear(); // 🫵 Vide TOUT automatiquement
      window.location.href = "/login"; // Redirige de force
    }
    return Promise.reject(error);
  }
);

export default api;