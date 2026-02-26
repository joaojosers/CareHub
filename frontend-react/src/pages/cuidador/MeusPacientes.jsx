import { useEffect, useState } from "react";
import api from "../../services/api";

export default function MeusPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    try {
      const usuarioLogado = JSON.parse(localStorage.getItem("user"));

      const vinculosResponse = await api.get("/assignments", {
        params: { caregiverId: usuarioLogado.id, status: "ATIVO" }
      });

      const vinculos = vinculosResponse.data;

      const pacientesPromises = vinculos.map((v) =>
        api.get(`/patients/${v.patientId}`)
      );

      const pacientesResponses = await Promise.all(pacientesPromises);

      const listaPacientes = pacientesResponses.map((r) => r.data);

      setPacientes(listaPacientes);

    } catch (error) {
      console.error("Erro ao carregar pacientes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="page-title">
          <h1>Meus Pacientes</h1>
        </div>

        <div className="empty-state">
          Carregando pacientes...
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* HEADER */}
      <div className="page-title">
        <h1>Meus Pacientes</h1>
      </div>

      {/* LISTA */}
      {pacientes.length === 0 ? (
        <div className="empty-state">
          Nenhum paciente vinculado
        </div>
      ) : (
        <div className="patients-list">
          {pacientes.map((p) => (
            <div key={p.id} className="patient-card">
              <div className="patient-info">
                <strong>{p.name}</strong>
                <span>
                  Nascimento:{" "}
                  {p.birthDate
                    ? new Date(p.birthDate).toLocaleDateString("pt-BR")
                    : "-"}
                </span>
                <span>Cidade: {p.address?.city || "-"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}