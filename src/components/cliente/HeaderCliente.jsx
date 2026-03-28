import React, { useMemo, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./HeaderCliente.css";
import logo from "../../assets/logo.png"; 
import { FiShoppingCart, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi"; 

import { useCart } from "../../context/CartContext";
import { useFirebaseAuth } from "../../context/FirebaseAuthContext";

export default function HeaderCliente() {
  const location = useLocation();
  const { items } = useCart();
  const { currentUser, logout } = useFirebaseAuth();
  
  // Estado para controlar se o menu do perfil está aberto ou fechado
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Efeito para fechar o menu se o usuário clicar fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantidade, 0);
  }, [items]);

  // Função para pegar a foto do Firebase ou gerar uma com a inicial do nome
  const getAvatar = () => {
    if (currentUser?.photoURL) {
      return currentUser.photoURL;
    }
    const nome = currentUser?.displayName || "Cliente";
    return `https://ui-avatars.com/api/?name=${nome}&background=ff4757&color=fff&rounded=true&bold=true`;
  };

  return (
    <header className="header-cliente">
      <div className="header-container">
      
        <Link to="/" className="logo-container">
          <img src={logo} alt="Juju Docinhus Logo" className="logo-img" />
          <h1 className="logo-title">Juju Docinhus</h1>
        </Link>

        <nav className="menu-cliente">
          <Link 
            to="/" 
            className={`menu-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Início
          </Link>

          <Link 
            to="/sobre" 
            className={`menu-link ${location.pathname === '/sobre' ? 'active' : ''}`}
          >
             Sobre
          </Link>

          {/* MÁGICA DO PERFIL COM DROPDOWN AQUI */}
          {currentUser ? (
            <div className="profile-dropdown-container" ref={menuRef}>
              <button 
                className="profile-trigger-btn"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <img src={getAvatar()} alt="Perfil" className="profile-avatar" />
                <span className="profile-name">
                  {currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'Conta'}
                </span>
                <FiChevronDown size={16} className={`chevron-icon ${isProfileMenuOpen ? 'open' : ''}`} />
              </button>

              {/* O Menu flutuante */}
              {isProfileMenuOpen && (
                <div className="profile-dropdown-menu">
                  <div className="dropdown-header">
                    <strong>{currentUser.displayName || "Cliente"}</strong>
                    <small>{currentUser.email}</small>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  {/* Dá pra colocar um "Meus Pedidos" aqui no futuro */}
                  
                  <button 
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }} 
                    className="dropdown-item logout-btn"
                  >
                    <FiLogOut size={16} /> Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className={`menu-link ${location.pathname === '/login' ? 'active' : ''}`} 
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <FiUser size={18} /> Entrar
            </Link>
          )}

          <Link to="/carrinho" className="carrinho-btn">
            <FiShoppingCart className="cart-icon-svg" size={20} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}