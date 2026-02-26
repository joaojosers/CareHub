import { api } from "./api";

export const loginRequest = async (email, password) => {
  const response = await api.get("/users", {
    params: { email, password }
  });

  return response.data[0]; // retorna o primeiro usuário encontrado
};
