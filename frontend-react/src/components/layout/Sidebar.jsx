import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Logo from "../Logo"; 

export default function Sidebar() {
  const { user } = useContext(AuthContext);

  function renderMenu() {
    switch (user?.role) {
      case "ADMIN":
        return (
          <>
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
            <NavLink to="/admin/pacientes">Pacientes</NavLink>
            <NavLink to="/admin/cuidadores">Cuidadores</NavLink>
            <NavLink to="/admin/relatorios">Relatórios</NavLink>
          </>
        );

      case "CUIDADOR":
        return (
          <>
            <NavLink to="/cuidador/dashboard">Dashboard</NavLink>
            <NavLink to="/cuidador/pacientes">Meus Pacientes</NavLink>
            <NavLink to="/cuidador/horas">Lancar Horas</NavLink>
          </>
        );

      case "FAMILIAR":
        return (
          <>
            <NavLink to="/familiar/dashboard">Dashboard</NavLink>
            <NavLink to="/familiar/paciente">Paciente</NavLink>
            <NavLink to="/familiar/relatorios">Relatorios</NavLink>
          </>
        );

      default:
        return null;
    }
  }

  return (
    <aside className="sidebar">
      {/* 🔹 Logo reutilizado */}
      <Logo />
      
      <nav className="sidebar-menu">
        {renderMenu()}
      </nav>
    </aside>
  );
}