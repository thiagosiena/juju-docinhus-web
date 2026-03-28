import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/ItemDetalhes.css";
import { useCart } from "../../context/CartContext";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const PLACEHOLDER = "src/assets/placeholder.svg";

function ItemDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [item, setItem] = useState(null);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      try {
        setLoading(true);
        setErro(null);
        const resp = await fetch(`${API_URL}/produtos/${id}`);
        if (!resp.ok) throw new Error(`Erro ao buscar produto: ${resp.status}`);
        const data = await resp.json();
        setItem(data);
      } catch (error) {
        setErro(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  const getImagemSrc = () => {
    if (!item) return PLACEHOLDER;
    if (item.imagem_base64) {
      return `data:image/jpeg;base64,${item.imagem_base64}`;
    }
    return PLACEHOLDER;
  };

  if (loading) return <p>Carregando...</p>;
  if (erro || !item) return <p>Erro ao carregar produto.</p>;

  const imagemSrc = getImagemSrc();

  return (
    <div className="item-detalhes-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Voltar
      </button>

      <div className="item-detalhes-card">
        <img
          src={imagemSrc}
          alt={item.nome}
          className="item-detalhes-img"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        <div className="item-detalhes-info">
          <h2 className="item-detalhes-title">{item.nome}</h2>
          <p className="item-detalhes-desc">{item.descricao}</p>
          <span className="item-detalhes-price">
            R$ {Number(item.preco).toFixed(2)}
          </span>
          <button
            className="item-detalhes-btn"
            onClick={(e) => {
              e.preventDefault();
              addItem({
                id: item.id,
                nome: item.nome,
                preco: item.preco,
                imagem: imagemSrc,
              });
            }}
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetalhes;