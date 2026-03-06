import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/ui.css";
import autoTable from "jspdf-autotable";

export default function DashboardFamiliar() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const userJson = localStorage.getItem("@App:user");
        if (!userJson) return;
        const userStored = JSON.parse(userJson);

        const res = await api.get(`/users/${userStored.id}`);
        setDados(res.data);
      } catch (error) {
        console.error("Erro ao carregar dashboard");
      } finally {
        setLoading(false);
      }
    }
    carregarDashboard();
  }, []);

  if (loading) return <div className="loading-state">Preparando seu painel...</div>;

  // Extrair todos os pacientes dos vínculos
  const pacientes = dados?.familiares.map(v => v.paciente) || [];
  // Pegar o último plantão de qualquer um dos pacientes para destaque
  const todosPlantoes = pacientes.flatMap(p => p.plantoes).sort((a, b) => new Date(b.dataInicio) - new Date(a.dataInicio));
  const ultimoPlantao = todosPlantoes[0];

  return (
    <div className="admin-container">
      <div className="page-title">
        <h1>Olá, {dados?.nome.split(' ')[0]}!</h1>
        Aqui está o resumo dos cuidados hoje.
      </div>

      {/* CARDS DE INDICADORES */}
      <div className="detail-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '30px' }}>
        <div className="detail-card" style={{ borderLeft: '4px solid #8b5cf6', textAlign: 'center' }}>
          <span className="detail-label">Dependentes sob sua responsabilidade</span>
          <h2 style={{ fontSize: '32px', color: '#fff' }}>{pacientes.length}</h2>
        </div>
        <div className="detail-card" style={{ borderLeft: '4px solid #10b981', textAlign: 'center' }}>
          <span className="detail-label">Plantões este mês</span>
          <h2 style={{ fontSize: '32px', color: '#fff' }}>{todosPlantoes.length}</h2>
        </div>
      </div>

      <div className="detail-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* COLUNA ESQUERDA: ÚLTIMA ATIVIDADE */}
<div className="detail-card">
  <h3 style={{ marginBottom: '20px', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '8px' }}>
    📌 Último registro de atendimento
  </h3>
  
  {ultimoPlantao ? (
    <div>
      {/* Container com GAP para separar Badge do Nome */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',      // Espaço entre o badge e o texto
        marginBottom: '15px',
        flexWrap: 'wrap'   // Para não quebrar em telas muito pequenas
      }}>
        <span className="badge-success">
          {new Date(ultimoPlantao.dataInicio).toLocaleDateString()}
        </span>
        
        <span style={{ color: '#f8fafc', fontWeight: '500', fontSize: '15px' }}>
          Paciente: <strong style={{ color: '#fff' }}>
            {pacientes.find(p => p.id === ultimoPlantao.pacienteId)?.nome || "Não encontrado"}
          </strong>
        </span>
      </div>

      {/* Caixa de depoimento/relatório mais destacada */}
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.03)', 
        padding: '15px', 
        borderRadius: '8px',
        borderLeft: '3px solid #8b5cf6' 
      }}>
        <p style={{ 
          color: '#cbd5e1', 
          fontStyle: 'italic', 
          lineHeight: '1.6',
          margin: 0,
          fontSize: '14px'
        }}>
          "{ultimoPlantao.relatorioAtividade?.descricao || "Aguardando preenchimento do relatório pelo cuidador..."}"
        </p>
      </div>
    </div>
  ) : (
    <p style={{ color: '#94a3b8' }}>Nenhuma atividade registrada recentemente.</p>
  )}
</div>
      </div>
    </div>
  
  );
}