import React, { useState } from "react";
import {
  PagamentosService,
  PagamentoFormData as PagamentoFormInterface,
} from "../services/api.pagamentoService";

interface Props {
  onPagamentoCriado: (novoPagamento: any) => void;
}

const PagamentoForm: React.FC<Props> = ({ onPagamentoCriado }) => {
  const [valor, setValor] = useState<number>(0);
  const [metodo, setMetodo] = useState<"cartao" | "pix" | "boleto">("pix");
  const [mensagem, setMensagem] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const service = new PagamentosService();
    const cuidadorId = "123";

    const form: PagamentoFormInterface = { valor, metodo };

    try {
      const resultado = await service.criarPagamento(cuidadorId, form.valor);
      setMensagem("✅ Pagamento criado com sucesso!");
      onPagamentoCriado(resultado.data);
    } catch (error: any) {
      setMensagem(` Erro: ${error.message}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 max-w-md mx-auto space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
        Pagamento
      </h2>

      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-1">
          Valor:
        </label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-1">
          Método:
        </label>
        <select
          value={metodo}
          onChange={(e) => setMetodo(e.target.value as any)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="cartao">Cartão</option>
          <option value="pix">Pix</option>
          <option value="boleto">Boleto</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
      >
        Enviar
      </button>

      {mensagem && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{mensagem}</p>
      )}
    </form>
  );
};

export default PagamentoForm;
