import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import Logo from "../Logo";

export default function Sidebar() {
  const { usuario } = useContext(AuthContext);

  function renderMenu() {
    switch (usuario?.tipo) {
      case "ADMIN":
        return (
          <>
            <NavLink to="/admin/dashboard">Dashboard</NavLink>
            <NavLink to="/admin/pacientes">Pacientes</NavLink>
            <NavLink to="/admin/cuidadores">Cuidadores</NavLink>
            <NavLink to="/admin/relatorios">Relatórios</NavLink>
            <NavLink to="/admin/pagamentos">Pagamentos</NavLink>
          </>
        );

      case "CUIDADOR":
        return (
          <>
            <NavLink to="/cuidador/dashboard">Dashboard</NavLink>
            <NavLink to="/cuidador/pacientes">Meus Pacientes</NavLink>
            <NavLink to="/cuidador/horas">Registrar Plantão</NavLink>
          </>
        );

      case "FAMILIAR":
        return (
          <>
            <NavLink to="/familiar/dashboard">Dashboard</NavLink>
            <NavLink to="/familiar/paciente">Dependente</NavLink>
            
          </>
        );

      default:
        return null;
    }
  }

  return (
    <aside className="sidebar">
      <Logo />

      <nav className="sidebar-menu">
        {renderMenu()}
      </nav>
    </aside>
  );
}