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

export default function DetalheCuidador() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cuidador, setCuidador] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      // Importante: a rota agora deve ser /cuidadores/${id} para pegar o findOne que ajustamos
      const response = await api.get(`/cuidadores/${id}`);
      setCuidador(response.data);
    } catch (err) {
      toast.error("Erro ao carregar dados do cuidador");
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (novoStatus) => {
    try {
      await api.patch(`/users/${id}/approve`, { status: novoStatus });
      toast.success(`Status atualizado para ${novoStatus}`);
      carregarDados();
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  if (loading) return <div className="empty-state">Carregando dados...</div>;
  if (!cuidador) return <div className="empty-state">Cuidador não encontrado</div>;

  return (
    <>
      {/* CABEÇALHO DE AÇÕES */}
      <div className="page-title" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1>{cuidador.nome}</h1>
          <StatusBadge status={cuidador.status} />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={() => navigate("/admin/cuidadores")} style={{ padding: '6px 14px', fontSize: '13px' }}>
            Voltar
          </button>
          
          {cuidador.status === "PENDENTE" && (
            <>
              <button className="action-badge action-aprovar" onClick={() => atualizarStatus("APROVADO")}>
                Aprovar Agora
              </button>
              <button className="action-badge action-rejeitar" onClick={() => atualizarStatus("REJEITADO")}>
                Rejeitar
              </button>
            </>
          )}

          <button className="btn-primary" onClick={() => navigate(`/admin/cuidadores/editar/${id}`)} style={{ padding: '6px 14px', fontSize: '13px' }}>
            Editar Perfil
          </button>
        </div>
      </div>

      <DetailCard>
        {/* SEÇÃO 1: INFORMAÇÕES PESSOAIS */}
        <DetailSection title="Informações Pessoais">
          <DetailGrid>
            <DetailItem label="Nome Completo" value={cuidador.nome} />
            <DetailItem label="CPF" value={cuidador.cpf || "---"} />
            <DetailItem label="E-mail de Acesso" value={cuidador.email} />
            <DetailItem label="Telefone / WhatsApp" value={cuidador.telefone || "Não informado"} />
          </DetailGrid>
        </DetailSection>

        {/* SEÇÃO 2: ENDEREÇO (Dados vindos da relação) */}
        <DetailSection title="Endereço Residencial">
          {cuidador.endereco ? (
            <DetailGrid>
              <DetailItem label="Logradouro" value={cuidador.endereco.logradouro} />
              <DetailItem label="Complemento" value={cuidador.endereco.complemento} />
              <DetailItem label="Bairro" value={cuidador.endereco.bairro} />
              <DetailItem label="Cidade/UF" value={`${cuidador.endereco.cidade} - ${cuidador.endereco.estado}`} />
              <DetailItem label="CEP" value={cuidador.endereco.cep} />
              <DetailItem label="Referencia" value={cuidador.endereco.referencia} />
            </DetailGrid>
          ) : (
            <p style={{ color: '#94a3b8', fontSize: '14px', padding: '0 8px' }}>Endereço não cadastrado.</p>
          )}
        </DetailSection>

        {/* SEÇÃO 3: DADOS PROFISSIONAIS E BANCÁRIOS */}
        <DetailSection title="Dados Profissionais & Financeiros">
          <DetailGrid>
            <DetailItem 
              label="Especialidades" 
              value={cuidador.cuidador?.especialidades?.join(", ") || "Nenhuma informada"} 
            />
            <DetailItem 
              label="Banco" 
              value={cuidador.cuidador?.dadosBancarios?.banco || "Não informado"} 
            />
            <DetailItem 
              label="Chave PIX" 
              value={cuidador.cuidador?.dadosBancarios?.pix || "Não informado"} 
            />
            <DetailItem 
              label="Data de Cadastro" 
              value={new Date(cuidador.dataCadastro).toLocaleDateString('pt-BR')} 
            />
          </DetailGrid>
        </DetailSection>

        {/* SEÇÃO 4: DOCUMENTAÇÃO (Arquivos Enviados) */}
        <DetailSection title="Documentação">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', padding: '0 8px' }}>
            {cuidador.cuidador?.documentos?.length > 0 ? (
              cuidador.cuidador.documentos.map((doc) => (
                <div key={doc.id} className="document-item" style={{ 
                  background: '#1e293b', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #334155',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>{doc.tipo}</span>
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: '#38bdf8', fontSize: '13px', textDecoration: 'none' }}
                  >
                    📄 Visualizar Documento
                  </a>
                </div>
              ))
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Nenhum documento anexado.</p>
            )}
          </div>
        </DetailSection>

        {/* SEÇÃO 5: PACIENTES VINCULADOS */}
        <DetailSection 
          title="Pacientes sob Cuidados"
          renderActions={() => (
            cuidador.status === "APROVADO" && (
              <button 
                onClick={() => {
                  if(window.confirm("Deseja realmente suspender este cuidador? Isso impedirá o acesso dele ao sistema.")) 
                    atualizarStatus("SUSPENSO");
                }}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textTransform: 'none',
                  textDecoration: 'none'
                }}
              >
                Suspender Acesso
              </button>
            )
          )}
        >
          <div style={{ padding: '0 8px' }}>
            {cuidador.cuidador?.pacientes?.length > 0 ? (
              <div style={{ width: '100%', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #334155' }}>
                      <th style={{ padding: '12px 8px', color: '#94a3b8', fontSize: '13px' }}>Paciente</th>
                      <th style={{ padding: '12px 8px', color: '#94a3b8', fontSize: '13px' }}>Valor Hora</th>
                      <th style={{ padding: '12px 8px', color: '#94a3b8', fontSize: '13px' }}>Início do Vínculo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuidador.cuidador.pacientes.map((vinculo) => (
                      <tr key={vinculo.id} style={{ borderBottom: '1px solid #1e293b' }}>
                        <td style={{ padding: '12px 8px', color: '#f8fafc' }}>{vinculo.paciente?.nome}</td>
                        <td style={{ padding: '12px 8px', color: '#38bdf8', fontWeight: 'bold' }}>
                          R$ {parseFloat(vinculo.valorHoraAcordado).toFixed(2)}
                        </td>
                        <td style={{ padding: '12px 8px', color: '#f8fafc' }}>
                          {new Date(vinculo.dataVinculo).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Este profissional ainda não possui pacientes vinculados.</p>
            )}
          </div>
        </DetailSection>
      </DetailCard>
    </>
  );
}
     
  