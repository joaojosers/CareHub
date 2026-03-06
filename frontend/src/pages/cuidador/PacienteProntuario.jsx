import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/ui.css";

export default function PacienteProntuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [paciente, setPaciente] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  const calcularIdade = (dataNasc) => {
    if (!dataNasc) return "-";
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return `${idade} anos`;
  };

  useEffect(() => {
    async function carregarProntuario() {
      try {
        setLoading(true);
        const res = await api.get(`/pacientes/${id}`);
        setPaciente(res.data);
        if (res.data.plantoes) {
          setHistorico(res.data.plantoes);
        }
      } catch (error) {
        console.error("Erro ao carregar registros:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarProntuario();
  }, [id]);

  if (loading) return <div className="loading-state">Carregando dados...</div>;

  return (
    <div className="admin-container">
      {/* Cabeçalho de Navegação */}
      <div className="page-title">
        <button onClick={() => navigate(-1)} className="btn-secondary" style={{ width: 'auto' }}>
          ← Voltar
        </button>
        <h1>Histórico dos cuidados diários</h1>
      </div>

      <div className="detail-card">
        {/* Bloco 1: Informações Gerais */}
        <div className="detail-section">
          <h3>Dados do Paciente</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">NOME</span>
              <span className="detail-value">{paciente?.nome}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">IDADE</span>
              <span className="detail-value">{calcularIdade(paciente?.dataNascimento)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">STATUS</span>
              <div>
                <span className={paciente?.status ? "badge-success" : "btn-danger"} style={{ padding: '2px 10px', borderRadius: '4px', fontSize: '11px' }}>
                  {paciente?.status ? "ATIVO" : "INATIVO"}
                </span>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-label">NECESSIDADES / CUIDADOS</span>
              <span className="detail-value" style={{ color: '#f59e0b' }}>{paciente?.necessidades || "Nenhuma informada"}</span>
            </div>
          </div>
        </div>

        {/* Bloco 2: Endereço (Destaque para o Cuidador) */}
        <div className="detail-section" style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ border: 'none', color: '#8b5cf6', fontSize: '16px' }}>📍 Localização de Atendimento</h3>
          {paciente?.endereco ? (
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">RUA / NÚMERO</span>
                <span className="detail-value">{paciente.endereco.logradouro}, {paciente.endereco.numero}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">BAIRRO / CIDADE</span>
                <span className="detail-value">{paciente.endereco.bairro} - {paciente.endereco.cidade}/{paciente.endereco.estado}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">COMPLEMENTO</span>
                <span className="detail-value">{paciente.endereco.complemento || "---"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">CEP</span>
                <span className="detail-value">{paciente.endereco.cep}</span>
              </div>
            </div>
          ) : (
            <span className="detail-value" style={{ color: '#ef4444' }}>Endereço não disponível</span>
          )}
        </div>

        {/* Bloco 3: Histórico de Evoluções */}
        <div className="detail-section">
          <h3>Registros aprovados</h3>
          {historico.length === 0 ? (
            <div className="empty-state">Nenhum registro aprovado para este paciente.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {historico.map((item) => (
                <div key={item.id} className="report-card" style={{ borderLeft: '4px solid #6366f1' }}>
                  {/* Cabeçalho do Card de Evolução */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#8b5cf6' }}>
                      📅 {new Date(item.dataInicio).toLocaleDateString('pt-BR')}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      ⌚ {new Date(item.dataInicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} às {new Date(item.dataFim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Conteúdo Médico */}
                  <div className="detail-item" style={{ marginBottom: '15px' }}>
                    <span className="detail-label">DESCRIÇÃO</span>
                    <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#f1f5f9', marginTop: '5px' }}>
                      {item.relatorioAtividade?.descricao}
                    </p>
                  </div>

                  <div className="detail-grid" style={{ background: 'rgba(0,0,0,0.15)', padding: '15px', borderRadius: '8px' }}>
                    <div className="detail-item">
                      <span className="detail-label">💊 MEDICAÇÕES</span>
                      <span className="detail-value" style={{ fontSize: '14px' }}>{item.relatorioAtividade?.medicacoes || "Nenhuma"}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">🩺 SINAIS VITAIS</span>
                      <span className="detail-value" style={{ fontSize: '14px', color: '#10b981' }}>PA: {item.relatorioAtividade?.pressaoArterial || "N/A"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}