import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import "../../styles/ui.css";

export default function CuidadorDashboard() {
  const navigate = useNavigate();
  const { usuario, logout } = useContext(AuthContext);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função de Cálculo de Idade
  const calcularIdade = (dataNasc) => {
    if (!dataNasc) return "N/A";
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade;
  };

  useEffect(() => {
    if (!usuario) {
      navigate("/login");
      return;
    }

    async function fetchMeusPacientes() {
      try {
        setLoading(true);
        const response = await api.get(`/cuidadores/${usuario.id}/pacientes`);
        setPacientes(response.data);
      } catch (error) {
        console.error("Erro ao carregar pacientes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMeusPacientes();
  }, [usuario, navigate]);

  if (!usuario) return null;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>Bem-vindo, {usuario.nome ? usuario.nome.split(" ")[0] : "Cuidador"}!</h1>
          <p className="subtitle">Seu painel de monitoramento e cuidados</p>
        </div>
        <div className="header-actions">
          <span className="badge-success">Status: {usuario.status || "Ativo"}</span>
        </div>
      </header>

      <main className="admin-main">
        <section className="stats-grid">
          <div className="stat-card">
            <center>
              <h3>Pacientes Ativos</h3>
              <p className="stat-number">{pacientes.length}</p>
            </center>
          </div>
          <div className="stat-card">
            <center>  
              <h3>Próximo Plantão</h3>
              <p className="stat-label" style={{color: 'black'}}>Hoje, 19:00</p>
            </center>
          </div>
        </section>

        <section className="table-section">
          <div className="section-header">
            <h2 style={{color: '#fff', marginBottom: '20px', marginTop: '30px'}}>Meus Pacientes</h2>
          </div>

          {loading ? (
            <div className="loading-state">Carregando lista de pacientes...</div>
          ) : pacientes.length > 0 ? (
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Idade</th>
                  <th>Localização</th>
                  
                </tr>
              </thead>
              <tbody>
                {pacientes.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="user-info">
                        <strong>{p.nome || "Não informado"}</strong>
                        <span>{p.condicaoPrincipal || "Monitoramento Geral"}</span>
                      </div>
                    </td>
                    <td>{p.dataNascimento ? `${calcularIdade(p.dataNascimento)} anos` : "N/A"}</td>
                    <td>
                      {p.endereco ? 
                        `${p.endereco.cidade || p.endereco.city} - ${p.endereco.estado || p.endereco.state}` : 
                        "Não informado"
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state-card">
              <p>Nenhum paciente vinculado ao seu perfil no momento.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}