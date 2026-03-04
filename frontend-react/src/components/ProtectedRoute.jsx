import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute({ perfilPermitido }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Backend returns user.tipo (e.g. "ADMIN", "CUIDADOR", "FAMILIAR"), not user.role
  if (perfilPermitido && user.tipo !== perfilPermitido) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

