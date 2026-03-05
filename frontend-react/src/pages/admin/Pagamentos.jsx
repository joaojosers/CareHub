import { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";

import PageTitle from "../../components/ui/PageTitle";
import DetailCard from "../../components/ui/DetailCard";
import StatusBadge from "../../components/ui/StatusBadge";

export default function Financeiro() {
  const [relatorio, setRelatorio] = useState([]);
  const [loading, setLoading] = useState(false);

  const carregarTodosPagamentos = useCallback(async () => {
    try {
      setLoading(true);
      // Chamada para a listagem geral de pagamentos
      const response = await api.get("/pagamentos"); 
      
      // Ajuste para aceitar tanto array direto quanto objeto com detalhes
      const dados = Array.isArray(response.data) ? response.data : (response.data.detalhes || []);
      setRelatorio(dados);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar pagamentos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarTodosPagamentos();
  }, [carregarTodosPagamentos]);

  const handleProcessarPagamento = async (pagamentoId) => {
    if (!window.confirm("Deseja processar este pagamento via Mercado Pago agora?")) return;
    try {
      await api.patch(`/pagamentos/${pagamentoId}/processar`);
      toast.success("Pagamento enviado ao Mercado Pago!");
      carregarTodosPagamentos();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erro no gateway de pagamento.");
    }
  };

  const handleConfirmarManual = async (pagamentoId) => {
    if (!window.confirm("Confirmar que o PIX foi feito manualmente fora da plataforma?")) return;
    try {
      await api.patch(`/pagamentos/${pagamentoId}/confirmar-pagamento`);
      toast.success("Pagamento confirmado manualmente.");
      carregarTodosPagamentos();
    } catch (error) {
      toast.error("Erro ao confirmar pagamento.");
    }
  };

  const formatCurrency = (value) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value) || 0);

  const totalGeral = relatorio.reduce((acc, curr) => acc + Number(curr.valorLiquido || 0), 0);

  return (
    <>
      <PageTitle title="Gestão Financeira" />

      <div style={{ marginBottom: "25px", display: "flex", justifyContent: "flex-end" }}>
        <div className="summary-box" style={{ background: "#1e293b", padding: "15px 25px", borderRadius: "12px", borderLeft: "4px solid #22c55e" }}>
          <span style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>Total Líquido Acumulado</span>
          <h2 style={{ margin: 0, color: "#22c55e", fontSize: "24px" }}>{formatCurrency(totalGeral)}</h2>
        </div>
      </div>

      <DetailCard>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", minWidth: "950px" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "2px solid #1e293b" }}>
                <th style={{ padding: "12px", width: "12%", color: "#94a3b8" }}>Data</th>
                <th style={{ padding: "12px", width: "23%", color: "#94a3b8" }}>Cuidador</th>
                <th style={{ padding: "12px", width: "8%", color: "#94a3b8" }}>Horas</th>
                <th style={{ padding: "12px", width: "12%", color: "#94a3b8" }}>V. Bruto</th>
                <th style={{ padding: "12px", width: "12%", color: "#94a3b8" }}>V. Líquido</th>
                <th style={{ padding: "12px", width: "13%", color: "#94a3b8" }}>Status</th>
                <th style={{ padding: "12px", width: "20%", textAlign: "right", color: "#94a3b8" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Carregando dados...</td></tr>
              ) : relatorio.length === 0 ? (
                <tr><td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>Nenhum registro financeiro encontrado.</td></tr>
              ) : (
                relatorio.map((pg) => (
                  <tr key={pg.id} style={{ borderBottom: "1px solid #1e293b" }}>
                    <td style={{ padding: "12px", fontSize: "14px", color: "#fff" }}>
                      {new Date(pg.criadoEm).toLocaleDateString('pt-BR')}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ fontWeight: "bold", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {pg.cuidador?.user?.nome || "N/A"}
                      </div>
                      <small style={{ color: "#64748b" }}>{pg.cuidador?.mercadoPago || "Sem chave"}</small>
                    </td>
                    <td style={{ padding: "12px", color: "#fff" }}>{pg.plantao?.horasTrabalhadas || 0}h</td>
                    <td style={{ padding: "12px", color: "#fff" }}>{formatCurrency(pg.valorBruto)}</td>
                    <td style={{ padding: "12px", color: "#22c55e", fontWeight: "bold" }}>{formatCurrency(pg.valorLiquido)}</td>
                    <td style={{ padding: "12px" }}><StatusBadge status={pg.status} /></td>
                    <td style={{ padding: "12px", textAlign: "right" }}>
                      {/* BOTAO DE AÇÕES APARECE APENAS SE ESTIVER PENDENTE */}
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        {pg.status === "PENDENTE" ? (
                          <>
                            <button 
                              className="btn-view" 
                              onClick={() => handleConfirmarManual(pg.id)} 
                              style={{ padding: "6px 10px", fontSize: "11px", whiteSpace: "nowrap" }}
                            >
                              Confirmar PIX
                            </button>
                            <button 
                              className="btn-primary" 
                              onClick={() => handleProcessarPagamento(pg.id)} 
                              style={{ padding: "6px 10px", fontSize: "11px", whiteSpace: "nowrap" }}
                            >
                              Pagar Agora
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>Concluído</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DetailCard>
    </>
  );
}