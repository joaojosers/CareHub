import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

import PageTitle from "../../components/ui/PageTitle";
import DetailCard from "../../components/ui/DetailCard";

export default function EditarPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    nome: "",
    dataNascimento: "",
    necessidades: "",
    status: "",
    endereco: {
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      complemento: "",
      referencia: ""
    }
  });

  useEffect(() => {
    const carregarPaciente = async () => {
      try {
        const res = await api.get(`/pacientes/${id}`);
        const p = res.data;
        
        const dataFormatada = p.dataNascimento ? p.dataNascimento.split('T')[0] : "";

        setFormData({
          nome: p.nome,
          dataNascimento: dataFormatada,
          necessidades: p.necessidades || "",
          status: p.status,
          endereco: {
            logradouro: p.endereco?.logradouro || "",
            numero: p.endereco?.numero || "",
            bairro: p.endereco?.bairro || "",
            cidade: p.endereco?.cidade || "",
            estado: p.endereco?.estado || "",
            cep: p.endereco?.cep || "",
            complemento: p.endereco?.complemento || "",
            referencia: p.endereco?.referencia || "",
          }
        });
      } catch (err) {
        toast.error("Erro ao carregar paciente");
      } finally {
        setLoading(false);
      }
    };
    carregarPaciente();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [obj, key] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [obj]: { ...prev[obj], [key]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/pacientes/${id}`, formData);
      toast.success("Paciente atualizado com sucesso!");
      navigate(`/admin/pacientes/${id}`);
    } catch (err) {
      toast.error("Erro ao atualizar dados");
    }
  };

  if (loading) return <div className="empty-state">Carregando dados...</div>;

  return (
    <>
      <div className="page-title">
        <h1>Editar: {formData.nome}</h1>
        <button className="btn-secondary" onClick={() => navigate(-1)} style={{ padding: '6px 14px', fontSize: '13px' }}>
          Voltar
        </button>
      </div>
      
      <DetailCard>
        <form onSubmit={handleSubmit} className="form-layout">
          
          {/* SEÇÃO: DADOS PESSOAIS */}
          <div className="form-section">
            <h3>Dados Pessoais</h3>
            <div className="form-grid">
              <div style={{ gridColumn: 'span 2' }}>
                <label className="detail-label">Nome Completo</label>
                <input 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleChange} 
                  required
                />
              </div>
              <div>
                <label className="detail-label">Status do Paciente</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="ATIVO">Ativo</option>
                  <option value="INATIVO">Inativo</option>
                  <option value="OBITO">Óbito</option>
                  <option value="SUSPENSO">Suspenso</option>
                </select>
              </div>
              <div>
                <label className="detail-label">Data de Nascimento</label>
                <input 
                  type="date" 
                  name="dataNascimento" 
                  value={formData.dataNascimento} 
                  onChange={handleChange} 
                />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="detail-label">Observações / Necessidades</label>
                <textarea 
                  name="necessidades" 
                  value={formData.necessidades} 
                  onChange={handleChange} 
                  placeholder="Ex: Diabético, hipertenso..."
                />
              </div>
            </div>
          </div>

          {/* SEÇÃO: ENDEREÇO */}
          <div className="form-section">
            <h3>Endereço de Atendimento</h3>
            <div className="form-grid">
              <div>
                <label className="detail-label">CEP</label>
                <input name="endereco.cep" value={formData.endereco.cep} onChange={handleChange} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="detail-label">Logradouro</label>
                <input name="endereco.logradouro" value={formData.endereco.logradouro} onChange={handleChange} />
              </div>
              <div>
                <label className="detail-label">Número</label>
                <input name="endereco.numero" value={formData.endereco.numero} onChange={handleChange} />
              </div>
              <div>
                <label className="detail-label">Complemento</label>
                <input name="endereco.complemento" value={formData.endereco.complemento} onChange={handleChange} />
              </div>
              <div>
                <label className="detail-label">Bairro</label>
                <input name="endereco.bairro" value={formData.endereco.bairro} onChange={handleChange} />
              </div>
              <div>
                <label className="detail-label">Cidade</label>
                <input name="endereco.cidade" value={formData.endereco.cidade} onChange={handleChange} />
              </div>
              <div>
                <label className="detail-label">UF</label>
                <input name="endereco.estado" value={formData.endereco.estado} onChange={handleChange} maxLength="2" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="detail-label">Ponto de Referência</label>
                <input name="endereco.referencia" value={formData.endereco.referencia} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO */}
          <div className="form-actions">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
              Salvar Alterações
            </button>
          </div>
        </form>
      </DetailCard>
    </>
  );
}