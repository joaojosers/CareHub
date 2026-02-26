import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardCuidador() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState({ nome: "Cuidador" })

  const handleLogout = () => {
    navigate("/login");
  };
  
  return (
      <div style={{ padding: 20 }}>
        <h1>Bem-vindo, {usuario.nome}!</h1>
        <p>Você está no painel do Cuidador.</p>
      </div>
  );
}