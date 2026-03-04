import axios from "axios";
import api from "./api";

export interface PagamentoFormData {
  valor: number;
  metodo: "cartao" | "pix" | "boleto";
  status?: string;
}

export class PagamentosService {
  async criarPagamento(cuidadorId: string, valor: number) {
  try {
    const response = await api.post(`/pagamentos/${cuidadorId}`, { valor });
    return response.data;
  } catch (error: any) {
    const mensagem = error.response?.data?.message || "ID incorreto ou inválido.";
    alert(mensagem); // ou toast.error(mensagem)
    throw error; // mantém o erro para quem chamou esse método
  }
}


  async listarPagamentos() {
    const resposta = await axios.get("/pagamentos");

    // Normaliza para sempre ser array
    const data = resposta.data;
    if (Array.isArray(data)) {
      return { data };
    }
    if (data && typeof data === "object") {
      return { data: [data] };
    }
    return { data: [] };
  }

  async buscarPagamentoPorId(id: number) {
    return axios.get(`/pagamentos/${id}`);
  }

  async atualizarStatus(id: number, status: string) {
    return axios.patch(`/pagamentos/${id}/status`, { status });
  }
}

     











