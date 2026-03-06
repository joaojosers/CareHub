import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import "../../styles/login.css";
import Logo from "../../components/Logo";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);

      const user = await login(email, senha);

      if (user.tipo === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.tipo === "CUIDADOR") {
        navigate("/cuidador/dashboard");
      } else if (user.tipo === "FAMILIAR") {
        navigate("/familiar/dashboard");
      }
    } catch (error) {
      setErro(error.message || "Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <Logo />

        <p className="subtitle">
          Sistema de Gestão de Cuidadores
        </p>

        {erro && <div className="error-box">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar →"}
          </button>
        </form>

        <div className="register-link">
          Primeiro acesso?{" "}
          <Link to="/cadastro">Cadastre-se</Link>
        </div>

        <div className="forgot-password">
          <Link to="/esqueceu-senha">Esqueceu sua senha?</Link>
        </div>
      </div>
    </div>
  );
}