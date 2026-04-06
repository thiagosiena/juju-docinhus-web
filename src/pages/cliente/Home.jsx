import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import "../../styles/Home.css";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const placeholder = "src/assets/placeholder.svg";
let globalMenuCache = null;
let globalCacheTime = null;
const CACHE_EXPIRATION = 1000 * 60 * 15;

function Home() {
  const { addItem } = useCart();
  const [categorias, setCategorias] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        setErro(null);

        const now = new Date().getTime();
        if (globalMenuCache && globalCacheTime && (now - globalCacheTime < CACHE_EXPIRATION)) {
          setCategorias(globalMenuCache);
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_URL}/categorias`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar cardápio: ${response.status}`);
        }

        const dados = await response.json();
        
        globalMenuCache = dados;
        globalCacheTime = now;

        setCategorias(dados);

      } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
        setErro("Não foi possível carregar o cardápio no momento.");
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, []);

  const todosProdutos = categorias.flatMap((cat) => cat.produtos || []);
  const produtosFiltrados =
    categoriaAtiva === null
      ? todosProdutos
      : (categorias.find((c) => c.id === categoriaAtiva)?.produtos || []);

  const getImagemSrc = (item) => {
    if (item.imagem_base64) {
      return `data:image/jpeg;base64,${item.imagem_base64}`;
    }
    return placeholder;
  };

  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="product-card skeleton-card">
        <div className="skeleton-img pulse"></div>
        <div className="product-info">
          <div className="skeleton-title pulse"></div>
          <div className="skeleton-desc pulse"></div>
          <div className="product-footer">
            <div className="skeleton-price pulse"></div>
            <div className="skeleton-btn pulse"></div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Nosso Cardápio</h1>

      {erro && <p style={{ color: "#ff4757", textAlign: "center", fontWeight: "bold" }}>{erro}</p>}

      {!loading && categorias.length > 0 && (
        <div className="home-filters">
          <button
            className={`filter-btn ${categoriaAtiva === null ? "active" : ""}`}
            onClick={() => setCategoriaAtiva(null)}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaAtiva(cat.id)}
              className={`filter-btn ${categoriaAtiva === cat.id ? "active" : ""}`}
            >
              {cat.nome}
            </button>
          ))}
        </div>
      )}

      <div className="products-grid">
        {loading ? (
          renderSkeletons()
        ) : (
          produtosFiltrados.map((item) => (
            <Link
              to={`/item/${item.id}`}
              key={item.id}
              className="product-card"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={getImagemSrc(item)}
                alt={item.nome}
                className="product-img"
                onError={(e) => {
                  e.target.src = "/assets/placeholder.png";
                }}
              />
              <div className="product-info">
                <h3 className="product-title">{item.nome}</h3>
                <p className="product-desc">{item.descricao}</p>
                <div className="product-footer">
                  <span className="product-price">
                    R$ {Number(item.preco).toFixed(2)}
                  </span>
                  <button
                    className="product-btn"
                    onClick={(e) => {
                      const imagemSrc = getImagemSrc(item);
                      e.preventDefault();
                      addItem({
                        id: item.id,
                        nome: item.nome,
                        preco: item.preco,
                        imagem: imagemSrc,
                      });
                    }}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </Link>
          ))
        )}

        {!loading && produtosFiltrados.length === 0 && !erro && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#888" }}>
            Nenhum produto encontrado.
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;