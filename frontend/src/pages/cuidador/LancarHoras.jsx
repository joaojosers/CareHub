import { useEffect, useState, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";
import "../../styles/ui.css";

export default function LancarHoras() {
  const { usuario } = useContext(AuthContext);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    pacienteId: "",
    data: new Date().toISOString().split('T')[0], // Apenas para o input de data
    horaInicio: "",
    horaFim: "",
    descricao: "",
    medicacoes: "",
    pressaoArterial: "",
    observacoes: ""
  });

  useEffect(() => {
    if (usuario?.id) {
      carregarPacientes();
    }
  }, [usuario]);

  const carregarPacientes = async () => {
    try {
      // Usando o endpoint que já confirmamos que funciona para o cuidador
      const response = await api.get(`/cuidadores/${usuario.id}/pacientes`);
      setPacientes(response.data);
    } catch (error) {
      toast.error("Erro ao carregar pacientes vinculados.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 1. Montagem das datas no formato ISO exigido pelo Swagger (YYYY-MM-DDTHH:mm:ssZ)
      const dataInicioISO = new Date(`${form.data}T${form.horaInicio}:00`).toISOString();
      const dataFimISO = new Date(`${form.data}T${form.horaFim}:00`).toISOString();

      // 2. Montagem do objeto conforme o POST /plantoes
      const payload = {
        pacienteId: form.pacienteId,
        cuidadorId: usuario.id,
        dataInicio: dataInicioISO,
        dataFim: dataFimISO,
        relatorio: {
          descricao: form.descricao,
          medicacoes: form.medicacoes || null,
          pressaoArterial: form.pressaoArterial || null,
          observacoes: form.observacoes || null
        }
      };

      await api.post("/plantoes", payload);

      toast.success("Plantão lançado com sucesso!");
      
      // Limpa campos de relatório e horários após o envio
      setForm({
        ...form,
        horaInicio: "",
        horaFim: "",
        descricao: "",
        medicacoes: "",
        pressaoArterial: "",
        observacoes: ""
      });

    } catch (error) {
      console.error("Erro no post:", error);
      toast.error(error.response?.data?.message || "Erro ao salvar plantão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1>Registrar Plantão</h1>
          <p className="subtitle">Preencha os dados do atendimento realizado</p>
        </div>
      </header>

      <div className="detail-card">
        <form onSubmit={handleSubmit}>
          <div className="detail-section">
            <h3>Informações Gerais</h3>
            <div className="detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              
              <div className="detail-item">
                <label className="detail-label">Paciente</label>
                <select name="pacienteId" value={form.pacienteId} onChange={handleChange} required className="ui-input">
                  <option value="">Selecione...</option>
                  {pacientes.map(p => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>

              <div className="detail-item">
                <label className="detail-label">Data do Plantão</label>
                <input type="date" name="data" value={form.data} onChange={handleChange} required className="ui-input" />
              </div>

              <div className="detail-item">
                <label className="detail-label">Hora Início</label>
                <input type="time" name="horaInicio" value={form.horaInicio} onChange={handleChange} required className="ui-input" />
              </div>

              <div className="detail-item">
                <label className="detail-label">Hora Fim</label>
                <input type="time" name="horaFim" value={form.horaFim} onChange={handleChange} required className="ui-input" />
              </div>
            </div>
          </div>

          <div className="detail-section" style={{ marginTop: '30px' }}>
            <h3>Relatório do Atendimento</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div className="detail-item">
                <label className="detail-label">Descrição das Atividades</label>
                <textarea 
                  name="descricao" 
                  value={form.descricao} 
                  onChange={handleChange} 
                  placeholder="Relate como foi o período..."
                  required
                  style={{ minHeight: '100px', width: '100%' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="detail-item">
                  <label className="detail-label">Medicações</label>
                  <input type="text" name="medicacoes" value={form.medicacoes} onChange={handleChange} placeholder="Ex: Losartana 50mg" />
                </div>
                <div className="detail-item">
                  <label className="detail-label">Pressão Arterial</label>
                  <input type="text" name="pressaoArterial" value={form.pressaoArterial} onChange={handleChange} placeholder="Ex: 12/8" />
                </div>
              </div>

              <div className="detail-item">
                <label className="detail-label">Observações Adicionais</label>
                <textarea 
                  name="observacoes" 
                  value={form.observacoes} 
                  onChange={handleChange} 
                  placeholder="Algo fora do comum?"
                  style={{ minHeight: '60px', width: '100%' }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: '30px' }}>
            <button type="submit" className="btn-logout" disabled={loading}>
              {loading ? "Enviando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}