import { api } from "./api";

export const getCuidadoresPendentes = async () => {
  const response = await api.get("/users", {
    params: {
      role: "CUIDADOR",
      status: "PENDENTE"
    }
  });

  return response.data;
};

export const aprovarCuidador = async (id) => {
  const response = await api.patch(`/users/${id}`, {
    status: "APROVADO"
  });

  return response.data;
};

export const cadastrarCuidador = async (dados) => {
  const response = await api.post("/users", {
    name: dados.name,
    cpf: dados.cpf,
    birthDate: dados.birthDate,
    phone: dados.phone,
    email: dados.email,
    password: dados.password,

    address: {
      street: dados.street,
      number: dados.number,
      city: dados.city,
      state: dados.state,
      zip: dados.zip
    },

    role: "CUIDADOR",
    status: "PENDENTE",
    profileCompleted: false,
    createdAt: new Date().toISOString()
  });

  return response.data;
};


export const verificarEmailExistente = async (email) => {
  const response = await api.get("/users", {
    params: { email }
  });

  return response.data.length > 0;
};
