import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function Pacientes() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);

  const initialForm = {
    patientName: "",
    birthDate: "",
    notes: "",
    street: "",
    number: "",
    city: "",
    state: "",
    zip: "",
    familiarName: "",
    familiarEmail: "",
    familiarPhone: "",
    familiarPassword: ""
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    try {
      const response = await api.get("/patients");
      setPacientes(response.data);
    } catch (error) {
      console.error("Erro ao carregar pacientes");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const now = new Date().toISOString();

      const patientResponse = await api.post("/patients", {
        name: form.patientName,
        birthDate: form.birthDate,
        notes: form.notes,
        address: {
          street: form.street,
          number: form.number,
          city: form.city,
          state: form.state,
          zip: form.zip
        },
        createdAt: now
      });

      const patientId = patientResponse.data.id;

      await api.post("/users", {
        name: form.familiarName,
        email: form.familiarEmail,
        phone: form.familiarPhone,
        password: form.familiarPassword,
        role: "FAMILIAR",
        patientId: patientId,
        status: "APROVADO",
        createdAt: now
      });

      setMostrarForm(false);
      setForm(initialForm);
      carregarPacientes();

    } catch (error) {
      console.error("Erro ao salvar paciente");
    }
  };

  return (
    <>
      {/* HEADER */}
      <div className="page-title">
        <h1>Pacientes</h1>
        <button
          className="btn-primary"
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? "Cancelar" : "Novo Paciente"}
        </button>
      </div>

      {/* FORMULÁRIO */}
      {mostrarForm && (
        <div className="detail-card" style={{ marginBottom: 30 }}>
          <form onSubmit={handleSubmit} className="form-vertical">

            <div className="detail-section">
              <h3>Dados do Paciente</h3>
              <div className="detail-grid">
                <input name="patientName" placeholder="Nome" onChange={handleChange} required />
                <input type="date" name="birthDate" onChange={handleChange} required />
                <input name="notes" placeholder="Observações" onChange={handleChange} />
              </div>
            </div>

            <div className="detail-section">
              <h3>Endereço</h3>
              <div className="detail-grid">
                <input name="street" placeholder="Rua" onChange={handleChange} />
                <input name="number" placeholder="Número" onChange={handleChange} />
                <input name="city" placeholder="Cidade" onChange={handleChange} />
                <input name="state" placeholder="Estado" onChange={handleChange} />
                <input name="zip" placeholder="CEP" onChange={handleChange} />
              </div>
            </div>

            <div className="detail-section">
              <h3>Responsável</h3>
              <div className="detail-grid">
                <input name="familiarName" placeholder="Nome" onChange={handleChange} required />
                <input name="familiarEmail" placeholder="Email" onChange={handleChange} required />
                <input name="familiarPhone" placeholder="Telefone" onChange={handleChange} />
                <input type="password" name="familiarPassword" placeholder="Senha" onChange={handleChange} required />
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <button type="submit" className="btn-primary">
                Salvar Paciente
              </button>
            </div>

          </form>
        </div>
      )}

      {/* LISTA */} 
      <div className="patients-list">
        {pacientes.length === 0 ? (
          <div className="empty-state">
            Nenhum paciente cadastrado
          </div>
        ) : (
          pacientes.map((p) => (
            <div key={p.id} className="patient-card">
              <div className="patient-info">
                <strong
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/admin/pacientes/${p.id}`)}
                >
                  {p.name}
                </strong>
              </div>

              <div className="patient-actions">
                <button
                  className="btn-secondary"
                  onClick={() => navigate(`/admin/pacientes/${p.id}`)}
                >
                  Ver Detalhes
                </button>
              </div>
            </div>
          ))
        )}
      </div>    
    </>
  );
}