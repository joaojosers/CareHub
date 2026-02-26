import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nome: "Administrador" });

  const handleLogout = () => {
    navigate("/login");
  };

  return (
      <div style={{ padding: 20 }}>
        <h1>Bem-vindo, {usuario.nome}!</h1>
        <p>Você está no painel administrativo.</p>
      </div>
  );
}