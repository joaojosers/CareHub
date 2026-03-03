import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute({ perfilPermitido }) {
  const { usuario } = useContext(AuthContext);

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (perfilPermitido && usuario.tipo !== perfilPermitido) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}