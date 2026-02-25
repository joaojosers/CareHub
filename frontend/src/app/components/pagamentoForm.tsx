import React, { useState } from "react";
import { PagamentosService, PagamentoForm as PagamentoFormInterface } from "../services/api.pagamentoService";

const PagamentoForm: React.FC = () => {
  const [valor, setValor] = useState<number>(0);
  const [metodo, setMetodo] = useState<"cartao" | "pix" | "boleto">("pix");
  const [mensagem, setMensagem] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const service = new PagamentosService();

    // cuidadorId pode vir de props ou contexto; aqui está fixo só como exemplo
    const cuidadorId = "123"; 

    // Usa a interface apenas como tipo, sem conflito de nomes
    const form: PagamentoFormInterface = { valor, metodo };

    try {
      // O backend espera POST /pagamentos/:cuidadorId { valor }
      const resultado = await service.criarPagamento(cuidadorId, form.valor);
      setMensagem(`Pagamento criado com sucesso: ${JSON.stringify(resultado.data)}`);
    } catch (error: any) {
      setMensagem(`Erro: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Pagamento</h2>
      <div>
        <label>Valor:</label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Método:</label>
        <select value={metodo} onChange={(e) => setMetodo(e.target.value as any)}>
          <option value="cartao">Cartão</option>
          <option value="pix">Pix</option>
          <option value="boleto">Boleto</option>
        </select>
      </div>
      <button type="submit">Enviar</button>
      {mensagem && <p>{mensagem}</p>}
    </form>
  );
};

export default PagamentoForm;
