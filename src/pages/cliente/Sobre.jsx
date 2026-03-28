import React from "react";
import "../../styles/Sobre.css";
import logo from "../../assets/logo.png"; 
import { FiGlobe, FiLayers, FiCode, FiBookOpen } from "react-icons/fi";

export default function Sobre() {
  return (
    <div className="sobre-container">
      <div className="sobre-header">
        <img src={logo} alt="Juju Docinhus Logo" className="sobre-logo" />
        <h1 className="sobre-title">Sobre a Plataforma</h1>
        <span className="sobre-version">Web v1.0.0</span>
      </div>

      <div className="sobre-content">
        <div className="sobre-card">
          <div className="card-header">
            <FiGlobe className="card-icon" />
            <h2>O Projeto Juju Docinhus</h2>
          </div>
          <p>
            O <strong>Juju Docinhus</strong> nasceu com o propósito de revolucionar e modernizar o atendimento de estabelecimentos gastronômicos. Mais do que um simples cardápio, é uma plataforma digital completa que permite aos clientes uma navegação rápida, segura e interativa na hora de realizar e acompanhar seus pedidos.
          </p>
        </div>

        <div className="sobre-card">
          <div className="card-header">
            <FiLayers className="card-icon" />
            <h2>Arquitetura e Ecossistema</h2>
          </div>
          <p>
            Esta interface Web (desenvolvida em <strong>React</strong>) é apenas uma parte de um ecossistema robusto. O sistema conta com uma poderosa API REST construída em <strong>Python (FastAPI)</strong>, que gerencia todo o banco de dados e alimenta simultaneamente este site e um aplicativo Mobile nativo construído em <strong>Flutter</strong>.
          </p>
        </div>

        <div className="sobre-card">
          <div className="card-header">
            <FiCode className="card-icon" />
            <h2>Desenvolvedor Full-Stack</h2>
          </div>
          <p style={{ marginBottom: '12px' }}>
            Todo o ecossistema desde a modelagem do banco de dados e construção da API, até as interfaces do aplicativo Mobile e deste site Web foi projetado e desenvolvido de ponta a ponta por:
          </p>
          <ul className="equipe-list">
            <li>Thiago Siena</li>
          </ul>
        </div>

        <div className="sobre-card">
          <div className="card-header">
            <FiBookOpen className="card-icon" />
            <h2>Contexto Acadêmico</h2>
          </div>
          <p style={{ marginBottom: '12px' }}>
            Este projeto foi desenvolvido como requisito de avaliação prática e integração de tecnologias para o curso de Engenharia da Computação da <strong>Universidade de Ribeirão Preto (UNAERP)</strong>.
          </p>
          <ul className="academico-list">
            <li><strong>Disciplina Web:</strong> Prática Extensionista VII</li>
            <li><strong>Disciplina Mobile:</strong> Prática Extensionista VIII</li>
            <li><strong>Professor Orientador:</strong> Rodrigo de Oliveira Plotze</li>
          </ul>
        </div>
      </div>
    </div>
  );
}