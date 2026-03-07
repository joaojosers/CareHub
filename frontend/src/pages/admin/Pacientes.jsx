import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import PageTitle from "../../components/ui/PageTitle";
import DetailCard from "../../components/ui/DetailCard";

export default function Pacientes() {
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [filtroNome, setFiltroNome] = useState(""); // Estado para a busca

  const initialForm = {
    nome: "",
    dataNascimento: "",
    necessidades: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    referencia: "",
    familiarName: "",
    familiarCpf: "",
    familiarPhone: "",
    familiarParentesco: "",
    familiarEmail: "",
    familiarPassword: ""
    
  };

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    try {
      const response = await api.get("/pacientes");
      setPacientes(response.data);
    } catch (error) {
      console.error("Erro ao carregar pacientes");
    }
  };

  // --- Lógica de Filtragem e Ordenação ---
  const pacientesFiltradosEOrdenados = pacientes
    .filter((p) => 
      p.nome.toLowerCase().includes(filtroNome.toLowerCase())
    )
    .sort((a, b) => a.nome.localeCompare(b.nome)); // Ordem Alfabética (A-Z)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       const userResponse = await api.post("/auth/register", {
        nome: form.familiarName,
        email: form.familiarEmail,
        senha: form.familiarPassword,
        telefone: form.familiarPhone,
        cpf: form.familiarCpf.replace(/\D/g, ""),
        tipo: "FAMILIAR",
        status: "APROVADO"
      });

      const familiarIdGerado = userResponse.data.id;
      
      
      await api.post("/pacientes", {
        nome: form.nome,
        dataNascimento: new Date(form.dataNascimento).toISOString(),
        necessidades: form.necessidades,
        familiarId: familiarIdGerado,
        parentesco: form.familiarParentesco,
        isResponsavelFinanceiro: true,
        endereco: {
          logradouro: form.logradouro,
          numero: form.numero,
          bairro: form.bairro,
          cidade: form.cidade,
          estado: form.estado,
          cep: form.cep.replace(/\D/g, ""),
          complemento: form.complemento || undefined,
          referencia: form.referencia || undefined
        }
      });


      alert("Cadastro completo realizado com sucesso!");
      setMostrarForm(false);
      setForm(initialForm);
      carregarPacientes();
    } catch (error) {
      alert("Erro ao salvar cadastro.");
    }
  };

  return (
    <>
      <div className="page-title">
        <h1>Pacientes</h1>
        <button 
          className={mostrarForm ? "btn-secondary" : "btn-primary"} 
          onClick={() => setMostrarForm(!mostrarForm)}
        >
          {mostrarForm ? "Voltar para Lista" : "Novo Paciente"}
        </button>
      </div>

      {mostrarForm ? (
        <DetailCard>
          <form onSubmit={handleSubmit} className="form-layout">
            <div className="form-section">
              <h3>Dados do Paciente</h3>
              <div className="form-grid">
                <input name="nome" placeholder="Nome Completo" value={form.nome} onChange={handleChange} required />
                <input type="date" name="dataNascimento" value={form.dataNascimento} onChange={handleChange} required />
                <input name="necessidades" placeholder="Necessidades Específicas" value={form.necessidades} onChange={handleChange} />
              </div>
            </div>

            <div className="form-section">
              <h3>Endereço de Atendimento</h3>
              <div className="form-grid">
                <input name="cep" placeholder="CEP (apenas numeros)" value={form.cep} onChange={handleChange} maxLength={9} required />
                <input name="logradouro" placeholder="Logradouro (Rua/Av)" value={form.logradouro} onChange={handleChange} required />
                <input name="numero" placeholder="Número" value={form.numero} onChange={handleChange} required />
                <input name="complemento" placeholder="Complemento (apto, bloco)" value={form.complemento} onChange={handleChange} required />
                <input name="bairro" placeholder="Bairro" value={form.bairro} onChange={handleChange} required />
                <input name="referencia" placeholder="Referencia (proximo a ....)" value={form.referencia} onChange={handleChange} required />
                <input name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} required />
                <input name="estado" placeholder="UF (Ex: SP)" value={form.estado} onChange={handleChange} maxLength={2} required />
              </div>
            </div>

            <div className="form-section">
              <h3>Responsável Familiar</h3>
              <div className="form-grid">
                <input name="familiarName" placeholder="Nome do Responsável" onChange={handleChange} required />
                <input name="familiarCpf" placeholder="CPF" onChange={handleChange} required />
                <input name="familiarPhone" placeholder="Telefone" onChange={handleChange} />
                <input name="familiarEmail" type="email" placeholder="E-mail" onChange={handleChange} required />              
                <input name="familiarPassword" type="password" placeholder="Senha" onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <select 
                name="familiarParentesco" 
                value={form.familiarParentesco} 
                onChange={handleChange} 
                required
                style={{ width: '30%', height: '40px' }}
              >
                <option value="">Selecione o Parentesco...</option>
                <option value="Filho(a)">Filho(a)</option>
                <option value="Cônjuge">Cônjuge</option>
                <option value="Irmão/Irmã">Irmão/Irmã</option>
                <option value="Neto(a)">Neto(a)</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" style={{ padding: '12px 24px' }}>
                Finalizar Cadastro
              </button>
            </div>
          </form>
        </DetailCard>
      ) : (
        <>
          {/* BARRA DE PESQUISA - Usando estilo do seu ui.css */}
          <div className="filters-row" style={{ marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="🔍 Pesquisar paciente por nome..." 
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              style={{ width: '100%', maxWidth: '400px' }}
            />
          </div>

          <div className="patients-list">
            {pacientesFiltradosEOrdenados.length === 0 ? (
              <div className="empty-state">
                {filtroNome ? "Nenhum paciente encontrado com este nome." : "Nenhum paciente cadastrado."}
              </div>
            ) : (
              pacientesFiltradosEOrdenados.map((p) => (
                <div key={p.id} className="patient-card">
                  <div className="patient-info">
                    <strong>{p.nome}</strong>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {p.endereco?.cidade || "Cidade n/i"} - {p.endereco?.estado || "UF"}
                    </span>
                  </div>
                  <div className="patient-actions">
                    <button className="btn-secondary" onClick={() => navigate(`/admin/pacientes/${p.id}`)}>
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </>
  );
}