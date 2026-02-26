import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../components/layout/MainLayout";

/* ========================= */
/* AUTH */
/* ========================= */
import Cadastro from "../pages/auth/Cadastro";
import EsqueceuSenha from "../pages/auth/EsqueceuSenha";
import Login from "../pages/auth/Login";

/* ========================= */
/* ADMIN */
/* ========================= */
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import Cuidadores from "../pages/admin/Cuidadores";
import Pacientes from "../pages/admin/Pacientes";
import DetalhePaciente from "../pages/admin/DetalhePaciente";
import RelatoriosAdmin from "../pages/admin/Relatorios";
import DetalheCuidador from "../pages/admin/DetalheCuidador";
import AdminHoras from "../pages/admin/AdminHoras";

/* ========================= */
/* CUIDADOR */
/* ========================= */
import DashboardCuidador from "../pages/cuidador/DashboardCuidador";
import MeusPacientes from "../pages/cuidador/MeusPacientes";
import LancarHoras from "../pages/cuidador/LancarHoras";

/* ========================= */
/* FAMILIAR */
/* ========================= */
import DashboardFamiliar from "../pages/familiar/DashboardFamiliar";
import Paciente from "../pages/familiar/Pacientes";
import RelatoriosFamiliar from "../pages/familiar/Relatorios";

/* ========================= */
/* NOT FOUND */
/* ========================= */
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <Routes>

      {/* ========================= */}
      {/* ROTAS PÚBLICAS */}
      {/* ========================= */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />

      {/* ========================= */}
      {/* ADMIN */}
      {/* ========================= */}
      <Route element={<ProtectedRoute perfilPermitido="ADMIN" />}>
        <Route element={<MainLayout />}>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/cuidadores" element={<Cuidadores />} />
          <Route path="/admin/cuidadores/:id" element={<DetalheCuidador />} />
          <Route path="/admin/pacientes" element={<Pacientes />} />
          <Route path="/admin/pacientes/:id" element={<DetalhePaciente />} />
          <Route path="/admin/relatorios" element={<RelatoriosAdmin />} />
          <Route path="/admin/horas" element={<AdminHoras />} />
        </Route>
      </Route>

      {/* ========================= */}
      {/* CUIDADOR */}
      {/* ========================= */}
      <Route element={<ProtectedRoute perfilPermitido="CUIDADOR" />}>
        <Route element={<MainLayout />}>
          <Route path="/cuidador/dashboard" element={<DashboardCuidador />} />
          <Route path="/cuidador/pacientes" element={<MeusPacientes />} />
          <Route path="/cuidador/horas" element={<LancarHoras />} />
        </Route>
      </Route>

      {/* ========================= */}
      {/* FAMILIAR */}
      {/* ========================= */}
      <Route element={<ProtectedRoute perfilPermitido="FAMILIAR" />}>
        <Route element={<MainLayout />}>
          <Route path="/familiar/dashboard" element={<DashboardFamiliar />} />
          <Route path="/familiar/paciente" element={<Paciente />} />
          <Route path="/familiar/relatorios" element={<RelatoriosFamiliar />} />
        </Route>
      </Route>

      {/* ========================= */}
      {/* ROTA NÃO ENCONTRADA */}
      {/* ========================= */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default AppRoutes;