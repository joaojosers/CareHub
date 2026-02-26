import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Relatorios() {
  const [historico, setHistorico] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [pacientes, setPacientes] = useState([]);

  const usuarioLogado = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [hoursRes, usersRes, patientsRes] = await Promise.all([
        api.get("/hours"),
        api.get("/users"),
        api.get("/patients")
      ]);

      setUsuarios(usersRes.data);

      if (!usuarioLogado) {
        console.log("Usuário logado não encontrado");
        return;
      }

      console.log("Usuário logado:", usuarioLogado);
      console.log("Pacientes:", patientsRes.data);

      // 🔎 encontra paciente vinculado ao familiar
      const pacienteVinculado = patientsRes.data.find(
        p => String(p.responsavelId) === String(usuarioLogado.id)
      );

      console.log("Paciente vinculado:", pacienteVinculado);

      if (!pacienteVinculado) return;

      const horasPaciente = hoursRes.data
        .filter(
          h =>
            String(h.patientId) === String(pacienteVinculado.id) &&
            h.status === "APROVADO"
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setHistorico(horasPaciente);

    } catch (error) {
      console.error("Erro ao carregar relatórios:", error);
    }
  };

  const getCuidadorNome = (id) =>
    usuarios.find(u => u.id === id)?.name || "Cuidador";

  return (
    <div className="page-wrapper">
      <div className="page-title">
        <h1>Relatórios do Paciente</h1>
      </div>

      {historico.length === 0 ? (
        <div className="empty-state">
          Nenhum atendimento registrado
        </div>
      ) : (
        historico.map(h => (
          <div key={h.id} className="detail-card">

            <div className="detail-section">
              <div className="detail-grid">

                <div className="detail-item">
                  <span className="detail-label">Data</span>
                  <span className="detail-value">
                    {new Date(h.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Cuidador</span>
                  <span className="detail-value">
                    {getCuidadorNome(h.caregiverId)}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Horário</span>
                  <span className="detail-value">
                    {h.startTime} - {h.endTime}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Total</span>
                  <span className="detail-value">
                    {h.totalHours}h
                  </span>
                </div>

              </div>
            </div>

            <div className="detail-section">
              <h3>Relatório</h3>

              <div className="detail-item">
                <span className="detail-label">Descrição</span>
                <span className="detail-value">
                  {h.report?.descricao || "—"}
                </span>
              </div>

              {h.report?.medicacoes && (
                <div className="detail-item">
                  <span className="detail-label">Medicações</span>
                  <span className="detail-value">
                    {h.report.medicacoes}
                  </span>
                </div>
              )}

              {h.report?.pressao && (
                <div className="detail-item">
                  <span className="detail-label">Pressão</span>
                  <span className="detail-value">
                    {h.report.pressao}
                  </span>
                </div>
              )}

              {h.report?.observacoes && (
                <div className="detail-item">
                  <span className="detail-label">Observações</span>
                  <span className="detail-value">
                    {h.report.observacoes}
                  </span>
                </div>
              )}
            </div>

          </div>
        ))
      )}
    </div>
  );
}