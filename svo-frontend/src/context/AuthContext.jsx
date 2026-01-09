import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("svo_user");

    if (stored && stored !== "undefined") {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("svo_user");
      }
    }

    setReady(true);
  }, []);

  const login = (data) => {
    localStorage.setItem("svo_access", data.access);
    localStorage.setItem("svo_refresh", data.refresh);
    localStorage.setItem("svo_user", JSON.stringify(data.utilisateur));
    setUser(data.utilisateur);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
