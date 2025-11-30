import { Outlet } from "react-router-dom";
import HeaderCliente from "../components/cliente/HeaderCliente";
import FooterCliente from "../components/cliente/FooterCliente";
import "../styles/layout.css";

export default function ClienteLayout() {
  return (
    <div className="cliente-layout">
      {/* HEADER FIXO */}
      <HeaderCliente />

      {/* ÁREA DO CONTEÚDO */}
      <main className="cliente-main">
        <Outlet />
      </main>
      
      {/* Footer FIXO */}
      <FooterCliente/>
    </div>
  );
}
