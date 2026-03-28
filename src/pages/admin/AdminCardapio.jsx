// src/pages/admin/AdminCardapio.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
// 1. Importamos o hook do Toast
import { useToast } from "../../context/ToastContext";
import "./AdminCardapio.css";

import { 
  FiArrowLeft, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiImage,
  FiFolderPlus 
} from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function AdminCardapio() {
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const { showToast } = useToast();

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // Modais
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [categoriaModalOpen, setCategoriaModalOpen] = useState(false);
  
  // States dos Formulários
  const [novoNomeCategoria, setNovoNomeCategoria] = useState("");
  const [categoriaLoading, setCategoriaLoading] = useState(false);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [imagemBase64, setImagemBase64] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);

  function getAuthHeaders() {
    return { Authorization: `Bearer ${token}` };
  }

  useEffect(() => {
    if (!token) return;

    async function carregarDados() {
      try {
        setLoading(true);
        setErro("");

        const headers = { "Content-Type": "application/json", ...getAuthHeaders() };

        const [respProdutos, respCategorias] = await Promise.all([
          fetch(`${API_URL}/admin/produtos`, { headers }),
          fetch(`${API_URL}/categorias`),
        ]);

        if (!respProdutos.ok) throw new Error("Erro ao carregar produtos");
        if (!respCategorias.ok) throw new Error("Erro ao carregar categorias");

        const dataProdutos = await respProdutos.json();
        const dataCategorias = await respCategorias.json();

        setProdutos(dataProdutos);
        setCategorias(dataCategorias);
      } catch (e) {
        console.error(e);
        setErro("Falha ao carregar dados do cardápio.");
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, [token]);

  // --- LÓGICA DE MODAL DE PRODUTO ---
  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setNome(item.nome);
      setDescricao(item.descricao || "");
      setPreco(String(item.preco));
      setCategoriaId(String(item.categoria_id));
      setImagemBase64(null);
      
      if (item.imagem) {
         setImagemPreview(null); 
      } else {
         setImagemPreview(null);
      }
    } else {
      setNome("");
      setDescricao("");
      setPreco("");
      setCategoriaId("");
      setImagemBase64(null);
      setImagemPreview(null);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingItem(null);
    setModalOpen(false);
  };

  // --- LÓGICA DE IMAGEM ---
  function handleImagemChange(e) {
    const file = e.target.files[0];
    if (!file) {
      setImagemBase64(null);
      setImagemPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setImagemPreview(result);
      const base64 = result.split(",")[1] || null;
      setImagemBase64(base64);
    };
    reader.readAsDataURL(file);
  }

  // --- SALVAR PRODUTO (CRIAR OU EDITAR) ---
  async function handleSalvarProduto(e) {
    e.preventDefault();
    if (!nome || !preco || !categoriaId) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    const body = {
      nome,
      descricao: descricao || null,
      preco: Number(preco),
      categoria_id: Number(categoriaId),
      imagem_base64: imagemBase64 || null,
    };

    const isEdit = !!editingItem;
    const url = isEdit
      ? `${API_URL}/admin/produtos/${editingItem.id}`
      : `${API_URL}/admin/produtos`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const resp = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(body),
      });

      if (!resp.ok) throw new Error("Erro ao salvar produto");

      const produtoSalvo = await resp.json();

      if (isEdit) {
        setProdutos((prev) =>
          prev.map((p) => (p.id === produtoSalvo.id ? produtoSalvo : p))
        );
      } else {
        setProdutos((prev) => [...prev, produtoSalvo]);
      }
      
      showToast(isEdit ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!");
      
      closeModal();
    } catch (e) {
      alert(e.message);
    }
  }

  // --- EXCLUIR PRODUTO ---
  async function removeItem(id) {
    if (!window.confirm("Deseja realmente excluir este item?")) return;
    try {
      const resp = await fetch(`${API_URL}/admin/produtos/${id}`, {
        method: "DELETE",
        headers: { ...getAuthHeaders() },
      });
      if (!resp.ok && resp.status !== 204) throw new Error("Erro ao excluir");
      
      setProdutos((prev) => prev.filter((p) => p.id !== id));
      
      // 4. Toast de Sucesso ao Excluir
      showToast("Produto removido com sucesso!");
      
    } catch (e) {
      alert(e.message);
    }
  }

  // --- CATEGORIAS ---
  async function handleSalvarCategoria(e) {
    e.preventDefault();
    if (!novoNomeCategoria.trim()) return;

    try {
      setCategoriaLoading(true);
      const resp = await fetch(`${API_URL}/admin/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ nome: novoNomeCategoria.trim() }),
      });
      if (!resp.ok) throw new Error("Erro ao criar categoria");
      const novaCat = await resp.json();
      setCategorias((prev) => [...prev, novaCat]);
      
      // 5. Toast de Sucesso ao Criar Categoria
      showToast(`Categoria "${novaCat.nome}" criada!`);
      
      setCategoriaModalOpen(false);
      setNovoNomeCategoria("");
    } catch (e) {
      alert(e.message);
    } finally {
      setCategoriaLoading(false);
    }
  }

  function getCategoriaNome(id) {
    const cat = categorias.find((c) => c.id === id);
    return cat ? cat.nome : "-";
  }

  return (
    <div className="admin-container">
      {/* HEADER GLOBAL */}
      <header className="admin-header">
        <div>
          <h1 className="admin-title">Gerenciar Cardápio</h1>
          <p className="admin-welcome">Adicione, edite ou remova itens do seu menu</p>
        </div>
        <button className="btn-back-site" onClick={() => navigate("/admin/dashboard")}>
          <FiArrowLeft size={20} />
          Voltar ao Painel
        </button>
      </header>

      {erro && <div className="error-banner">{erro}</div>}
      
      {/* BARRA DE AÇÕES */}
      <div className="actions-bar">
        <button className="btn-primary" onClick={() => openModal()}>
          <FiPlus size={20} />
          Novo Produto
        </button>
        <button className="btn-secondary" onClick={() => setCategoriaModalOpen(true)}>
          <FiFolderPlus size={20} />
          Nova Categoria
        </button>
      </div>

      {loading && <p className="loading-text">Carregando cardápio...</p>}

      {/* TABELA DE PRODUTOS */}
      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th align="right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {!loading && produtos.length === 0 && (
              <tr>
                <td colSpan={4} className="empty-row">Nenhum produto cadastrado.</td>
              </tr>
            )}
            {produtos.map((item) => (
              <tr key={item.id}>
                <td className="fw-bold">{item.nome}</td>
                <td>
                  <span className="category-tag">{getCategoriaNome(item.categoria_id)}</span>
                </td>
                <td className="price-text">R$ {Number(item.preco).toFixed(2)}</td>
                <td className="actions-cell">
                  <button className="icon-btn edit" onClick={() => openModal(item)} title="Editar">
                    <FiEdit3 />
                  </button>
                  <button className="icon-btn delete" onClick={() => removeItem(item.id)} title="Excluir">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODAL PRODUTO --- */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingItem ? "Editar Produto" : "Novo Produto"}</h2>
              <button className="close-x" onClick={closeModal}>✕</button>
            </div>
            
            <form onSubmit={handleSalvarProduto} className="modal-form">
              <div className="form-group">
                <label>Nome do Produto</label>
                <input 
                  type="text" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  required 
                  placeholder="Ex: Bolo de Cenoura"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Preço (R$)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={preco} 
                    onChange={(e) => setPreco(e.target.value)} 
                    required 
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Categoria</label>
                  <select 
                    value={categoriaId} 
                    onChange={(e) => setCategoriaId(e.target.value)} 
                    required
                  >
                    <option value="">Selecione...</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descrição</label>
                <textarea 
                  value={descricao} 
                  onChange={(e) => setDescricao(e.target.value)} 
                  placeholder="Ingredientes, detalhes..."
                />
              </div>

              <div className="form-group">
                <label className="file-upload-label">
                  <FiImage size={24} />
                  <span>{imagemPreview ? "Alterar Imagem" : "Escolher Imagem"}</span>
                  <input type="file" accept="image/*" onChange={handleImagemChange} />
                </label>
                
                {imagemPreview && (
                  <div className="preview-container">
                    <img src={imagemPreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancelar</button>
                <button type="submit" className="btn-save">Salvar Produto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL CATEGORIA --- */}
      {categoriaModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content small">
            <div className="modal-header">
              <h2>Nova Categoria</h2>
              <button className="close-x" onClick={() => setCategoriaModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSalvarCategoria} className="modal-form">
              <div className="form-group">
                <label>Nome da Categoria</label>
                <input 
                  type="text" 
                  value={novoNomeCategoria} 
                  onChange={(e) => setNovoNomeCategoria(e.target.value)} 
                  required 
                  placeholder="Ex: Bebidas"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setCategoriaModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-save" disabled={categoriaLoading}>
                  {categoriaLoading ? "Salvando..." : "Criar Categoria"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}