import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import "../../styles/login.css";
import Logo from "../../components/Logo";

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!token) {
      setErro("Token inválido ou expirado");
      return;
    }

    if (!senha || !confirmarSenha) {
      setErro("Preencha todos os campos");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    try {
      setLoading(true);

      // Simulação de chamada API
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setMensagem("Senha redefinida com sucesso!");

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      setErro("Erro ao redefinir senha");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <Logo />

        <p className="subtitle">Redefinir Senha</p>

        {erro && <div className="error-box">{erro}</div>}
        {mensagem && <div className="success-box">{mensagem}</div>}

        <form onSubmit={handleSubmit}>
          <label>Nova Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <label>Confirmar Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Redefinir senha →"}
          </button>
        </form>

        <div className="register-link">
          <Link to="/">Voltar para o login</Link>
        </div>
      </div>
    </div>
  );
}