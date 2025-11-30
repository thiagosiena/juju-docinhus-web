import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import "./AdminPedidos.css";

import { 
  FiArrowLeft, 
  FiFilter, 
  FiUser, 
  FiClock, 
  FiCheckCircle,
  FiShoppingBag,
  FiChevronDown, 
  FiChevronUp 
} from "react-icons/fi";

const API_URL = "http://127.0.0.1:8000";

const STATUS_ORDER = ["RECEBIDO", "EM_PREPARO", "PRONTO", "ENTREGUE"];

const STATUS_LABELS = {
  RECEBIDO: "Recebido",
  EM_PREPARO: "Em Preparo",
  PRONTO: "Pronto",
  ENTREGUE: "Entregue",
};

const FILTROS = ["Todos", ...STATUS_ORDER];

export default function AdminPedidos() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [filtro, setFiltro] = useState("Todos");
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  

  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    if (!token) return;
    let cancelado = false;

    async function carregarPedidos() {
      try {
        if (cancelado) return;
        if (pedidos.length === 0) setLoading(true);
        setErro("");

        const resp = await fetch(`${API_URL}/admin/pedidos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resp.ok) throw new Error("Erro ao buscar pedidos");

        const data = await resp.json();
        setPedidos(data);
      } catch (e) {
        if (!cancelado) console.error("Erro conexão silent");
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    carregarPedidos();
    const interval = setInterval(carregarPedidos, 10000);

    return () => {
      cancelado = true;
      clearInterval(interval);
    };
  }, [token]); 

  async function alterarStatus(id) {
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) return;

    const idx = STATUS_ORDER.indexOf(pedido.status);
    if (idx === -1 || idx === STATUS_ORDER.length - 1) return;

    const novoStatus = STATUS_ORDER[idx + 1];

    try {
      const resp = await fetch(`${API_URL}/admin/pedidos/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!resp.ok) throw new Error("Falha ao atualizar");

      const pedidoAtualizado = await resp.json();

      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? pedidoAtualizado : p))
      );
      
      showToast(`Pedido #${id} movido para ${STATUS_LABELS[novoStatus]}`);

    } catch (e) {
      alert("Erro ao mudar status: " + e.message);
    }
  }


  const toggleExpand = (id) => {
    setExpandedOrders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const pedidosFiltrados =
    filtro === "Todos" ? pedidos : pedidos.filter((p) => p.status === filtro);

  function formatarData(iso) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "--/--";
    return d.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
  }

  function formatarMoeda(valor) {
    return Number(valor).toFixed(2).replace('.', ',');
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Gerenciar Pedidos</h1>
          <p className="admin-welcome">Acompanhe o fluxo da cozinha</p>
        </div>
        
        <button className="btn-back-site" onClick={() => navigate("/admin/dashboard")}>
          <FiArrowLeft size={20} />
          Voltar ao Painel
        </button>
      </header>

      {erro && <div className="error-banner">{erro}</div>}

      <div className="filter-bar">
        <div className="filter-icon">
          <FiFilter />
          <span>Filtrar:</span>
        </div>
        <div className="filter-options">
          {FILTROS.map((f) => (
            <button
              key={f}
              className={`filter-pill ${filtro === f ? "active" : ""}`}
              onClick={() => setFiltro(f)}
            >
              {f === "Todos" ? "Todos" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {loading && pedidos.length === 0 && <p className="loading-text">Carregando...</p>}

      <div className="orders-grid">
        {pedidosFiltrados.length === 0 && !loading && (
          <div className="empty-state">
            <FiShoppingBag size={40} />
            <p>Nenhum pedido encontrado com este status.</p>
          </div>
        )}

        {pedidosFiltrados.map((pedido) => {
          const statusLower = pedido.status.toLowerCase();
          const label = STATUS_LABELS[pedido.status];
          const isExpanded = !!expandedOrders[pedido.id];

          return (
            <div key={pedido.id} className={`order-card border-${statusLower}`}>
              <div className="order-header">
                <span className="order-id">#{pedido.id}</span>
                <span className="order-time">
                  <FiClock size={14} style={{marginRight: 4}}/> 
                  {formatarData(pedido.data)}
                </span>
              </div>

              <div className="order-body">
                <div className="order-row">
                  <FiUser className="icon-muted" />
                  <strong>{pedido.cliente}</strong>
                  <span className="mesa-tag">Mesa {pedido.mesa}</span>
                </div>
                
                {/* --- ÁREA DE ITENS DETALHADA --- */}
                <div className="order-items-container">
                  <button 
                    className="toggle-items-btn" 
                    onClick={() => toggleExpand(pedido.id)}
                  >
                    {isExpanded ? "Ocultar Detalhes" : `Ver ${pedido.itens.length} Itens`}
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {isExpanded && (
                    <div className="items-list-wrapper">
                      <table className="items-mini-table">
                        <thead>
                          <tr>
                            <th>Qtd</th>
                            <th>Item</th>
                            <th>Unit.</th>
                            <th align="right">Sub.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedido.itens.map((item, index) => (
                            <tr key={index}>
                              <td className="qty-col">{item.quantidade}x</td>
                              <td className="name-col">{item.nome_produto}</td>
                              <td className="unit-col">
                                {item.preco_unitario ? formatarMoeda(item.preco_unitario) : "-"}
                              </td>
                              <td className="sub-col">
                                {formatarMoeda(item.subtotal)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="order-total">
                  <span>Total do Pedido:</span>
                  <strong>R$ {formatarMoeda(pedido.total)}</strong>
                </div>
              </div>

              <div className="order-footer">
                <span className={`status-badge ${statusLower}`}>
                  {label}
                </span>

                {pedido.status !== "ENTREGUE" && (
                  <button
                    className="btn-advance"
                    onClick={() => alterarStatus(pedido.id)}
                  >
                    Avançar <FiCheckCircle />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}