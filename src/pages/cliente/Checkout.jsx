import React, { useState } from "react";
import "../../styles/Checkout.css";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
// 1. Importamos o contexto de Toast
import { useToast } from "../../context/ToastContext";

const API_URL = "http://127.0.0.1:8000";

export default function Checkout() {
  const { items: itensCarrinho, total, clearCart } = useCart();
  const navigate = useNavigate();
  

  const { showToast } = useToast();

  const [cliente, setCliente] = useState({
    nome: "",
    mesa: "",
    observacoes: "",
  });

 
  const [loading, setLoading] = useState(false);

  async function handleEnviarPedido() {
    
    if (itensCarrinho.length === 0) {
      showToast("Seu carrinho está vazio.");
      return;
    }
    if (!cliente.nome || !cliente.mesa) {
      showToast("Informe o Nome e o número da Mesa.");
      return;
    }
    const mesaNumero = parseInt(cliente.mesa, 10);
    if (Number.isNaN(mesaNumero)) {
      showToast("A mesa deve ser um número válido.");
      return;
    }

    const body = {
      cliente: cliente.nome,
      mesa: mesaNumero,
      itens: itensCarrinho.map((item) => ({
        produto_id: item.id,
        quantidade: item.quantidade,
      })),
    };

    try {
      setLoading(true);

      const resp = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        throw new Error(errBody.detail || "Erro ao enviar pedido");
      }

      const pedido = await resp.json();
      
      clearCart();
      setCliente({ nome: "", mesa: "", observacoes: "" });
      
      showToast(`Pedido #${pedido.id} enviado com sucesso!`);
      
      navigate("/");

    } catch (err) {
    
      showToast(err.message || "Erro ao enviar pedido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="checkout-container">
      {/* --- HEADER --- */}
      <div className="checkout-header">
        <button className="checkout-back-btn" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
        <h1 className="checkout-title">Revisar Pedido</h1>
      </div>

      {/* Lista dos itens */}
      <div className="checkout-items">
        {itensCarrinho.length === 0 && <p>Seu carrinho está vazio.</p>}
        {itensCarrinho.map((item) => (
          <div key={item.id} className="checkout-item-card">
            <div>
              <h3>{item.nome}</h3>
              <p>Quantidade: {item.quantidade}</p>
            </div>
            <span className="checkout-price">
              R$ {(Number(item.preco) * item.quantidade).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="checkout-total">
        <span>Total:</span>
        <strong>R$ {total.toFixed(2)}</strong>
      </div>

      <h2 className="cliente-title">Dados do Cliente</h2>

      <div className="checkout-form">
        <label>
          Nome:
          <input
            type="text"
            value={cliente.nome}
            onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
            placeholder="Ex: João"
            required
          />
        </label>
        <label>
          Mesa
          <input
            type="text"
            value={cliente.mesa}
            onChange={(e) => setCliente({ ...cliente, mesa: e.target.value })}
            placeholder="Ex: 12"
            required
          />
        </label>
        <label>
          Observações:
          <textarea
            value={cliente.observacoes}
            onChange={(e) => setCliente({ ...cliente, observacoes: e.target.value })}
            placeholder="Alguma observação? (Opcional)"
          ></textarea>
        </label>
      </div>

      <button
        className="checkout-confirm-btn"
        onClick={handleEnviarPedido}
        disabled={loading || itensCarrinho.length === 0}
      >
        {loading ? "Enviando..." : "Enviar Pedido"}
      </button>
    </div>
  );
}