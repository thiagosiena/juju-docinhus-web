import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../../styles/Login.css";
import { useAuth } from "../../context/AuthContext";

const API_URL = "http://127.0.0.1:8000";

export default function Login() {
  const [email, setEmail] = useState("");
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
        username: email,        
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
        throw new Error(errBody.detail || "Falha ao autenticar");
      }

      const data = await resp.json();
      login(data.access_token);          

      navigate("/admin/dashboard");
    } catch (e) {
      setErro(e.message || "Erro ao realizar login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        
      
        <div className="login-header">
          <Link to="/" className="login-back-link">
            ← Voltar
          </Link>
          <h2>Admin Login</h2>
        </div>

        <form onSubmit={handleLogin}>
          <label>Usuário ou Email:</label>
          <input
            type="text" 
            placeholder="Ex: admin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />

          <label>Senha:</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          {erro && <div className="login-error">{erro}</div>}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Entrando..." : "Acessar Painel"}
          </button>
        </form>
      </div>
    </div>
  );
}