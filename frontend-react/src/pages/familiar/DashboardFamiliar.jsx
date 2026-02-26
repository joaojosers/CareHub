import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardFamiliar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nome: "Responsavel" })

  const handleLogout = () => {
    navigate("/login");
  };
  
  return (
      <div style={{ padding: 20 }}>
        <h1>Bem-vindo, {usuario.nome}!</h1>
        <p>Você está no painel do Responsavel.</p>
      </div>
  );
}