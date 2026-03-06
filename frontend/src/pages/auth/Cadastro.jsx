import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-hot-toast";

export default function Cadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Novo estado para controlar a tela de sucesso

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    cpf: "",
    telefone: "",
    especialidades: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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

    const payload = {
      ...form,
      especialidades: form.especialidades
        ? form.especialidades.split(",").map((s) => s.trim())
        : [],
      dadosBancarios: {}, 
      documentos: []
    };

    try {
      await api.post("/cuidadores", payload);
      // Ativamos a tela de sucesso em vez do toast temporário
      setIsSuccess(true);
    } catch (error) {
      const msg = error.response?.data?.message || "Erro ao realizar cadastro.";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false);
    }
  };

  // TELA DE SUCESSO PÓS-CADASTRO
  if (isSuccess) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card" style={{ maxWidth: '500px', textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>✅</div>
          <h2 style={{ color: '#10b981', marginBottom: '15px' }}>Cadastro Realizado!</h2>
          <p style={{ color: '#94a3b8', marginBottom: '30px', lineHeight: '1.6' }}>
            Suas informações foram enviadas com sucesso. <br />
            <strong>Aguarde a aprovação do administrador</strong> para acessar a plataforma.
          </p>
          <button 
            className="btn-primary" 
            style={{ width: '100%' }} 
            onClick={() => navigate("/login")}
          >
            Entendido, ir para o Login
          </button>
        </div>
      </div>
    );
  }

  // FORMULÁRIO ORIGINAL
  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '800px' }}>
        <h1 className="auth-title">Cadastro de Cuidador</h1>

        <form className="form-layout" onSubmit={handleSubmit}>
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