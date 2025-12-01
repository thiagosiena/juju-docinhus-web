import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Carrinho.css";
import { useCart } from "../../context/CartContext";

export default function Carrinho() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const PLACEHOLDER = "src/assets/placeholder.svg";
  const navigate = useNavigate();

  return (
    <div className="cart-container">
      <div className="cart-header">
        <button className="cart-back-btn" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
        <h1 className="cart-title">Seu Pedido</h1>
      </div>

      <div className="cart-items">
        {items.length === 0 && <p>Seu carrinho está vazio.</p>}

        {items.map((item) => (
          <div key={item.id} className="cart-item-card">
            <img
              src={item.imagem || PLACEHOLDER}
              alt={item.nome}
              className="cart-img"
              onError={(e) => { e.target.src = PLACEHOLDER; }}
            />

            <div className="cart-info">
              <h3 className="cart-name">{item.nome}</h3>
              <span className="cart-price">
                R$ {Number(item.preco).toFixed(2)}
              </span>

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
            </div>

            <button className="remove-btn" onClick={() => removeItem(item.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-footer">
        <div className="cart-total">
          <span>Total:</span>
          <strong>R$ {total.toFixed(2)}</strong>
        </div>

        <div className="cart-actions">
          <Link
            to="/checkout"
            className={`cart-finalize-btn ${items.length === 0 ? "disabled" : ""}`}
            onClick={(e) => {
              if (items.length === 0) e.preventDefault();
            }}
          >
            Finalizar Pedido →
          </Link>
        </div>
      </div>
    </div>
  );
}