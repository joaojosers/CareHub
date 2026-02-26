import { useEffect, useState } from "react";
import api from "../../services/api";

export default function LancarHoras() {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    patientId: "",
    date: "",
    startTime: "",
    endTime: "",
    descricao: "",
    medicacoes: "",
    pressao: "",
    observacoes: ""
  });

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
    }
  };

  const calcularHoras = () => {
    const inicio = new Date(`1970-01-01T${form.startTime}:00`);
    const fim = new Date(`1970-01-01T${form.endTime}:00`);
    const diff = (fim - inicio) / 1000 / 60 / 60;
    return diff > 0 ? diff : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuarioLogado = JSON.parse(localStorage.getItem("user"));
    const total = calcularHoras();

    if (total <= 0) {
      alert("Horário inválido");
      return;
    }

    try {
      await api.post("/hours", {
        caregiverId: usuarioLogado.id,
        patientId: form.patientId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        totalHours: total,
        report: {
          descricao: form.descricao,
          medicacoes: form.medicacoes,
          pressao: form.pressao,
          observacoes: form.observacoes
        },
        status: "PENDENTE",
        createdAt: new Date().toISOString()
      });

      alert("Horas lançadas com sucesso!");

      setForm({
        patientId: "",
        date: "",
        startTime: "",
        endTime: "",
        descricao: "",
        medicacoes: "",
        pressao: "",
        observacoes: ""
      });

    } catch (error) {
      console.error("Erro ao lançar horas");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-wrapper">
      <div className="page-title">
        <h1>Lançar Horas</h1>
      </div>

      <div className="detail-card">
        <form onSubmit={handleSubmit} className="form-vertical">

          <div className="detail-section">
            <h3>Informações do Atendimento</h3>

            <div className="detail-grid">
              <select
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o paciente</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />

              <input
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
              />

              <input
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="detail-section">
            <h3>Relatório do Atendimento</h3>

            <div className="detail-grid">
              <textarea
                name="descricao"
                placeholder="Descrição das atividades realizadas"
                value={form.descricao}
                onChange={handleChange}
                required
              />

              <textarea
                name="medicacoes"
                placeholder="Medicações administradas"
                value={form.medicacoes}
                onChange={handleChange}
              />

              <input
                type="text"
                name="pressao"
                placeholder="Pressão arterial (ex: 12x8)"
                value={form.pressao}
                onChange={handleChange}
              />

              <textarea
                name="observacoes"
                placeholder="Observações adicionais"
                value={form.observacoes}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <button type="submit" className="btn-primary">
              Salvar Lançamento
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}