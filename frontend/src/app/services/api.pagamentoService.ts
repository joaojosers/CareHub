import axios from "axios";

export interface PagamentoForm {
  valor: number;
  metodo: "cartao" | "pix" | "boleto";
}

export class PagamentosService {
  async criarPagamento(cuidadorId: string, valor: number) {
    // Bate com o controller: POST /pagamentos/:cuidadorId { valor }
    return axios.post(`/pagamentos/${cuidadorId}`, { valor });
  }

  async listarPagamentos() {
    // Bate com o controller: GET /pagamentos
    return axios.get("/pagamentos");
  }

  async buscarPagamentoPorId(id: number) {
    // Bate com o controller: GET /pagamentos/:id
    return axios.get(`/pagamentos/${id}`);
  }

  async atualizarStatus(id: number, status: string) {
    // Bate com o controller: PATCH /pagamentos/:id/status { status }
    return axios.patch(`/pagamentos/${id}/status`, { status });
  }
}
