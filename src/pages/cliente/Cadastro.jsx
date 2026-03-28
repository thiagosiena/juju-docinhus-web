import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFirebaseAuth } from "../../context/FirebaseAuthContext";
import { FiArrowLeft } from "react-icons/fi";
import "../../styles/Cadastro.css";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmaSenha: "",
  });

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useFirebaseAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmaSenha) {
      return setErro("As senhas não coincidem.");
    }

    try {
      setErro("");
      setLoading(true);

      await register(formData.email, formData.senha, formData.nome);
      navigate("/");
    } catch (error) {
      setErro("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-box">

        <Link to="/login" className="back-link">
          <FiArrowLeft size={16} /> Já tenho conta
        </Link>

        <div className="cadastro-header">
          <h2>Criar conta</h2>
          <p>Leva menos de 1 minuto</p>
        </div>

        {erro && <div className="erro">{erro}</div>}

        <form onSubmit={handleCadastro} className="cadastro-form">
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            onChange={handleChange}
            className="input"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            onChange={handleChange}
            className="input"
            required
          />

          <input
            type="tel"
            name="telefone"
            placeholder="Telefone"
            onChange={handleChange}
            className="input"
            required
          />

          <div className="input-row">
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              onChange={handleChange}
              className="input"
              required
            />

            <input
              type="password"
              name="confirmaSenha"
              placeholder="Confirmar"
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="cadastro-btn"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

      </div>
    </div>
  );
}