import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/login.css";
import Logo from "../../components/Logo";

export default function EsqueceuSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!email) {
      setErro("Informe seu e-mail");
      return;
    }

    try {
      setLoading(true);

      // Aqui futuramente vai chamar API real
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setMensagem(
        "Se este e-mail estiver cadastrado, enviaremos as instruções de recuperação."
      );
    } catch (err) {
      setErro("Erro ao processar solicitação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <Logo />

        <p className="subtitle">
          Recuperação de Senha
        </p>

        {erro && <div className="error-box">{erro}</div>}
        {mensagem && <div className="success-box">{mensagem}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar instruções →"}
          </button>
        </form>

        <div className="register-link">
          <Link to="/">Voltar para o login</Link>
        </div>
      </div>
    </div>
  );
}