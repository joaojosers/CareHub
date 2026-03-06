import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/ui.css";

export default function RelatoriosFamiliar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [historico, setHistorico] = useState([]);
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarRelatorios() {
      try {
        setLoading(true);
        console.log("Buscando dados do paciente ID:", id);
        
        const res = await api.get(`/pacientes/${id}`);
        console.log("Resposta completa do Paciente:", res.data);
        
        setPaciente(res.data);
        
        if (res.data.plantoes && res.data.plantoes.length > 0) {
          // Filtra apenas aprovados
          const aprovados = res.data.plantoes.filter(p => p.status === 'APROVADO');
          console.log("Plantões encontrados:", res.data.plantoes.length);
          console.log("Plantões aprovados:", aprovados.length);
          
          setHistorico(aprovados);
        } else {
          console.warn("Este paciente não possui nenhum plantão registrado no banco.");
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarRelatorios();
  }, [id]);

  if (loading) return <div className="loading-state">Buscando histórico de cuidados...</div>;

  return (
    <div className="admin-container">
      <div className="page-title">
        <button onClick={() => navigate(-1)} className="btn-view" style={{ background: '#334155', width: 'auto', marginRight: '15px' }}>
          ← Voltar
        </button>
        <div>
          <h1 style={{ fontSize: '24px' }}>Histórico de cuidados</h1>
          <p className="subtitle">Paciente: <strong style={{color: '#fff'}}>{paciente?.nome}</strong></p>
        </div>
      </div>

      <div className="detail-card">
        {historico.length === 0 ? (
          <div className="empty-state-card" style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '40px', marginBottom: '20px' }}>📁</div>
            <p style={{ color: '#94a3b8' }}>Não encontramos relatórios aprovados para este paciente.</p>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '10px' }}>
              Os relatórios aparecem aqui assim que são validados pela nossa coordenação.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {historico.map((item) => (
              <div key={item.id} className="report-card" style={{ borderLeft: '4px solid #8b5cf6', background: '#0f172a', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#8b5cf6', fontSize: '16px' }}>
                    📅 {new Date(item.dataInicio).toLocaleDateString('pt-BR')}
                  </span>
                  <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold' }}>✓ VALIDADO</span>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label className="detail-label" style={{ fontSize: '11px', color: '#64748b' }}>EVOLUÇÃO DO CUIDADO</label>
                  <p className="detail-value" style={{ fontSize: '15px', lineHeight: '1.6', marginTop: '5px', color: '#f1f5f9' }}>
                    {item.relatorioAtividade?.descricao || "Sem descrição disponível."}
                  </p>
                </div>

                <div className="detail-grid" style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '15px', borderRadius: '8px' }}>
                   <div>
                      <span className="detail-label">💊 ALIMENTAÇÃO / MEDICAÇÃO</span>
                      <p className="detail-value" style={{ fontSize: '14px' }}>{item.relatorioAtividade?.medicacoes || "Seguiu rotina"}</p>
                   </div>
                   <div>
                      <span className="detail-label">🩺 SINAIS VITAIS</span>
                      <p className="detail-value" style={{ color: '#10b981', fontWeight: 'bold' }}>
                        P.A: {item.relatorioAtividade?.pressaoArterial || "Normal"}
                      </p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}