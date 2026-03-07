import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./header.css";

export default function Header() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="welcome-container">
          <span className="welcome-text">
            Bem-vindo, <strong>{usuario?.email}</strong>
          </span>

          <span className="welcome-role">
            {usuario?.tipo}
          </span>
        </div>
      </div>

      <div className="header-right">
        <button onClick={handleLogout} className="logout-btn">
          Sair
        </button>
      </div>
    </header>
  );
}