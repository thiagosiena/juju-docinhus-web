import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminDashboard.css";

import { 
  FiShoppingBag, 
  FiClock, 
  FiCheckCircle, 
  FiLayers, 
  FiArrowLeft, 
  FiList,
  FiEdit 
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function AdminDashboard() {
  const { token } = useAuth();

  const [pedidos, setPedidos] = useState([]);
  const [itensCardapio, setItensCardapio] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        setErro("");

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [respPedidos, respProdutos] = await Promise.all([
          fetch(`${API_URL}/admin/pedidos`, { headers }),
          fetch(`${API_URL}/admin/produtos`, { headers }),
        ]);

        if (!respPedidos.ok) throw new Error("Erro ao buscar pedidos");
        if (!respProdutos.ok) throw new Error("Erro ao buscar produtos");

        const pedidosData = await respPedidos.json();
        const produtosData = await respProdutos.json();

        setPedidos(pedidosData);
        setItensCardapio(produtosData.length);
      } catch (e) {
        console.error(e);
        setErro("Não foi possível carregar os dados do painel.");
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      carregarDados();
    }
  }, [token]);

  // --- CÁLCULOS DE RESUMO ---
  const hoje = new Date();
  const pedidosHoje = pedidos.filter((p) => {
    const data = new Date(p.data);
    return (
      data.getFullYear() === hoje.getFullYear() &&
      data.getMonth() === hoje.getMonth() &&
      data.getDate() === hoje.getDate()
    );
  });

  const emPreparo = pedidos.filter((p) => p.status === "EM_PREPARO");
  const prontos = pedidos.filter((p) => p.status === "PRONTO");

  const ultimosPedidos = [...pedidos]
    .sort((a, b) => new Date(b.data) - new Date(a.data))
    .slice(0, 5);

  return (
    <div className="admin-container">
     
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Painel Administrativo</h1>
          <p className="admin-welcome">Bem-vindo de volta, Admin!</p>
        </div>
        
        
        <Link to="/" className="btn-back-site">
          <FiArrowLeft size={20} />
          Voltar ao Site
        </Link>
      </header>

      {erro && <div className="error-banner">{erro}</div>}
      {loading && <p className="loading-text">Carregando indicadores...</p>}

      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box blue">
            <FiShoppingBag />
          </div>
          <div className="stat-info">
            <h3>{pedidosHoje.length}</h3>
            <p>Pedidos Hoje</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box orange">
            <FiClock />
          </div>
          <div className="stat-info">
            <h3>{emPreparo.length}</h3>
            <p>Em Preparo</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box green">
            <FiCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{prontos.length}</h3>
            <p>Prontos p/ Entrega</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-box pink">
            <FiLayers />
          </div>
          <div className="stat-info">
            <h3>{itensCardapio}</h3>
            <p>Itens no Cardápio</p>
          </div>
        </div>
      </div>

      
      <div className="actions-section">
        <h2 className="section-title">Gerenciamento Rápido</h2>
        <div className="actions-grid">
          <Link to="/admin/pedidos" className="action-card-btn">
            <FiList size={24} />
            <span>Gerenciar Pedidos</span>
          </Link>

          <Link to="/admin/cardapio" className="action-card-btn outline">
            <FiEdit size={24} />
            <span>Editar Cardápio</span>
          </Link>
        </div>
      </div>

      
      <div className="recent-orders-section">
        <h2 className="section-title">Últimos Pedidos Recebidos</h2>
        
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Mesa</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ultimosPedidos.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-row">Nenhum pedido registrado ainda.</td>
                </tr>
              )}

              {ultimosPedidos.map((pedido) => (
                <tr key={pedido.id}>
                  <td className="fw-bold">#{pedido.id}</td>
                  <td>{pedido.cliente}</td>
                  <td>{pedido.mesa}</td>
                  <td className="price-cell">R$ {Number(pedido.total).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${pedido.status.toLowerCase()}`}>
                      {pedido.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}