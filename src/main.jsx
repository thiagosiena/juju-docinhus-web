import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { FirebaseAuthProvider } from './context/FirebaseAuthContext.jsx'; // O Cliente


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FirebaseAuthProvider>
          <ToastProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </ToastProvider>
        </FirebaseAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
