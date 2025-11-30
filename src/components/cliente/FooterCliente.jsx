import { Link } from "react-router-dom";
import "./FooterCliente.css";

export default function FooterCliente() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-cliente">
      <div className="footer-container">
        
      
        <div className="footer-section">
          <h3 className="footer-brand">Juju Docinhos</h3>
          <p className="footer-text">
            Transformando açúcar em afeto. Nossos doces são feitos artesanalmente 
            com os melhores ingredientes para adoçar a sua vida.
          </p>
        </div>

        
        <div className="footer-section">
          <h4 className="footer-title">Navegação</h4>
          <ul className="footer-links">
            <li><Link to="/">Início</Link></li>
           
            <li><Link to="/carrinho">Meu Carrinho</Link></li>
            <li><Link to="/admin">Acesso Admin</Link></li>
          </ul>
        </div>

        
        <div className="footer-section">
          <h4 className="footer-title">Fale Conosco</h4>
          <p className="footer-text">Entregas em toda a região.</p>
          
          <div className="footer-socials">
            
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn instagram">
              Instagram
            </a>
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="social-btn whatsapp">
              WhatsApp
            </a>
          </div>
        </div>

      </div>

     
      <div className="footer-bottom">
        <p>
          © {currentYear} <strong>Juju Docinhos</strong>. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}