// src/router/index.jsx (ou AppRoutes.jsx)
import { Routes, Route } from "react-router-dom";

import ClienteLayout from "../layouts/ClienteLayout";

// --- Importações do Cliente ---
import Home from "../pages/cliente/Home";
import ItemDetalhes from "../pages/cliente/ItemDetalhes";
import Carrinho from "../pages/cliente/Carrinho";
import Checkout from "../pages/cliente/Checkout";
import LoginCliente from "../pages/cliente/Login";
import Cadastro from "../pages/cliente/Cadastro"; 
import RecuperarSenha from "../pages/cliente/RecuperarSenha";
import Sobre from "../pages/cliente/Sobre"; 

// --- Importações do Admin ---
import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCardapio from "../pages/admin/AdminCardapio";
import AdminPedidos from "../pages/admin/AdminPedidos";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      
      {/* ===== ÁREA DO CLIENTE ===== */}
      <Route element={<ClienteLayout />}>
        {/* Rotas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetalhes />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route element={<ProtectedRoute tipo="cliente" />}>
          <Route path="/checkout" element={<Checkout />} />
        </Route>
        <Route path="/sobre" element={<Sobre />} />
      </Route>

        <Route path="/login" element={<LoginCliente />} />
        <Route path="/cadastro" element={<Cadastro />} /> 
        
        <Route path="/recuperar-senha" element={<RecuperarSenha/>}/>
      {/* ===== ÁREA DO ADMIN ===== */}
      {/* LOGIN ADMIN (público, mas sem o Layout do cliente) */}
      <Route path="/admin" element={<AdminLogin />} />

      {/* ROTAS ADMIN PROTEGIDAS (API) */}
      <Route element={<ProtectedRoute tipo="admin" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/cardapio" element={<AdminCardapio />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
      </Route>

    </Routes>
  );
}