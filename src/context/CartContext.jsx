import { createContext, useContext, useMemo, useState } from "react";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  
  const { showToast } = useToast(); 

  function addItem(produto, quantidade = 1) {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === produto.id);
      if (existing) {
        return prev.map((p) =>
          p.id === produto.id
            ? { ...p, quantidade: p.quantidade + quantidade }
            : p
        );
      }
      return [...prev, { ...produto, quantidade }];
    });

    showToast(`${produto.nome} foi adicionado ao carrinho!`);
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function updateQuantity(id, quantidade) {
    if (quantidade <= 0) {
      return removeItem(id);
    }
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantidade } : p))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = useMemo(
    () => items.reduce((acc, item) => acc + Number(item.preco) * item.quantidade, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart, total }),
    [items, total]
  );

  return (
    <CartContext.Provider value={value}>
      {children}

    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}