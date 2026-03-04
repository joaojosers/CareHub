"use client";

import { useEffect, useState } from "react";
import { PagamentosService, PagamentoFormData } from "../services/api.pagamentoService";

export default function Page() {
  const [pagamentos, setPagamentos] = useState<PagamentoFormData[]>([]);
  const [form, setForm] = useState<PagamentoFormData>({
    valor: 0,
    metodo: "pix",
  });

  const service = new PagamentosService();

  // Carregar lista de pagamentos ao montar
  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await service.listarPagamentos();
        setPagamentos(resposta.data);
      } catch (erro) {
        console.error("Erro ao listar pagamentos:", erro);
      }
    }
    carregar();
  }, []);

  // Criar novo pagamento
  async function criarPagamento() {
    try {
      const resposta = await service.criarPagamento("123", form.valor);
      alert("Pagamento criado com sucesso!");
      setPagamentos([...pagamentos, resposta.data]);
    } catch (erro) {
      console.error("Erro ao criar pagamento:", erro);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-8">
      <h1 className="text-2xl font-bold text-black dark:text-zinc-50 mb-6">
        Gerenciamento de Pagamentos
      </h1>

      {/* Formulário de criação */}
      <div className="flex flex-col gap-4 mb-8 w-full max-w-md">
        <input
          type="number"
          placeholder="Valor"
          value={form.valor}
          onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })}
          className="border rounded p-2"
        />
        <select
          value={form.metodo}
          onChange={(e) =>
            setForm({ ...form, metodo: e.target.value as PagamentoFormData["metodo"] })
          }
          className="border rounded p-2"
        >
          <option value="pix">Pix</option>
          <option value="cartao">Cartão</option>
          <option value="boleto">Boleto</option>
        </select>
        <button
          onClick={criarPagamento}
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          Criar Pagamento
        </button>
      </div>

      {/* Lista de pagamentos */}
      <ul className="w-full max-w-md space-y-2">
        {pagamentos.map((p, index) => (
          <li
            key={index}
            className="border rounded p-3 flex justify-between items-center"
          >
            <span>
              {p.valor} - {p.metodo}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Status: {p.status}
            </span>
          </li>
        ))}
      </ul>
    </main>
  );
}
