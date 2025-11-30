// src/router/index.jsx (ou AppRoutes.jsx)
import { Routes, Route } from "react-router-dom";

import ClienteLayout from "../layouts/ClienteLayout";

// Cliente
import Home from "../pages/cliente/Home";
import ItemDetalhes from "../pages/cliente/ItemDetalhes";
import Carrinho from "../pages/cliente/Carrinho";
import Checkout from "../pages/cliente/Checkout";

// Admin
import Login from "../pages/admin/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCardapio from "../pages/admin/AdminCardapio";
import AdminPedidos from "../pages/admin/AdminPedidos";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ROTAS DO CLIENTE COM LAYOUT */}
      <Route element={<ClienteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetalhes />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      {/* LOGIN ADMIN (público) */}
      <Route path="/admin" element={<Login />} />

      {/* ROTAS ADMIN PROTEGIDAS */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/cardapio" element={<AdminCardapio />} />
        <Route path="/admin/pedidos" element={<AdminPedidos />} />
      </Route>
    </Routes>
  );
}
