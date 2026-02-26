import { useEffect, useState } from "react";
import api from "../../services/api";
import Card from "../../components/ui/Card";

export default function Paciente() {
  const [paciente, setPaciente] = useState(null);
  const [cuidador, setCuidador] = useState(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const usuarioLogado = JSON.parse(localStorage.getItem("user"));

      if (!usuarioLogado || usuarioLogado.role !== "FAMILIAR") return;

      const [pacientesRes, usuariosRes, assignmentsRes] = await Promise.all([
        api.get("/patients"),
        api.get("/users"),
        api.get("/assignments")
      ]);

      // 1️⃣ Buscar paciente pelo patientId do familiar
      const pacienteVinculado = pacientesRes.data.find(
        (p) => p.id === usuarioLogado.patientId
      );

      if (!pacienteVinculado) return;

      setPaciente(pacienteVinculado);

      // 2️⃣ Buscar assignment ativo desse paciente
      const assignmentAtivo = assignmentsRes.data.find(
        (a) =>
          a.patientId === pacienteVinculado.id &&
          a.status === "ATIVO"
      );

      if (!assignmentAtivo) return;

      // 3️⃣ Buscar cuidador
      const cuidadorVinculado = usuariosRes.data.find(
        (u) => u.id === assignmentAtivo.caregiverId
      );

      setCuidador(cuidadorVinculado);

    } catch (error) {
      console.error("Erro ao carregar dados do paciente");
    }
  };

  if (!paciente) {
    return (
      <div className="page-wrapper">
        <h2>Nenhum paciente vinculado</h2>
      </div>
    );
  }

  return (
    <div className="page-wrapper">

      <div className="page-title">
        <h1>Informações do Paciente</h1>
      </div>

      <Card>
        <div className="detail-section">
          <div className="detail-grid">

            <div className="detail-item">
              <span className="detail-label">Nome</span>
              <span className="detail-value">{paciente.name}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Cuidador</span>
              <span className="detail-value">
                {cuidador ? cuidador.name : "Não vinculado"}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Status do Vínculo</span>
              <span className="detail-value">
                {cuidador ? "ATIVO" : "Sem cuidador ativo"}
              </span>
            </div>

          </div>
        </div>
      </Card>

    </div>
  );
}