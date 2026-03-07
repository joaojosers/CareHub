import { api } from "./api";

export const loginRequest = async (email, password) => {
  // Calls the correct backend endpoint: POST /auth/login
  // The backend field name is 'senha' (Portuguese), not 'password'
  const response = await api.post("/auth/login", {
    email,
    senha: password,
  });

  // Returns { access_token, user } from the backend JWT response
  return response.data;
};
