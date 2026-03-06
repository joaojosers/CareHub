import { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-hot-toast";
import StatusBadge from "../../components/ui/StatusBadge";

export default function DashboardAdmin() {
  // CORREÇÃO 1: Nunca inicie com null se você vai acessar propriedades dele.
  // Iniciamos com um objeto que contém valores padrão (0).
  const [stats, setStats] = useState({
    totalCuidadores: 0,
    totalPacientes: 0,
    totalPlantoes: 0,
    horasTrabalhadas: 0,
    totalRevenue: 0,
    totalProcessado: 0
  });
  const [loading, setLoading] = useState(true);
  const [plantoes, setPlantoes] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);

      // CORREÇÃO 2: Usar Promise.allSettled garante que, se uma falhar (403), 
      // a outra ainda possa carregar e o loading termine.
      const [resStats, resPlantoes] = await Promise.allSettled([
        api.get("/reports/admin/stats"),
        api.get("/plantoes")
      ]);

      if (resStats.status === "fulfilled") {
        setStats(resStats.value.data);
      } 

      if (resPlantoes.status === "fulfilled") {
        const ultimos = resPlantoes.value.data.slice(0, 5);
        setPlantoes(ultimos);
      } 

    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loading-state">Carregando dados administrativos...</div>;

  return (
    <div className="page-wrapper">
      <div className="page-title">
        <h1>Dashboard Administrativo</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <center>
            <h3>Cuidadores</h3>
            <p>{stats?.totalCuidadores || 0}</p>
          </center>
        </div>

        <div className="stat-card">
          <center>
            <h3>Pacientes</h3>
            <p>{stats?.totalPacientes || 0}</p>
          </center>
        </div>

        <div className="stat-card">
          <center>
            <h3>Plantões</h3>
            <p>{stats?.totalPlantoes || 0}</p>
          </center>
        </div>

        <div className="stat-card">
          <center>
            <h3>Horas Trabalhadas</h3>
            <p>{stats?.horasTrabalhadas.toFixed(0) || 0}h</p>
          </center>
        </div>

        <div className="stat-card">
          <center>
            <h3>Receita Total</h3>
            <p>R$ {stats?.totalRevenue?.toFixed(2) || "0.00"}</p>
          </center>
        </div>

        <div className="stat-card">
          <center>
          <h3>Total Processado</h3>
            <p>R$ {stats?.totalProcessado?.toFixed(2) || "0.00"}</p>
          </center>
        </div>
      </div>

      <div className="recent-section" style={{ marginTop: '30px' }}>
        <h2>Últimos Plantões</h2>

        {plantoes.length === 0 ? (
          <div className="empty-state-card">Nenhum plantão registrado.</div>
        ) : (
          <table className="recent-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Paciente</th>
                <th>Cuidador</th>
                <th>Horas</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {plantoes.map(p => (
                <tr key={p.id}>
                  <td>{new Date(p.dataInicio).toLocaleDateString("pt-BR")}</td>
                  <td>{p.paciente?.nome || "N/A"}</td>
                  <td>{p.cuidador?.user?.nome || p.cuidador?.nome || "N/A"}</td>
                  <td>{p.horasTrabalhadas.toFixed(0)}h</td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}