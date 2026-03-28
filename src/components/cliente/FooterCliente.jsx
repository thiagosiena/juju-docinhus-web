import React from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiMessageCircle, FiMapPin, FiMail } from "react-icons/fi";
import "./FooterCliente.css";

export default function FooterCliente() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-cliente">
      <div className="footer-container">
        
        {/* Coluna 1: A Marca */}
        <div className="footer-section brand-section">
          <h3 className="footer-brand">Juju Docinhus</h3>
          <p className="footer-text">
            Transformando açúcar em afeto. Nossos doces são feitos artesanalmente 
            com os melhores ingredientes para adoçar o seu dia.
          </p>
        </div>

        {/* Coluna 2: Navegação */}
        <div className="footer-section">
          <h4 className="footer-title">Navegação</h4>
          <ul className="footer-links">
            <li><Link to="/">Início</Link></li>
            <li><Link to="/sobre">Sobre a Loja</Link></li>
            <li><Link to="/carrinho">Meu Carrinho</Link></li>
          </ul>
        </div>

        {/* Coluna 3: Contato e Sociais */}
        <div className="footer-section">
          <h4 className="footer-title">Fale Conosco</h4>
          <ul className="footer-contact-info">
            <li><FiMapPin className="contact-icon" /> Ribeirão Preto, SP</li>
            <li><FiMail className="contact-icon" /> contato@jujudocinhus.com</li>
          </ul>
          
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="Instagram">
              <FiInstagram size={22} />
            </a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn" title="WhatsApp">
              <FiMessageCircle size={22} />
            </a>
          </div>
        </div>

      </div>

      {/* Barra Inferior (Copyright) */}
      <div className="footer-bottom">
        <p>
          © {currentYear} <strong>Juju Docinhus</strong>. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}