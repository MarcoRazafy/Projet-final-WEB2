import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Auth";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    // On garde la destination pour y revenir après login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
