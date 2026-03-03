import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/ui.css";

export default function FinanceiroAdmin() {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState("");

  useEffect(() => {
    carregarPagamentos();
  }, [filtroStatus]);

  async function carregarPagamentos() {
    try {
      setLoading(true);
      // Chama seu método findAll com filtro de status opcional
      const res = await api.get(`/pagamentos`, { params: { status: filtroStatus } });
      setPagamentos(res.data);
    } catch (error) {
      console.error("Erro ao buscar pagamentos");
    } finally {
      setLoading(false);
    }
  }

  async function handleProcessar(id) {
    if (!window.confirm("Deseja marcar como PROCESSADO?")) return;
    try {
      await api.patch(`/pagamentos/${id}/processar`); // Rota para marcarComoProcessado
      carregarPagamentos();
    } catch (err) { alert("Erro ao processar"); }
  }

  async function handleConfirmar(id) {
    const comprovante = prompt("Digite o número do comprovante/transação:");
    if (!comprovante) return;
    try {
      await api.patch(`/pagamentos/${id}/confirmar`, { numeroComprovante: comprovante });
      carregarPagamentos();
    } catch (err) { alert("Erro ao confirmar"); }
  }

  return (
    <div className="admin-container">
      <div className="page-title">
        <h1>Financeiro & Repasses</h1>
        <select onChange={(e) => setFiltroStatus(e.target.value)} className="btn-view" style={{background: '#1e293b', width: 'auto'}}>
          <option value="">Todos os Status</option>
          <option value="PENDENTE">Pendentes</option>
          <option value="PROCESSADO">Prontos p/ Pagar</option>
          <option value="PAID">Pagos</option>
        </select>
      </div>

      <div className="detail-card" style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Cuidador</th>
              <th>Horas</th>
              <th>Valor Bruto</th>
              <th>Líquido</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.map((p) => (
              <tr key={p.id}>
                <td>{new Date(p.criadoEm).toLocaleDateString()}</td>
                <td>{p.cuidador?.user?.nome}</td>
                <td>{p.plantao?.horasTrabalhadas}h</td>
                <td>R$ {Number(p.valorBruto).toFixed(2)}</td>
                <td style={{ color: '#10b981', fontWeight: 'bold' }}>R$ {Number(p.valorLiquido).toFixed(2)}</td>
                <td>
                  <span className={`badge-${p.status.toLowerCase()}`}>{p.status}</span>
                </td>
                <td>
                  {p.status === 'PENDENTE' && (
                    <button onClick={() => handleProcessar(p.id)} className="btn-approve">Validar</button>
                  )}
                  {p.status === 'PROCESSADO' && (
                    <button onClick={() => handleConfirmar(p.id)} className="btn-view">Confirmar PIX</button>
                  )}
                  {p.status === 'PAID' && <span style={{fontSize: '12px', color: '#94a3b8'}}>ID: {p.numeroComprovante}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}