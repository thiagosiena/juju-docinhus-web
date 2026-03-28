import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFirebaseAuth } from "../../context/FirebaseAuthContext";
import { FiArrowLeft } from "react-icons/fi";
import "../../styles/Login.css";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const { resetPassword } = useFirebaseAuth();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setMensagem("E-mail de recuperação enviado!");
    } catch (error) { setErro("E-mail não encontrado."); }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <Link to="/login" className="back-nav"><FiArrowLeft /> Voltar ao Login</Link>
        <div className="login-header">
          <h2>Recuperar Senha</h2>
          <p>Enviaremos um link para o seu e-mail.</p>
        </div>
        {erro && <div className="alert-message error">{erro}</div>}
        {mensagem && <div className="alert-message success" style={{ background: '#d4edda', color: '#155724' }}>{mensagem}</div>}
        <form onSubmit={handleReset} className="login-form">
          <div className="input-group">
            <label>E-mail Cadastrado</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
          </div>
          <button type="submit" className="login-submit-btn">Enviar Instruções</button>
        </form>
      </div>
    </div>
  );
}