import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/ui.css";

export default function PacientesFamiliar() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarPacientes = async () => {
      try {
        setLoading(true);
        const userJson = localStorage.getItem("@App:user");
        if (!userJson) return;

        const userStored = JSON.parse(userJson);
        const res = await api.get(`/users/${userStored.id}`);

        if (res.data && res.data.familiares) {
          const pacientesExtraidos = res.data.familiares.map(v => v.paciente);
          setPacientes(pacientesExtraidos);
        }
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
      } finally {
        setLoading(false);
      }
    };
    carregarPacientes();
  }, []);

  if (loading) return <div className="loading-state">Carregando pacientes...</div>;

  return (
    <div className="admin-container">
      <div className="page-title">
        <h1>Meus Dependentes</h1>
        <p> Gerencie e acompanhe o histórico de cuidados dos seus dependentes.</p>
      </div>

      {pacientes.length === 0 ? (
        <div className="empty-state-card">
          <p>Nenhum paciente vinculado à sua conta no momento.</p>
        </div>
      ) : (
        <div className="detail-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {pacientes.map((paciente) => (
            <div key={paciente.id} className="detail-card" style={{ borderTop: '4px solid #8b5cf6', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* Cabeçalho do Card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '5px' }}>{paciente.nome}</h2>
                  <span className="badge-success" style={{ fontSize: '11px', padding: '4px 10px' }}>
                    {paciente.status}
                  </span>
                </div>
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '10px', borderRadius: '50%' }}>
                  👤
                </div>
              </div>

              <hr style={{ borderColor: '#334155', margin: '5px 0' }} />

              {/* Informações de Endereço */}
              <div className="detail-item">
                <span className="detail-label">Local de Atendimento</span>
                <span className="detail-value" style={{ fontSize: '14px' }}>
                  {paciente.endereco?.logradouro ? (
                    `${paciente.endereco.logradouro}, ${paciente.endereco.numero}`
                  ) : (
                    <em style={{ color: '#64748b' }}>Endereço não cadastrado</em>
                  )}
                </span>
                {paciente.endereco?.bairro && (
                  <span className="detail-value" style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {paciente.endereco.bairro} - {paciente.endereco.cidade}
                  </span>
                )}
              </div>

              {/* Ações */}
              <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
                <button 
                  className="btn-view" 
                  style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                  onClick={() => navigate(`/familiar/relatorios/${paciente.id}`)}
                >
                  <span>📋</span> Ver historico de cuidados
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}