import React, { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import "../../styles/Home.css";
import { Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";
const placeholder = "src/assets/placeholder.svg";

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

        const response = await fetch(`${API_URL}/categorias`);
        if (!response.ok) {
          throw new Error(`Erro ao buscar cardápio: ${response.status}`);
        }

        const dados = await response.json();
        setCategorias(dados);
      } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
        setErro(error.message);
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

  return (
    <div className="home-container">
      <h1 className="home-title">Nosso Cardápio</h1>

      {erro && <p style={{ color: "red" }}>Erro: {erro}</p>}
      {loading && <p>Carregando cardápio...</p>}

      {/* Filtros */}
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
            className={`filter-btn ${categoriaAtiva === cat.id ? "active" : ""
              }`}
          >
            {cat.nome}
          </button>
        ))}
      </div>

      {/* Produtos */}
      <div className="products-grid">
        {produtosFiltrados.map((item) => (
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
                <button className="product-btn"
                
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

                >Adicionar</button>
              </div>
            </div>
          </Link>
        ))}

        {!loading && produtosFiltrados.length === 0 && (
          <p>Nenhum produto encontrado para essa categoria.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
