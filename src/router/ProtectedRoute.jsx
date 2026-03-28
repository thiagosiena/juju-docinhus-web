// src/router/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Auth da API (Admin)
import { useFirebaseAuth } from "../context/FirebaseAuthContext"; // Auth do Firebase (Cliente)

export default function ProtectedRoute({ tipo = "admin" }) {
  const { isAuthenticated } = useAuth();
  const { currentUser } = useFirebaseAuth();

  // 1. Regra para o Lojista (Admin)
  if (tipo === "admin") {
    if (!isAuthenticated) {
      return <Navigate to="/admin" replace />;
    }
  }

  // 2. Regra para o Cliente (Firebase)
  if (tipo === "cliente") {
    if (!currentUser) {
      return (
        <Navigate 
          to="/login" 
          state={{ mensagem: "Faça login ou cadastre-se para acessar o checkout." }} 
          replace 
        />
      );
    }
  }

  // Se passou na catraca, libera a renderização da tela
  return <Outlet />;
}