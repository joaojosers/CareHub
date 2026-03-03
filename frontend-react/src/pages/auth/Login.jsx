import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast"; // Recomendado para avisos mais elegantes
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

      if (!user) {
        setErro("Erro ao autenticar usuário");
        return;
      }

      // 1. Verificar se o usuário está ativo/aprovado
      // Bloqueia cuidadores PENDENTES ou qualquer usuário SUSPENSO
      if (user.status === "PENDENTE") {
        setErro("Seu cadastro está em análise. Você receberá um aviso quando for aprovado.");
        return;
      }

      if (user.status === "SUSPENSO") {
        setErro("Seu acesso está temporariamente suspenso. Contate o administrador.");
        return;
      }

      const tipo = user.tipo?.toUpperCase();

      // 2. Lógica de Redirecionamento baseada no Tipo (Role)
      switch (tipo) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "CUIDADOR":
          navigate("/cuidador/dashboard");
          break;
        case "FAMILIAR":
          navigate("/familiar/dashboard");
          break;
        default:
          setErro("Tipo de usuário não reconhecido no sistema");
      }

    } catch (error) {
      // Captura erros de credenciais ou erros do servidor
      const msg = error.response?.data?.message || "E-mail ou senha incorretos";
      setErro(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <Logo />

        <p className="subtitle">Sistema de Gestão de Cuidadores</p>

        {erro && <div className="error-box">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Autenticando..." : "Entrar →"}
          </button>
        </form>

        <div className="register-link">
          Primeiro acesso? <Link to="/cadastro">Cadastre-se</Link>
        </div>

        <div className="forgot-password">
          <Link to="/esqueceu-senha">Esqueceu sua senha?</Link>
        </div>
      </div>
    </div>
  );
}