import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import "./HeaderCliente.css";
import logo from "../../assets/logo.png"; 
import { FiShoppingCart } from "react-icons/fi"; 

import { useCart } from "../../context/CartContext";

export default function HeaderCliente() {
  const location = useLocation();
  
  const { items } = useCart();

  const cartCount = useMemo(() => {

    return items.reduce((acc, item) => acc + item.quantidade, 0);
  }, [items]);

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
          

          <Link to="/admin" className="menu-admin-btn">
            Admin
          </Link>

          <Link to="/carrinho" className="carrinho-btn">
            <FiShoppingCart className="cart-icon-svg" size={20} />
            
    
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}