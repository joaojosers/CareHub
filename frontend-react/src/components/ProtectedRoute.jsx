import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedRoute({ perfilPermitido }) {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (perfilPermitido && user.role !== perfilPermitido) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

