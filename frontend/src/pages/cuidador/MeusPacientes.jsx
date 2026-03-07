import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/ui.css"; 

export default function MeusPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    try {
      setLoading(true);
      // Recupera o usuário do storage (tente os dois padrões comuns)
      const storageUser = localStorage.getItem("@App:user") || localStorage.getItem("user");
      const usuarioLogado = JSON.parse(storageUser);

      // ROTA REAL: Busca pacientes. O backend deve retornar { ..., endereco: { cidade: '...' } }
      const response = await api.get(`/cuidadores/${usuarioLogado.id}/pacientes`);
      
      setPacientes(response.data);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">Carregando pacientes...</div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>Meus Pacientes</h1>
          <p className="subtitle">Visualize os dados e histórico de cuidados</p>
        </div>
      </header>

      <main className="admin-main">
        <div className="detail-card" style={{ padding: 0 }}>
          <table className="ui-table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Idade</th>
                <th>Localização</th>
                <th style={{ textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "40px" }}>
                    Nenhum paciente vinculado no momento.
                  </td>
                </tr>
              ) : (
                pacientes.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="patient-info-cell">
                        <strong>{p.nome}</strong>
                      </div>
                    </td>
                    <td>{calcularIdade(p.dataNascimento)}</td>
                    <td>
                      {/* Acessando a tabela de endereços vinculada */}
                      {p.endereco ? `${p.endereco.bairro} - ${p.endereco.cidade} - ${p.endereco.estado}` : "Não informado"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button 
                        className="btn-view" 
                        onClick={() => navigate(`/cuidador/paciente/${p.id}/prontuario`)}
                      >
                        Ver registros
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}