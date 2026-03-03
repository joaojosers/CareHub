import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // Padronizamos as chaves para bater com o Dashboard e Login
  const USER_KEY = "@App:user";
  const TOKEN_KEY = "@App:token";

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUsuario(parsedUser);
        api.defaults.headers.Authorization = `Bearer ${storedToken}`;
      } catch (e) {
        // Se o JSON estiver corrompido, limpa tudo
        localStorage.clear();
      }
    }

    setLoading(false);
  }, []);

  async function login(email, senha) {
    // Faz a chamada para a sua API NestJS
    const response = await api.post("/auth/login", {
      email,
      senha
    });

    // Desestruturando conforme o retorno padrão do seu NestJS
    const { access_token, user } = response.data;

    // Salvando com as chaves corretas
    localStorage.setItem(TOKEN_KEY, access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    api.defaults.headers.Authorization = `Bearer ${access_token}`;

    setUsuario(user);

    return user;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete api.defaults.headers.Authorization;
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, authenticated: !!usuario }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}