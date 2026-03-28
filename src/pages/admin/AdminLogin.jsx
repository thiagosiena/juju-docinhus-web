import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../../styles/AdminLogin.css"; 
import { useAuth } from "../../context/AuthContext";
import { FiArrowLeft } from "react-icons/fi"; 

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function AdminLogin() {
  const [usuario, setUsuario] = useState(""); 
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const body = new URLSearchParams({
        username: usuario,        
        password: senha,
        grant_type: "password",
      });

      const resp = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        throw new Error(errBody.detail || "Credenciais inválidas. Tente novamente.");
      }

      const data = await resp.json();
      
      login(data.access_token);          
      navigate("/admin/dashboard");
    } catch (e) {
      setErro(e.message || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        
        {/* Botão de voltar elegante no topo esquerdo */}
        <Link to="/" className="admin-back-link">
          <FiArrowLeft size={16} /> Voltar
        </Link>
        
        <div className="admin-login-header">
          <h2>Painel <span>Restrito</span></h2>
          <p className="admin-subtitle">Gestão do Juju Docinhus</p>
        </div>

        {erro && <div className="admin-login-error">{erro}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Usuário</label>
            <input
              type="text" 
              placeholder="Ex: admin"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-admin-login" disabled={loading}>
            {loading ? "Autenticando..." : "Acessar Painel"}
          </button>
        </form>

      </div>
    </div>
  );
}