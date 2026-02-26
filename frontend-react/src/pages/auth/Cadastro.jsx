import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  cadastrarCuidador,
  verificarEmailExistente
} from "../../services/userService";

export default function Cadastro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    cpf: "",
    birthDate: "",
    phone: "",
    street: "",
    number: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    password: ""
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!form.name || !form.cpf || !form.birthDate) {
      return setErro("Preencha todos os dados pessoais obrigatórios");
    }

    try {
      setLoading(true);

      const emailExiste = await verificarEmailExistente(form.email);

      if (emailExiste) {
        setLoading(false);
        return setErro("Este e-mail já está cadastrado");
      }

      await cadastrarCuidador(form);

      setSucesso(
        "Cadastro realizado com sucesso! Aguarde aprovação do administrador."
      );

      setForm({
        name: "",
        cpf: "",
        birthDate: "",
        phone: "",
        street: "",
        number: "",
        city: "",
        state: "",
        zip: "",
        email: "",
        password: ""
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      setErro("Erro ao cadastrar cuidador");
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="auth-wrapper">

    <div className="auth-card">

      <h1 className="auth-title">Cadastro de Cuidador</h1>

      <form className="form-layout" onSubmit={handleSubmit}>

        {erro && <div className="alert-error">{erro}</div>}
        {sucesso && <div className="alert-success">{sucesso}</div>}

        <div className="form-section">
          <h3>Dados Pessoais</h3>
          <div className="form-grid">
            <input name="name" placeholder="Nome completo" value={form.name} onChange={handleChange} />
            <input name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} />
            <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} />
            <input name="phone" placeholder="Telefone / WhatsApp" value={form.phone} onChange={handleChange} />
          </div>
        </div>

        <div className="form-section">
          <h3>Endereço</h3>
          <div className="form-grid">
            <input name="street" placeholder="Rua" value={form.street} onChange={handleChange} />
            <input name="number" placeholder="Número" value={form.number} onChange={handleChange} />
            <input name="city" placeholder="Cidade" value={form.city} onChange={handleChange} />
            <input name="state" placeholder="Estado" value={form.state} onChange={handleChange} />
            <input name="zip" placeholder="CEP" value={form.zip} onChange={handleChange} />
          </div>
        </div>

        <div className="form-section">
          <h3>Credenciais</h3>
          <div className="form-grid">
            <input type="email" name="email" placeholder="E-mail" value={form.email} onChange={handleChange} />
            <input type="password" name="password" placeholder="Senha" value={form.password} onChange={handleChange} />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/login")}
          >
            Cancelar
          </button>

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </div>

      </form>
    </div>

  </div>
);
}