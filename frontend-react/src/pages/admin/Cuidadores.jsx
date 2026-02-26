import { useEffect, useState } from "react";
import api from "../../services/api";
import StatusBadge from "../../components/ui/StatusBadge";
import { useNavigate } from "react-router-dom";
import "./cuidadores.css";

export default function Cuidadores() {
  const navigate = useNavigate();

  const [cuidadores, setCuidadores] = useState([]);
  const [filtro, setFiltro] = useState("TODOS");
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarCuidadores();
  }, []);

  const carregarCuidadores = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users", {
        params: { role: "CUIDADOR" }
      });
      setCuidadores(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar cuidadores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAprovar = async (id) => {
    try {
      await api.patch(`/users/${id}`, { status: "APROVADO" });
      carregarCuidadores();
    } catch (error) {
      console.error("Erro ao aprovar:", error);
    }
  };

  const handleRejeitar = async (id) => {
    try {
      await api.patch(`/users/${id}`, { status: "REJEITADO" });
      carregarCuidadores();
    } catch (error) {
      console.error("Erro ao rejeitar:", error);
    }
  };

  const cuidadoresFiltrados = cuidadores.filter((c) => {
    const matchStatus = filtro === "TODOS" || c.status === filtro;

    const nome = c.name?.toLowerCase() || "";
    const email = c.email?.toLowerCase() || "";
    const buscaLower = busca.toLowerCase();

    const matchBusca =
      nome.includes(buscaLower) || email.includes(buscaLower);

    return matchStatus && matchBusca;
  });

  return (
    <div className="cuidadores-page">
      <h1 className="page-title">Gerenciar Cuidadores</h1>

      {/* Busca */}
      <input
        type="text"
        placeholder="Buscar por nome ou email..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="input-busca"
      />

      {/* Tabs */}
      <div className="status-tabs">
        {["TODOS", "PENDENTE", "APROVADO", "REJEITADO"].map((status) => (
          <button
            key={status}
            onClick={() => setFiltro(status)}
            className={`tab ${filtro === status ? "active" : ""}`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading && <p className="info-text">Carregando...</p>}

      {!loading && cuidadoresFiltrados.length === 0 && (
        <p className="info-text">Nenhum cuidador encontrado</p>
      )}

      {!loading &&
        cuidadoresFiltrados.map((cuidador) => (
          <div key={cuidador.id} className="cuidador-card">
            <div>
              <strong
                className="cuidador-nome"
                onClick={() =>
                  navigate(`/admin/cuidadores/${cuidador.id}`)
                }
              >
                {cuidador.name}
              </strong>

              <div className="cuidador-email">
                {cuidador.email}
              </div>

              <div style={{ marginTop: 6 }}>
                <StatusBadge status={cuidador.status} />
              </div>
            </div>

            {cuidador.status === "PENDENTE" && (
              <div className="acoes">
                <button
                  className="btn-aprovar"
                  onClick={() => handleAprovar(cuidador.id)}
                >
                  Aprovar
                </button>

                <button
                  className="btn-rejeitar"
                  onClick={() => handleRejeitar(cuidador.id)}
                >
                  Rejeitar
                </button>
              </div>
            )}
          </div>
        ))}
    </div>
  );
}