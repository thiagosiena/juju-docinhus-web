import React from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/Carrinho.css";
import { useCart } from "../../context/CartContext";
import { useFirebaseAuth } from "../../context/FirebaseAuthContext";
import { FiArrowLeft, FiTrash2, FiShoppingBag } from "react-icons/fi"; // Importando ícones modernos

export default function Carrinho() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const { currentUser } = useFirebaseAuth();
  const PLACEHOLDER = "src/assets/placeholder.svg";
  const navigate = useNavigate();

  const handleFinalizarPedido = () => {
    if (items.length === 0) return;

    if (!currentUser) {
      navigate("/login", { 
        state: { mensagem: "Faça login ou cadastre-se para finalizar seu pedido!" } 
      });
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button className="cart-back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft size={18} /> Voltar
        </button>
        <h1 className="cart-title">Seu Pedido</h1>
      </div>

      <div className="cart-content">
        {items.length === 0 ? (
          <div className="cart-empty-state">
            <FiShoppingBag className="empty-icon" />
            <h2>Seu carrinho está vazio</h2>
            <p>Que tal adicionar alguns doces deliciosos?</p>
            <Link to="/" className="btn-voltar-cardapio">
              Ver Cardápio
            </Link>
          </div>
        ) : (
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img
                  src={item.imagem || PLACEHOLDER}
                  alt={item.nome}
                  className="cart-img"
                  onError={(e) => { e.target.src = "/assets/placeholder.png"; }}
                />

                <div className="cart-info">
                  <h3 className="cart-name">{item.nome}</h3>
                  <span className="cart-price">
                    R$ {Number(item.preco).toFixed(2)}
                  </span>

                  <div className="cart-qty-wrapper">
                    <div className="cart-qty">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                      > - </button>
                      <span className="qty-number">{item.quantidade}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                      > + </button>
                    </div>
                    
                    {/* Botão de lixeira moderno */}
                    <button className="remove-btn" onClick={() => removeItem(item.id)} title="Remover item">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rodapé do Carrinho */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <span className="summary-label">Total do Pedido:</span>
              <strong className="summary-total">R$ {total.toFixed(2)}</strong>
            </div>

            <button
              className="cart-finalize-btn"
              onClick={handleFinalizarPedido}
            >
              Avançar para Checkout →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}