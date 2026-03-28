import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useFirebaseAuth } from "../../context/FirebaseAuthContext";
import { FiArrowLeft } from "react-icons/fi";
import "../../styles/Login.css";

export default function LoginCliente() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useFirebaseAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Puxando mensagem e o TIPO da mensagem (se não vier, assume que é warning)
    const mensagemAlerta = location.state?.mensagem;
    const tipoAlerta = location.state?.tipo || "warning"; 

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !senha) {
            setErro("Preencha todos os campos.");
            return;
        }

        try {
            setErro("");
            setLoading(true);
            await login(email, senha);

            if (location.state?.mensagem) {
                navigate("/checkout");
            } else {
                navigate("/");
            }

        } catch (error) {
            console.error("Erro no login:", error);
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                setErro("E-mail ou senha inválidos. Tente novamente.");
            } else {
                setErro("Ocorreu um erro ao fazer login. Tente novamente mais tarde.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="login-container">
                <div className="login-box">
                    {/* Botão de voltar agora vai ficar no canto esquerdo */}
                    <Link to="/" className="back-nav">
                        <FiArrowLeft size={18} style={{ marginRight: '6px' }}/> Voltar
                    </Link>
                    
                    <div className="login-header">
                        <h2>Bem-vindo!</h2>
                        <p>Faça login para continuar</p>
                    </div>

                    {mensagemAlerta && (
                        <div className={`alert-message ${tipoAlerta}`}>
                            {mensagemAlerta}
                        </div>
                    )}

                    {erro && <div className="alert-message error">{erro}</div>}

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <label>E-mail</label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
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

                        <div className="form-actions">
                            <Link to="/recuperar-senha" className="forgot-password">
                                Esqueceu a senha?
                            </Link>
                        </div>

                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            {loading ? "Entrando..." : "Entrar"}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
                        </p>
                    </div>
                </div>
            </div>

            <div
                className="admin-secret-zone"
                onClick={() => navigate("/admin")}
                title="Área Restrita"
            />
        </>
    );
}