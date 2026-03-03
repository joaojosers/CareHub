import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

import PageTitle from "../../components/ui/PageTitle";
import DetailCard from "../../components/ui/DetailCard";
import DetailSection from "../../components/ui/DetailSection";
import DetailGrid from "../../components/ui/DetailGrid";
import DetailItem from "../../components/ui/DetailItem";
import StatusBadge from "../../components/ui/StatusBadge";

export default function DetalhePaciente() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [cuidadoresDisponiveis, setCuidadoresDisponiveis] = useState([]);
  const [mostrarModalVinculo, setMostrarModalVinculo] = useState(false);
  const [vinculoForm, setVinculoForm] = useState({ cuidadorId: "", valorHora: "" });

  // Funções de Formatação
  const formatarCPF = (cpf) => {
    if (!cpf) return "---";
    const limpo = cpf.replace(/\D/g, "");
    return limpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatarTelefone = (tel) => {
    if (!tel) return "Não informado";
    const f = tel.replace(/\D/g, "");
    return f.length === 11 ? f.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3") : f.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  };

  const formatarCEP = (cep) => {
    if (!cep) return "---";
    return cep.replace(/\D/g, "").replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  useEffect(() => {
    carregarDados();
    carregarCuidadoresAprovados();
  }, [id]);

  const carregarDados = async () => {
    try {
      const response = await api.get(`/pacientes/${id}`);
      setPaciente(response.data);
    } catch (err) {
      toast.error("Erro ao carregar dados do paciente");
    } finally {
      setLoading(false);
    }
  };

  const carregarCuidadoresAprovados = async () => {
    try {
      const res = await api.get("/cuidadores"); // Ajustado para sua rota de cuidadores
      // Filtra apenas os usuários que estão aprovados
      const aprovados = res.data.filter(u => u.status === "APROVADO");
      setCuidadoresDisponiveis(aprovados);
    } catch (err) {
      console.error("Erro ao buscar cuidadores");
    }
  };

  const handleVincular = async (e) => {
    e.preventDefault();
    const payload = {
      cuidadorId: vinculoForm.cuidadorId,
      valorHora: Number(vinculoForm.valorHora)
    };

    try {
      await api.post(`/pacientes/${id}/vincular-cuidador`, payload);
      toast.success("Cuidador vinculado com sucesso!");
      setMostrarModalVinculo(false);
      setVinculoForm({ cuidadorId: "", valorHora: "" });
      carregarDados(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Erro ao realizar vínculo.");
    }
  };

  const handleDesvincular = async (vinculoId) => {
    if (!window.confirm("Deseja realmente remover este vínculo?")) return;
    try {
      await api.delete(`/pacientes/vinculo-cuidador/${vinculoId}`);
      toast.success("Cuidador desvinculado!");
      carregarDados();
    } catch (err) {
      toast.error("Erro ao remover vínculo.");
    }
  };

  if (loading) return <div className="empty-state">Carregando dados...</div>;
  if (!paciente) return <div className="empty-state">Paciente não encontrado</div>;

  const familiarVinculo = paciente.familiares?.[0];
  const familiarUser = familiarVinculo?.user;

  return (
    <>
      <div className="page-title" style={{ justifyContent: 'space-between' }}>
        <h1>{paciente.nome}</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => navigate("/admin/pacientes")}>
            Voltar
          </button>
          <button className="btn-primary" onClick={() => navigate(`/admin/pacientes/editar/${id}`)}>
            Editar Dados
          </button>
        </div>
      </div>

      <DetailCard>
        {/* 1. DADOS DO PACIENTE */}
        <DetailSection title="Dados do Paciente">
          <DetailGrid>
            <DetailItem label="Nome" value={paciente.nome} />
            <DetailItem 
              label="Data de Nascimento" 
              value={paciente.dataNascimento ? new Date(paciente.dataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : "---"} 
            />
            <DetailItem label="Status" value={<StatusBadge status={paciente.status} />} />
            <DetailItem label="Observações/Necessidades" value={paciente.necessidades || "Nenhuma informada"} />
          </DetailGrid>
        </DetailSection>

        {/* 2. ENDEREÇO */}
        <DetailSection title="Endereço de Atendimento">
          <DetailGrid>
            <DetailItem label="Logradouro" value={paciente.endereco?.logradouro || "---"} />
            <DetailItem label="Número" value={paciente.endereco?.numero || "---"} />
            <DetailItem label="Bairro" value={paciente.endereco?.bairro || "---"} />
            <DetailItem 
              label="Cidade/UF" 
              value={paciente.endereco ? `${paciente.endereco.cidade} - ${paciente.endereco.estado}` : "---"} 
            />
            <DetailItem label="CEP" value={formatarCEP(paciente.endereco?.cep)} />
          </DetailGrid>
        </DetailSection>

        {/* 3. RESPONSÁVEL FAMILIAR */}
        <DetailSection title="Responsável Familiar">
          {familiarUser ? (
            <DetailGrid>
              <DetailItem label="Nome" value={familiarUser.nome} />
              <DetailItem label="Email" value={familiarUser.email} />
              <DetailItem label="Telefone" value={formatarTelefone(familiarUser.telefone)} />
              <DetailItem label="Parentesco" value={familiarVinculo?.parentesco || "---"} />
            </DetailGrid>
          ) : (
            <p className="empty-state" style={{ textAlign: 'left', padding: '10px' }}>Nenhum familiar vinculado.</p>
          )}
        </DetailSection>

        {/* 4. EQUIPE DE CUIDADORES */}
        <DetailSection title="Equipe de Cuidadores">
          <div style={{ padding: '0 8px' }}>
            {/* LISTA DE CUIDADORES EM TABELA ESTRUTURADA */}
            {paciente.cuidadores?.length > 0 ? (
              <div className="table-container" style={{ background: 'transparent', boxShadow: 'none', marginBottom: '20px' }}>
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50%', textAlign: 'left' }}>Cuidador</th>
                      <th style={{ width: '30%', textAlign: 'left'}}>Valor Hora</th>
                      <th style={{ width: '20%', textAlign: 'center' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paciente.cuidadores.map((v) => (
                      <tr key={v.id}>
                        <td>
                          <span style={{ color: '#f8fafc', fontWeight: '500' }}>
                            {v.cuidador?.user?.nome || "---"}
                          </span>
                        </td>
                        <td>
                          <span style={{ 
                            color: '#10b981', 
                            background: 'rgba(16, 185, 129, 0.1)', 
                            padding: '2px 8px', 
                            borderRadius: '4px',
                            fontSize: '13px'
                          }}>
                            R$ {parseFloat(v.valorHoraAcordado).toFixed(2)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'left' }}>
                          <button 
                            onClick={() => handleDesvincular(v.id)} 
                            className="btn-link-danger"
                            style={{ 
                              color: '#ef4444', 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer', 
                              textDecoration: 'none',
                              fontSize: '13px',
                              fontWeight: '500'
                            }}
                          >
                            Desvincular
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
                Nenhum cuidador vinculado a este paciente.
              </p>
            )}

            {/* ÁREA DE VÍNCULO (AGORA EMBAIXO) */}
            <div style={{ borderTop: '1px solid #334155', paddingTop: '20px' }}>
              {!mostrarModalVinculo ? (
                <button 
                  className="btn-primary" 
                  onClick={() => setMostrarModalVinculo(true)}
                  style={{ width: '100%', justifyContent: 'center', py: '12px' }}
                >
                  + Vincular Novo Cuidador
                </button>
              ) : (
                <div style={{ 
                  background: '#0f172a', 
                  padding: '10px', 
                  borderRadius: '12px', 
                  border: '1px solid #3b82f6',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}>
                  <h4 style={{color: '#60a5fa', fontSize: '16px', fontWeight: '600' }}>
                    Selecionar novo cuidador
                  </h4>
                  <form onSubmit={handleVincular} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px' }}>
                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '14px', color: '#94a3b8' }}>Selecione o Profissional</label>
                      <select 
                        style={{ width: '100%', height: '42px' }} 
                        value={vinculoForm.cuidadorId}
                        onChange={(e) => setVinculoForm({...vinculoForm, cuidadorId: e.target.value})}
                        required
                      >
                        <option value="">Selecione...</option>
                        {cuidadoresDisponiveis.map(c => (
                          <option key={c.id} value={c.id}>{c.nome}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ flex: 1, minWidth: '120px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '14px', color: '#94a3b8' }}>Valor/Hora (R$)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        style={{ width: '50%', height: '42px' }}
                        value={vinculoForm.valorHora}
                        onChange={(e) => setVinculoForm({...vinculoForm, valorHora: e.target.value})}
                        required 
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" className="btn-primary" style={{ height: '42px', padding: '0 20px' }}>Vincular</button>
                      <button 
                        type="button" 
                        className="btn-secondary" 
                        onClick={() => setMostrarModalVinculo(false)} 
                        style={{ height: '42px', padding: '0 15px' }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </DetailSection>
      </DetailCard>
    </>
  );
}