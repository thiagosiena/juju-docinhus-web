import React, { useState, useEffect } from "react";
import "../../styles/Checkout.css";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useFirebaseAuth } from "../../context/FirebaseAuthContext";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi"; // Ícones adicionados

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function Checkout() {
  const { items: itensCarrinho, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const { currentUser } = useFirebaseAuth(); 

  const [cliente, setCliente] = useState({
    nome: "",
    mesa: "",
    observacoes: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.displayName) {
      setCliente((prevCliente) => ({
        ...prevCliente,
        nome: currentUser.displayName
      }));
    }
  }, [currentUser]);

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
      <div className="checkout-header">
        <button className="checkout-back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft size={18} /> Voltar
        </button>
        <h1 className="checkout-title">Revisar Pedido</h1>
      </div>

      <div className="checkout-content">
        {/* Lado Esquerdo / Topo: Resumo do Pedido */}
        <div className="checkout-section">
          <h2 className="section-title">Resumo dos Itens</h2>
          <div className="checkout-items-box">
            {itensCarrinho.length === 0 && <p className="empty-msg">Seu carrinho está vazio.</p>}
            
            {itensCarrinho.map((item) => (
              <div key={item.id} className="checkout-item-card">
                <div className="item-info">
                  <span className="item-qty">{item.quantidade}x</span>
                  <h3 className="item-name">{item.nome}</h3>
                </div>
                <span className="item-price">
                  R$ {(Number(item.preco) * item.quantidade).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="checkout-total">
              <span>Total a pagar:</span>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        {/* Lado Direito / Base: Dados do Cliente */}
        <div className="checkout-section">
          <h2 className="section-title">Dados para Entrega</h2>
          <div className="checkout-form-box">
            <div className="checkout-form-grid">
              <div className="input-group span-2-desktop">
                <label>Como podemos te chamar?</label>
                <input
                  type="text"
                  value={cliente.nome}
                  onChange={(e) => setCliente({ ...cliente, nome: e.target.value })}
                  placeholder="Ex: João Silva"
                  required
                />
              </div>
              
              <div className="input-group">
                <label>Número da Mesa</label>
                <input
                  type="text"
                  value={cliente.mesa}
                  onChange={(e) => setCliente({ ...cliente, mesa: e.target.value })}
                  placeholder="Ex: 12"
                  required
                />
              </div>

              <div className="input-group span-full">
                <label>Observações do Pedido (Opcional)</label>
                <textarea
                  value={cliente.observacoes}
                  onChange={(e) => setCliente({ ...cliente, observacoes: e.target.value })}
                  placeholder="Remover algo, talher, etc..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="checkout-actions">
        <button
          className="checkout-confirm-btn"
          onClick={handleEnviarPedido}
          disabled={loading || itensCarrinho.length === 0}
        >
          {loading ? "Processando..." : (
            <>
              <FiCheckCircle size={20} /> Confirmar Pedido
            </>
          )}
        </button>
      </div>
    </div>
  );
}