import { createContext, useState, useEffect } from "react";
import { api } from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Recupera usuário salvo ao iniciar a aplicação
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.get("/users", {
        params: { email, password }
      });

      const userData = response.data[0];

      if (!userData) {
        throw new Error("Usuário ou senha inválidos");
      }

      if (userData.status !== "APROVADO") {
        throw new Error("Usuário ainda não foi aprovado pelo administrador");
      }

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;

    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
