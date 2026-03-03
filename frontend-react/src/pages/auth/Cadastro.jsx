import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estado espelhado na estrutura do seu Swagger/DTO
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    especialidades: "", // Vamos converter para array no submit
    endereco: {
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
      referencia: ""
    }
  });

  // Handler para campos simples (nome, email, etc)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handler exclusivo para o objeto de endereço
  const handleEnderecoChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      endereco: { ...prev.endereco, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Preparando o payload exatamente como o Swagger pede
    const payload = {
      ...form,
      // Transforma a string de especialidades em um Array
      especialidades: form.especialidades
        ? form.especialidades.split(",").map((s) => s.trim())
        : [],
      // Mantemos estruturas vazias para o que não foi implementado ainda
      dadosBancarios: {}, 
      documentos: []
    };

    try {
      await api.post("/cuidadores", payload);
      toast.success("Cadastro realizado! Aguarde a aprovação do administrador.");
      
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      const msg = error.response?.data?.message || "Erro ao realizar cadastro.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '800px' }}>
        <h1 className="auth-title">Cadastro de Cuidador</h1>

        <form className="form-layout" onSubmit={handleSubmit}>
          
          {/* SEÇÃO 1: DADOS BÁSICOS */}
          <div className="form-section">
            <h3>Dados Pessoais & Profissionais</h3>
            <div className="form-grid">
              <input name="nome" placeholder="Nome Completo" value={form.nome} onChange={handleChange} required />
              <input name="email" type="email" placeholder="E-mail" value={form.email} onChange={handleChange} required />
              <input name="senha" type="password" placeholder="Senha" value={form.senha} onChange={handleChange} required />
              <input name="cpf" placeholder="CPF (apenas números)" value={form.cpf} onChange={handleChange} required />
              <input name="telefone" placeholder="Telefone/WhatsApp" value={form.telefone} onChange={handleChange} required />
              <input 
                name="especialidades" 
                placeholder="Especialidades (separe por vírgula)" 
                value={form.especialidades} 
                onChange={handleChange} 
              />
            </div>
          </div>

          {/* SEÇÃO 2: ENDEREÇO (Conforme Swagger) */}
          <div className="form-section">
            <h3>Endereço de Residência</h3>
            <div className="form-grid">
              <input name="logradouro" placeholder="Logradouro (Rua/Av)" value={form.endereco.logradouro} onChange={handleEnderecoChange} required />
              <input name="numero" placeholder="Número" value={form.endereco.numero} onChange={handleEnderecoChange} required />
              <input name="complemento" placeholder="Complemento" value={form.endereco.complemento} onChange={handleEnderecoChange} />
              <input name="bairro" placeholder="Bairro" value={form.endereco.bairro} onChange={handleEnderecoChange} required />
              <input name="cidade" placeholder="Cidade" value={form.endereco.cidade} onChange={handleEnderecoChange} required />
              <input name="estado" placeholder="UF (Ex: SP)" value={form.endereco.estado} onChange={handleEnderecoChange} maxLength={2} required />
              <input name="cep" placeholder="CEP (apenas números)" value={form.endereco.cep} onChange={handleEnderecoChange} required />
              <input name="referencia" placeholder="Ponto de Referência" value={form.endereco.referencia} onChange={handleEnderecoChange} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate("/login")}>
              Voltar ao Login
            </button>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Processando..." : "Finalizar Cadastro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}